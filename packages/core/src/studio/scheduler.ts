import { RecordId } from '../load/keymap.js';
import { Queue } from '../utils/algorithm.js';
import { getRecordId } from '../utils/nanoid.js';
import { BaseGraph } from './graph.js';
import { SerializableNode } from './nodes/index.js';

/**
 * `distance` indicating the cost/distance to the node,
 * `maxEdgeWeight` indicating the max edge weight from the start node
 * to the current node.
 */
interface DistanceVector {
  distance: number;
  maxEdgeWeight: number;
}

/**
 * `prevNodeId` indicating the node id that connect to the current node,
 * `edgeWeight` indicating the edge weight of the connection.
 */
interface PreviousVector {
  prevNodeId: RecordId;
  edgeWeight: number;
}

export class GraphScheduler {
  readonly #graph: BaseGraph;

  readonly #groupLimit: number = 100;

  constructor(graph: BaseGraph) {
    this.#graph = graph;
  }

  schedule(): Array<[string, RecordId[]]> {
    const [groupSet, criticalPath] = this.#grouping();

    return groupSet.map((group) => [getRecordId(), group]);
  }

  #grouping(): [RecordId[][], Set<RecordId>] {
    const criticalPath: Set<RecordId> = new Set();
    const groupSet: RecordId[][] = [];

    const inDegreeVecMap: Record<RecordId, number> = this.#initGraph(groupSet);

    for (;;) {
      // break if every node is in same group
      if (groupSet.length === 1) {
        break;
      }

      // topo dp: find each node's longest distance and it's predecessor
      const inDegreeVecCpy = { ...inDegreeVecMap };
      const [distVecMap, prevVecMap] = this.#topoSearch(
        inDegreeVecCpy,
        groupSet
      );

      const [critLength, nodeName] = this.#getLongestDis(distVecMap);

      // find the longest path, edge descent sorted
      criticalPath.clear();
      const critVecMap: Record<RecordId, PreviousVector> = {};

      let tmpNodeName: RecordId | undefined = nodeName;
      while (
        tmpNodeName &&
        prevVecMap[tmpNodeName] &&
        !this.#graph.graphStartNodeIds.includes(tmpNodeName)
      ) {
        critVecMap[tmpNodeName] = prevVecMap[tmpNodeName]!;
        tmpNodeName = prevVecMap[tmpNodeName]!.prevNodeId;
      }

      const critVecEntries: [string, PreviousVector][] = Object.entries(
        critVecMap
      ).sort((a, b) => b[1].edgeWeight - a[1].edgeWeight);

      // store the longest path as the critical path
      for (const [k, v] of critVecEntries) {
        criticalPath.add(k as RecordId);
        criticalPath.add(v!.prevNodeId);
      }

