import os from 'os';
import { performance } from 'perf_hooks';

import { RecordId } from '../load/keymap.js';
import { Queue } from '../utils/algorithm.js';
import { BaseGraph } from './graph.js';
import { SerializableNode } from './nodes/index.js';

export class GraphScheduler {
  readonly #graph: BaseGraph;

  // readonly #bandwidth: number;

  // readonly #maxMemUsage: number;

  readonly #groupLimit: number = 100;

  #groupSet: RecordId[][];

  // #nodeInfo: Record<string, number>;

  constructor(graph: BaseGraph) {
    this.#graph = graph;

    // check bandwidth in reading 25 MB data
    // this.#bandwidth = measureReadBandwidth(25 * 1024 * 1024);

    // const memory = 256 * 1024 * 1024; // suppose the memory should be at least 256 MB
    // const reservedMemPercentage = measureReservedMemPercentage();

    // this.#maxMemUsage = 0;
    // for (const node of this.#graph.flattenNodes) {
    //   this.#maxMemUsage =
    //     (1 - reservedMemPercentage - (node.memory ?? 0)) * memory;
    // }

    this.#groupSet = [];
    // this.#nodeInfo = {};
    // this.#nodeInfo[getRecordId()] = 96;
  }

  grouping() {
    const criticalPathFunctions = new Set();

    const inDegreeVec: Record<RecordId, number> = this.#initGraph();

    for (;;) {
      // break if every node is in same group
      if (this.#groupSet.length === 1) {
        break;
      }

      // topo dp: find each node's longest distance and it's predecessor
      const inDegreeVecCpy = { ...inDegreeVec };

      const [distVec, prevVec] = this.#topoSearch(inDegreeVecCpy);

      // console.log(`distVec: ${JSON.stringify(distVec)}`);
      // console.log(`prevVec: ${JSON.stringify(prevVec)}`);

      const [critLength, nodeName] = this.#getLongestDis(distVec);

      // console.log(`critLength: ${critLength}`);
      // console.log(`tmpNodeName: ${nodeName}`);

      // find the longest path, edge descent sorted
      criticalPathFunctions.clear();
      const critVec: Record<RecordId, [RecordId, number]> = {};

      let tmpNodeName: RecordId | undefined = nodeName;
      while (
        tmpNodeName &&
        !this.#graph.graphStartNodeIds.includes(tmpNodeName)
      ) {
        const a = [prevVec[tmpNodeName][0]!, prevVec[tmpNodeName][1]!];
        const b = prevVec[tmpNodeName][0];
        // console.log(`critVec[tmpNodeName]: ${JSON.stringify(a)}`);
        // console.log(`new tmpNodeName: ${b}`);

        critVec[tmpNodeName] = [
          prevVec[tmpNodeName][0]!,
          prevVec[tmpNodeName][1]!,
        ];
        tmpNodeName = prevVec[tmpNodeName][0];
      }

      // console.log(`critVec: ${JSON.stringify(critVec)}`);

      const newCritVec: [string, [RecordId, number]][] = Object.entries(
        critVec
      ).sort((a, b) => b[1][1] - a[1][1]);

      // console.log(`newCritVec: ${JSON.stringify(newCritVec)}`);

      for (const [k, v] of newCritVec) {
        criticalPathFunctions.add(k);
        criticalPathFunctions.add(v[0]);
      }

      // console.log(
      //   `criticalPathFunctions: ${JSON.stringify(
      //     Array.from(criticalPathFunctions)
      //   )}`
      // );

      if (!this.#mergePath(newCritVec)) {
        break;
      }
      // console.log('');
    }

    return [this.#groupSet, criticalPathFunctions];
  }

  #initGraph() {
    const inDegreeVec: Record<RecordId, number> = {};
    const queue = new Queue<SerializableNode>();
    const visitedNodeIds: Set<RecordId> = new Set();

    // console.log(`graphStartNodeIds: ${this.#graph.graphStartNodeIds}`);

    if (this.#graph.graphStartNodeIds.length === 0) {
      throw new Error(
        'CANNOT find any starter node. Please double-check if the graph is cyclic'
      );
    }

    for (const nodeId of this.#graph.graphStartNodeIds) {
      queue.enqueue(this.#graph.nodeMap[nodeId]);
      this.#groupSet.push([nodeId]);
    }

    while (!queue.isEmpty()) {
      const node = queue.dequeue()!;

      visitedNodeIds.add(node.id);

      const toNodes = this.#graph.getToNodes(node);

      for (const toNode of toNodes) {
        if (visitedNodeIds.has(toNode.id)) {
          throw new Error(`The graph is cyclic at node: ${toNode.id}`);
        }

        if (!(toNode.id in inDegreeVec)) {
          inDegreeVec[toNode.id] = 1;
          queue.enqueue(toNode);
          this.#groupSet.push([toNode.id]);
        } else {
          inDegreeVec[toNode.id] += 1;
        }
      }
    }

    // console.log(`inDegreeVec: ${JSON.stringify(inDegreeVec)}`);
    // console.log(`groupSet: ${JSON.stringify(this.#groupSet)}`);

    return inDegreeVec;
  }

  #topoSearch(
    inDegreeVec: Record<RecordId, number>
  ): [
    Record<RecordId, [number, number]>,
    Record<RecordId, [RecordId | undefined, number | undefined]>,
  ] {
    const distVec: Record<RecordId, [number, number]> = {};
    const prevVec: Record<
      RecordId,
      [RecordId | undefined, number | undefined]
    > = {};
    const queue = new Queue<SerializableNode>();

    for (const nodeId of this.#graph.graphStartNodeIds) {
      const node: SerializableNode = this.#graph.nodeMap[nodeId];

      queue.enqueue(node);
      distVec[nodeId] = [node.runtime ?? 0, 0];
      prevVec[nodeId] = [undefined, undefined];
    }

    while (!queue.isEmpty()) {
      const node: SerializableNode = queue.dequeue()!;

      const preDist: [number, number] = distVec[node.id];
      const prevNodeId: RecordId = node.id;

      const toNodes = this.#graph.getToNodes(node);
      for (let i = 0; i < toNodes.length; i++) {
        const toNode: SerializableNode = toNodes[i];
        const toNodeId: RecordId = toNode.id;
        const toNodeRunTime: number = toNode.runtime ?? 0;

        let w = 1;
        if (this.#findSet(prevNodeId).includes(toNodeId)) {
          w = w / 15;
        }

        if (!(toNodeId in distVec)) {
          distVec[toNodeId] = [
            preDist[0] + w + toNodeRunTime,
            Math.max(preDist[1], w),
          ];
          prevVec[toNodeId] = [prevNodeId, w];
        } else if (distVec[toNodeId][0] < preDist[0] + w + toNodeRunTime) {
          distVec[toNodeId] = [
            preDist[0] + w + toNodeRunTime,
            Math.max(preDist[1], w),
          ];
          prevVec[toNodeId] = [prevNodeId, w];
        } else if (
          distVec[toNodeId][0] === preDist[0] + w + toNodeRunTime &&
          Math.max(preDist[1], w) > distVec[prevNodeId][1]
        ) {
          distVec[toNodeId][1] = Math.max(preDist[1], w);
          prevVec[toNodeId] = [prevNodeId, w];
        }

        inDegreeVec[toNodeId] -= 1;

        if (inDegreeVec[toNodeId] === 0) {
          queue.enqueue(toNode);
        }
      }
    }

    return [distVec, prevVec];
  }

