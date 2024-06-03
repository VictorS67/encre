import { RecordId } from '../load/keymap.js';
import { Queue } from '../utils/algorithm.js';
import { getRecordId } from '../utils/nanoid.js';
import { BaseGraph, NodeProcessInfo } from './graph.js';
import { NodeImpl } from './nodes/base.js';
import { SerializableNode } from './nodes/index.js';

/**
 * Represents the distance metrics for a graph node.
 */
interface DistanceVector {
  /**
   * The cumulative cost or distance to reach this node from the start node.
   */
  distance: number;

  /**
   * The maximum weight of any edge leading to this node, used in path optimization.
   */
  maxEdgeWeight: number;
}

/**
 * Provides information about the connection from a previous node to the current node.
 * This is used to trace the path taken to reach a node during graph processing.
 */
interface PreviousVector {
  /**
   * The node ID that connects to the current node.
   */
  prevNodeId: RecordId;

  /**
   * The weight of the edge connecting the previous node to the current node.
   */
  edgeWeight: number;
}

/**
 * `GraphScheduler` is responsible for scheduling nodes within a graph.
 * It organizes nodes into groups based on dependencies and critical paths to optimize execution order.
 * The scheduler uses topological sorting to determine execution order and attempts to merge groups to minimize cross-group communication.
 */
export class GraphScheduler {
  /**
   * The graph associated with the scheduler instance. This property holds a reference
   * to the `BaseGraph` instance that the scheduler operates on. It provides the necessary
   * graph structure and node information required for scheduling tasks.
   */
  readonly #graph: BaseGraph;

  /**
   * The maximum number of nodes that can be grouped together in a single scheduling set.
   * This limit is used to ensure that groups are kept to a manageable size, optimizing
   * the scheduling and execution of tasks within the graph. The default value is set to 100,
   * balancing the complexity and performance of the scheduling process.
   */
  readonly #groupLimit: number = 100;

  /**
   * Constructs a `GraphScheduler` for a given graph.
   * @param graph The graph to schedule.
   */
  constructor(graph: BaseGraph) {
    this.#graph = graph;
  }

  /**
   * Schedules the nodes of the graph into groups for execution.
   * Nodes are grouped to maximize parallel execution while respecting dependencies.
   * @returns An array of tuples, each containing a unique processor ID and an array of node IDs assigned to that processor.
   */
  schedule(): Array<[string, RecordId[]]> {
    const [groupSet, criticalPath] = this.#grouping();

    return groupSet.map((group) => [getRecordId(), group]);
  }

  /**
   * Groups nodes in the graph while identifying the critical path.
   * This method uses topological sorting to organize nodes into executable groups
   * and identifies the critical path which influences the overall processing time.
   * @returns A tuple containing an array of node groups and a set of nodes forming the critical path.
   *
   * @internal
   */
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

  /**
   * Initializes the graph for scheduling by setting up initial groups and calculating in-degrees of nodes.
   * Nodes with zero in-degree are added to the scheduling queue as starting points.
   * @param groupSet An array to accumulate initial groups of node IDs.
   * @returns A map of node IDs to their respective in-degrees.
   *
   * @internal
   */
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

  /**
   * Performs a topological search to calculate the longest distance to each node from the start nodes.
   * This method helps in scheduling by determining the critical order of node execution.
   * @param inDegreeVecMap A map of node IDs to their current in-degree counts.
   * @param groupSet The current set of node groups.
   * @returns A tuple containing maps for node distances and previous node vectors for path reconstruction.
   *
   * @internal
   */
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
        distance: this.#getNodeRunTime(nodeId),
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
        const toNodeRunTime: number = this.#getNodeRunTime(toNode.id);

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

  /**
   * Determines the longest distance from the start node to any node in the graph.
   * This distance helps identify the end of the critical path in the graph.
   * @param distVecMap A map of node IDs to their distance vectors.
   * @returns A tuple of the maximum distance and the node ID at that distance.
   *
   * @internal
   */
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

  /**
   * Attempts to merge nodes along the critical path into a single group to minimize inter-group communication.
   * @param critVecEntries Sorted entries of nodes on the critical path by descending edge weight.
   * @param groupSet The current set of node groups.
   * @returns `true` if any path was merged successfully; otherwise, `false`.
   *
   * @internal
   */
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

  /**
   * Checks if two nodes can be merged into the same execution group.
   * Merging is feasible if the combined size of the groups for the two nodes does not exceed the group limit.
   * @param node1 The first node ID to consider for merging.
   * @param node2 The second node ID to consider for merging.
   * @param groupSet The current set of node groups.
   * @returns `true` if the nodes are mergeable; otherwise, `false`.
   *
   * @internal
   */
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

  /**
   * Finds the group set that contains the specified node ID.
   * @param nodeId The node ID to search for within the group sets.
   * @param groupSet The array of current group sets.
   * @returns The group set containing the node ID.
   * @throws Error if the node ID is not found in any group set.
   *
   * @internal
   */
  #findSet(nodeId: RecordId, groupSet: RecordId[][]): RecordId[] {
    for (const nodeSet of groupSet) {
      if (nodeSet.includes(nodeId)) {
        return nodeSet;
      }
    }

    throw new Error(`CANNOT find node ${nodeId} in the group set`);
  }

  /**
   * Retrieves the estimated runtime for a node within the graph.
   * If the node is part of a subgraph, aggregates runtimes of all subgraph nodes.
   * @param nodeId The node ID whose runtime is requested.
   * @returns The runtime of the node in milliseconds.
   * @throws Error if the node does not exist in the graph.
   *
   * @internal
   */
  #getNodeRunTime(nodeId: RecordId): number {
    const node: SerializableNode | undefined = this.#graph.nodeMap[nodeId];

    if (!node) {
      throw new Error(`CANNOT find node: ${node} in graph`);
    }

    let processInfo: NodeProcessInfo | undefined =
      this.#graph.nodeProcessInfoMap[node.id];
    if (node.type === 'graph') {
      const subGraphProcessInfoMap: Record<RecordId, NodeProcessInfo> = (
        node.data as BaseGraph
      ).nodeProcessInfoMap;

      const subGraphNodes: SerializableNode[] = (node.data as BaseGraph)
        .flattenNodes;

      let subGraphRuntime = 0;
      let subGraphMemory = 0;
      for (const subGraphNode of subGraphNodes) {
        const subGraphNodeProcessInfo: NodeProcessInfo | undefined =
          this.#graph.nodeProcessInfoMap[subGraphNode.id] ??
          subGraphProcessInfoMap[subGraphNode.id];

        subGraphRuntime += subGraphNodeProcessInfo?.runtime ?? 0;
        subGraphMemory += subGraphNodeProcessInfo?.memory ?? 0;
      }

      processInfo = { runtime: subGraphRuntime, memory: subGraphMemory };
    }

    return processInfo ? processInfo.runtime : node.runtime ?? 0;
  }
}