      // check if nodes in the critical path can be merged,
      // merge the path into one group set if it is mergeable
      if (!this.#mergePath(critVecEntries, groupSet)) {
        break;
      }
    }

    return [groupSet, criticalPath];
  }

  #initGraph(groupSet: RecordId[][]): Record<RecordId, number> {
    const inDegreeVecMap: Record<RecordId, number> = {};
    const queue = new Queue<SerializableNode>();
    const visitedNodeIds: Set<RecordId> = new Set();

    if (this.#graph.graphStartNodeIds.length === 0) {
      throw new Error(
        'CANNOT find any starter node. Please double-check if the graph is cyclic'
      );
    }

    for (const nodeId of this.#graph.graphStartNodeIds) {
      queue.enqueue(this.#graph.nodeMap[nodeId]);
      groupSet.push([nodeId]);
    }

    while (!queue.isEmpty()) {
      const node = queue.dequeue()!;

      visitedNodeIds.add(node.id);

      const toNodes = this.#graph.getToNodes(node);

      for (const toNode of toNodes) {
        if (visitedNodeIds.has(toNode.id)) {
          throw new Error(`The graph is cyclic at node: ${toNode.id}`);
        }

        if (!(toNode.id in inDegreeVecMap)) {
          inDegreeVecMap[toNode.id] = 1;
          queue.enqueue(toNode);
          groupSet.push([toNode.id]);
        } else {
          inDegreeVecMap[toNode.id] += 1;
        }
      }
    }

    return inDegreeVecMap;
  }

  #topoSearch(
    inDegreeVecMap: Record<RecordId, number>,
    groupSet: RecordId[][]
  ): [
    Record<RecordId, DistanceVector>,
    Record<RecordId, PreviousVector | undefined>,
  ] {
    const distVecMap: Record<RecordId, DistanceVector> = {};
    const prevVecMap: Record<RecordId, PreviousVector | undefined> = {};
    const queue = new Queue<SerializableNode>();

    for (const nodeId of this.#graph.graphStartNodeIds) {
      const node: SerializableNode = this.#graph.nodeMap[nodeId];

      queue.enqueue(node);
      distVecMap[nodeId] = {
        distance: node.runtime ?? 0,
        maxEdgeWeight: 0,
      };
      prevVecMap[nodeId] = undefined;
    }

    while (!queue.isEmpty()) {
      const node: SerializableNode = queue.dequeue()!;

      const preDist: DistanceVector = distVecMap[node.id];
      const prevNodeId: RecordId = node.id;

      const toNodes = this.#graph.getToNodes(node);
      for (let i = 0; i < toNodes.length; i++) {
        const toNode: SerializableNode = toNodes[i];
        const toNodeId: RecordId = toNode.id;
        const toNodeRunTime: number = toNode.runtime ?? 0;

        // w is the edge weight, this is related to cost in
        // sending/receiving the data between nodes
        let w = 1;
        if (this.#findSet(prevNodeId, groupSet).includes(toNodeId)) {
          // reduce the edge weight if two nodes are in the same group
          w = w / 15;
        }

        if (!(toNodeId in distVecMap)) {
          // The distance to the node equals to the sum of previous node
          // distance, edge weight, and current node runtime
          distVecMap[toNodeId] = {
            distance: preDist.distance + w + toNodeRunTime,
            maxEdgeWeight: Math.max(preDist.maxEdgeWeight, w),
          };
          prevVecMap[toNodeId] = { prevNodeId, edgeWeight: w };
        } else if (
          distVecMap[toNodeId].distance <
          preDist.distance + w + toNodeRunTime
        ) {
          // update the distance to the node
          distVecMap[toNodeId] = {
            distance: preDist.distance + w + toNodeRunTime,
            maxEdgeWeight: Math.max(preDist.maxEdgeWeight, w),
          };
          prevVecMap[toNodeId] = { prevNodeId, edgeWeight: w };
        } else if (
          distVecMap[toNodeId].distance ===
            preDist.distance + w + toNodeRunTime &&
          Math.max(preDist.maxEdgeWeight, w) >
            distVecMap[prevNodeId].maxEdgeWeight
        ) {
          // update the max edge weight
          distVecMap[toNodeId] = {
            ...distVecMap[toNodeId],
            maxEdgeWeight: Math.max(preDist.maxEdgeWeight, w),
          };
          prevVecMap[toNodeId] = { prevNodeId, edgeWeight: w };
        }

        inDegreeVecMap[toNodeId] -= 1;

        if (inDegreeVecMap[toNodeId] === 0) {
          queue.enqueue(toNode);
        }
      }
    }

    return [distVecMap, prevVecMap];
  }

  #getLongestDis(
    distVecMap: Record<RecordId, DistanceVector>
  ): [number, RecordId | undefined] {
    let distance = 0;
    let nodeId: RecordId | undefined;

    for (const node of this.#graph.flattenNodes) {
      if (distVecMap[node.id].distance > distance) {
        distance = distVecMap[node.id].distance;
        nodeId = node.id;
      }
    }

    return [distance, nodeId];
  }

  #mergePath(
    critVecEntries: [string, PreviousVector][],
    groupSet: RecordId[][]
  ): boolean {
    for (const critVecEntry of critVecEntries) {
      if (
        this.#mergeable(
          critVecEntry[1].prevNodeId,
          critVecEntry[0] as RecordId,
          groupSet
        )
      ) {
        return true;
      }
    }

    return false;
  }

  #mergeable(
    node1: RecordId,
    node2: RecordId,
    groupSet: RecordId[][]
  ): boolean {
    const nodeSet1 = this.#findSet(node1, groupSet);

    // check if two nodes are in the same set
    if (nodeSet1.includes(node2)) {
      return false;
    }

    const nodeSet2 = this.#findSet(node2, groupSet);

    // check if group size is no larger than the group limit
    if (nodeSet1.length + nodeSet2.length > this.#groupLimit) {
      return false;
    }

    const newGroupSet: RecordId[] = [...new Set([...nodeSet1, ...nodeSet2])];

    groupSet.splice(groupSet.indexOf(nodeSet1), 1);
    groupSet.splice(groupSet.indexOf(nodeSet2), 1);
    groupSet.push(newGroupSet);

    return true;
  }

  #findSet(nodeId: RecordId, groupSet: RecordId[][]): RecordId[] {
    for (const nodeSet of groupSet) {
      if (nodeSet.includes(nodeId)) {
        return nodeSet;
      }
    }

    throw new Error(`CANNOT find node ${nodeId} in the group set`);
  }
}