  #getLongestDis(
    distVec: Record<RecordId, [number, number]>
  ): [number, RecordId | undefined] {
    let dist = 0;
    let nodeId: RecordId | undefined;

    for (const node of this.#graph.flattenNodes) {
      if (distVec[node.id][0] > dist) {
        dist = distVec[node.id][0];
        nodeId = node.id;
      }
    }

    return [dist, nodeId];
  }

  #mergePath(critVec: [string, [RecordId, number]][]): boolean {
    for (const edge of critVec) {
      const a = edge[1][0];
      const b = edge[0];

      // console.log(`edge1: ${a}`);
      // console.log(`edge2: ${b}`);

      if (this.#mergeable(edge[1][0], edge[0] as RecordId)) {
        return true;
      }
    }

    return false;
  }

  #mergeable(node1: RecordId, node2: RecordId): boolean {
    const nodeSet1 = this.#findSet(node1);

    // console.log(`nodeSet1: ${JSON.stringify(nodeSet1)}`);

    // check if two nodes are in the same set
    if (nodeSet1.includes(node2)) {
      return false;
    }

    const nodeSet2 = this.#findSet(node2);

    // console.log(`nodeSet2: ${JSON.stringify(nodeSet2)}`);

    // check if group size is no larger than the group limit
    if (nodeSet1.length + nodeSet2.length > this.#groupLimit) {
      return false;
    }

    const newGroupSet: RecordId[] = [...new Set([...nodeSet1, ...nodeSet2])];

    // console.log(`newGroupSet: ${JSON.stringify(newGroupSet)}`);

    this.#groupSet.splice(this.#groupSet.indexOf(nodeSet1), 1);
    this.#groupSet.splice(this.#groupSet.indexOf(nodeSet2), 1);
    this.#groupSet.push(newGroupSet);

    // console.log(`groupSet: ${JSON.stringify(this.#groupSet)}`);

    return true;
  }

  #findSet(nodeId: RecordId): RecordId[] {
    for (const nodeSet of this.#groupSet) {
      if (nodeSet.includes(nodeId)) {
        return nodeSet;
      }
    }

    throw new Error(`CANNOT find node ${nodeId} in the group set`);
  }
}

// function generateData(size: number): Buffer {
//   return Buffer.alloc(size, "A");
// }

// function measureReadBandwidth(size: number): number {
//   const mockData: Buffer = generateData(size);

//   const startTime = performance.now();
//   const readData = Buffer.from(mockData);
//   const endTime = performance.now();

//   const elapsedTimeInSeconds = (endTime - startTime) / 1000;
//   const bandwidth = size / elapsedTimeInSeconds; // bytes per second

//   return bandwidth;
// }

// function measureReservedMemPercentage(): number {
//   const totalMemory = os.totalmem(); // Total memory in bytes
//   const freeMemory = os.freemem(); // Free memory in bytes

//   const reservedMemory = totalMemory - freeMemory;

//   const reservedMemoryPercentage = reservedMemory / totalMemory;

//   return reservedMemoryPercentage;
// }