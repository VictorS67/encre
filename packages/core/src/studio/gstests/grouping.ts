import { SubGraph } from "../graph";
import { NodeConnection } from "../nodes";
import { globalNodeRegistry } from "../nodes/registration";
import { RecordId } from "../../load/keymap";
import { start } from "repl";


const pdfLoaderNode = globalNodeRegistry.createDynamic("loader", "pdf");
const textSplitterNode = globalNodeRegistry.createDynamic(
  "splitter",
  "text"
);

const connection: NodeConnection = {
  fromNodeId: pdfLoaderNode.id,
  fromPortName: "contexts",
  toNodeId: textSplitterNode.id,
  toPortName: "input",
};

const graph = new SubGraph({
  nodes: [pdfLoaderNode, textSplitterNode],
  connections: [connection]
})

const flattenNodes = graph.flattenNodes;
const flattenConns = graph.flattenConnections;// get connection from nodecnnmaps, get runtime and memroy from nodeImplmap

const NETWORK_BAND: number = 2; // temporary hardcoded network bandwidth
let mem_usage: number = 0;
let max_mem_usage: number = 0;
let hashKey: number = 0;
const groupIp:Map<Array<RecordId>, number> = new Map<Array<RecordId>, number>();
const groupScale:Map<Array<RecordId>, number> = new Map<Array<RecordId>, number>();
let ipList: number[] = [100,200,300,400,500,600];
// let nodeInfo: { [key: number]: number } = {99: 10, 200: 10, 300: 10, 400: 10, 500: 10, 600: 10};
const defaultID: RecordId = "default" as RecordId;
const defaultLength: number = 0;


/**
 * Initializes the graph by calculating the in-degree of each node and populating the group set.
 * 
 * @param workflow - The subgraph workflow.
 * @param group_set - An array of record IDs representing the group set.
 * @returns A record containing the in-degree of each node.
 */
export function init_graph(workflow: SubGraph, group_set: Array<RecordId[]>, nodeInfo:{ [key: number]: number }): Record<RecordId, number> {
   
    const startPorts = workflow.graphInputNameMap; 
    const nodeConMap = workflow.nodeConnMap;
    const inDegreeVec: Record<RecordId, number> = {};
    const q: RecordId[] = [];

    for (let input of Object.values(startPorts)) {
        q.push(input.nodeId)
    }

    while (q.length > 0) {
        const node = q.shift();
        if (node == undefined) {
            break;
        }
        const connections = nodeConMap[node];
        for(let connection of connections) {
            if(connection.fromNodeId == node){
                const toNode = connection.toNodeId;
                q.push(toNode);
                if (inDegreeVec[toNode]) {
                    inDegreeVec[toNode]++;
                } else {
                    inDegreeVec[toNode] = 1;
                    group_set.push([toNode]);
                }
            }
        }
        
    }

    for (let s of group_set) {
        // group_ip[s] = ip_list[globalnode % 6];
        groupIp.set(s, ipList[hashKey % 6]);

        // group_scale[s[0]] = 1;
        groupScale.set(s, 1);
        nodeInfo[ipList[hashKey % 6]] -= 1;
        hashKey += 1;
    }
    return inDegreeVec;
}

/**
 * Finds the set that contains the specified node in the given group set.
 * 
 * @param node - The node to search for.
 * @param groupSet - The group set to search in.
 * @returns The set that contains the node, or undefined if not found.
 */
function findSet(node: RecordId, groupSet: Array<RecordId[]>): RecordId[] | undefined {
    for (let group of groupSet) {
        if (group.includes(node)) {
            return group;
        }
    }
    return undefined;
}

// type DistanceVector = Map<string, [number, number]>; // [dist, max_length]
// type PredecessorVector = Map<string, [string, number]>; // [prev_name, length]

/**
 * Performs a topological search on a workflow graph.
 * 
 * @param workflow - The workflow graph to perform the search on.
 * @param inDegreeVec - The in-degree vector of the graph nodes.
 * @param groupSet - The set of groups in the graph.
 * @param Intenet_latency - Optional parameter indicating whether to consider internet latency. Default is false.
 * @returns An array containing the distance vector and previous vector.
 */
function topo_search(workflow: SubGraph, inDegreeVec: Record<string, number>,
    groupSet: Array<RecordId[]>, Intenet_latency: boolean = false): [Record<RecordId, number[]>, {[name: RecordId]: [RecordId, number]}] {
    let distVec: Record<RecordId, number[]> = {};
    let prevVec: {[name: RecordId]: [RecordId, number]} = {};


    const startPorts = workflow.graphInputNameMap; 
    const nodeConMap = workflow.nodeConnMap;
    const nodeImplMap = workflow.nodeImplMap;
    const q: RecordId[] = [];
    const W: number = 10; // Temporay hardcoded network latency
    for (let input of Object.values(startPorts)) {
        q.push(input.nodeId)
        distVec[input.nodeId] = [nodeImplMap[input.nodeId].runtime, 0];
        prevVec[input.nodeId] = [defaultID, defaultLength];
    }

    while (q.length > 0) {
        const node = q.shift();
        if(node == undefined) {
            break;
        }
        const prev_dist = distVec[node];
        const prev_id = node;
        for(let connection of nodeConMap[node]){
            //need to clarify checking the from nodeId is necessary
            if(connection.fromNodeId === node){
                let w =W;
                const next_node = connection.toNodeId;
                if(findSet(prev_id, groupSet)?.includes(next_node)){
                    w = w / NETWORK_BAND;
                }
                if (!distVec[next_node] || distVec[next_node][0] < prev_dist[0] + nodeImplMap[next_node].runtime + w){
                    distVec[next_node] = [prev_dist[0] + nodeImplMap[next_node].runtime + w, Math.max(prev_dist[1], w)];
                    prevVec[next_node] = [prev_id, w];
                }
                else if (distVec[next_node][0] == prev_dist[0] + nodeImplMap[next_node].runtime + w){
                    if (Math.max(prev_dist[1], w) > distVec[next_node][1]){
                        distVec[next_node] = [prev_dist[0] + nodeImplMap[next_node].runtime + w, Math.max(prev_dist[1], w)];
                        prevVec[next_node] = [prev_id, w];
                    }
                }
                inDegreeVec[next_node]--;
                if (inDegreeVec[next_node] == 0){
                    q.push(next_node);
                }

            }
        }
    }
   
    return [distVec, prevVec];
}
//Temporarily hardcoded the config
const GOUP_LIMIT: number = 10;
/**
 * Checks if two nodes can be merged into a single group based on certain conditions.
 * 
 * @param node1 - The first node to be merged.
 * @param node2 - The second node to be merged.
 * @param workflow - The workflow containing the nodes.
 * @param groupSet - The array of group sets.
 * @returns A boolean indicating whether the nodes can be merged.
 */
function mergeable(node1: RecordId, node2: RecordId, workflow:SubGraph,  groupSet: Array<RecordId>[], nodeInfo: { [key: number]: number }): boolean {
    const nodeSet1 = findSet(node1, groupSet);
    if(!nodeSet1){
        return true;
    }
    if(nodeSet1?.includes(node2)){
        return false;
    }
    const nodeSet2 = findSet(node2, groupSet);
    if(!nodeSet2){
        return true;
    }
    //check if the group limit is reached
    if(nodeSet1.length + nodeSet2.length > GOUP_LIMIT){
        return false;
    }
    //check scale limit
    const newNodeInfo = { ...nodeInfo };
    const nodeSet1Scale = groupScale.get(nodeSet1); 
    const nodeSet2Scale = groupScale.get(nodeSet2);
    const idx1 = groupIp.get(nodeSet1);
    const idx2 = groupIp.get(nodeSet2);
    if(idx1 && nodeSet1Scale){
        newNodeInfo[idx1] -= nodeSet1Scale;
    }
    if(idx2 && nodeSet2Scale){
        newNodeInfo[idx2] -= nodeSet2Scale;
    }
    let bestFitAddr = -1;
    let bestFitScale = 10000;
    for(let [addr, value] of Object.entries(newNodeInfo)){
        if(value >= nodeSet1.length + nodeSet2.length && value < bestFitScale){
            bestFitAddr = parseInt(addr);
            bestFitScale = value;
        }
    }
    if(bestFitAddr == -1){
        return false;
    }
    
    //check memroy limit: skip for now, because we are running locally

    //merge sets and apdate scale
    const newGroupSet = [...nodeSet1, ...nodeSet2];
    groupSet.push(newGroupSet);
    groupIp.set(newGroupSet, bestFitAddr);
    if(nodeSet1Scale){
        nodeInfo[bestFitAddr] -= nodeSet1Scale;
    }
    if(nodeSet2Scale){
        nodeInfo[bestFitAddr] += nodeSet2Scale;
    }
    if(nodeSet1Scale && nodeSet2Scale){
        groupScale.set(newGroupSet, nodeSet1Scale + nodeSet2Scale);
    }
    const nodeIdx1 = groupIp.get(nodeSet1);
    if(nodeIdx1){  
        nodeInfo[nodeIdx1] += nodeSet1Scale? nodeSet1Scale : 0;
    }
    const nodeIdx2 = groupIp.get(nodeSet2);
    if(nodeIdx2){  
        nodeInfo[nodeIdx2] += nodeSet2Scale? nodeSet2Scale : 0;
    }
    groupSet = groupSet.filter(set => set !== nodeSet1);
    groupSet = groupSet.filter(set => set !== nodeSet2);
    groupIp.delete(nodeSet1);
    groupIp.delete(nodeSet2);
    groupScale.delete(nodeSet1);
    groupScale.delete(nodeSet2);
    return true;
}

/**
 * Merges the paths based on the given criteria vector, workflow, node information, and group set.
 * 
 * @param critVec - The criteria vector containing the source nodes and their corresponding values.
 * @param workflow - The subgraph workflow.
 * @param nodeInfo - The node information.
 * @param groupSet - The array of group sets.
 * @returns A boolean indicating whether the paths were successfully merged.
 */
function mergePath(critVec:{[name: RecordId]: [RecordId, number]}, workflow: SubGraph, nodeInfo: { [key: number]: number }, groupSet: Array<RecordId[]>): boolean {
    for(let [key, value] of Object.entries(critVec)){
        const sourceNode = key as RecordId;
        const targetNode = value[0] as RecordId
        if(mergeable(sourceNode, targetNode, workflow, groupSet, nodeInfo)){
            return false;
        }
    }
    // return true;
    return false;
    
}

/**
 * Finds the longest distance and corresponding nodeId from the given distVec.
 * 
 * @param workflow - The SubGraph object representing the workflow.
 * @param distVec - The record of distances for each nodeId.
 * @returns An array containing the longest distance and corresponding nodeId.
 */
function getLongestDist(workflow: SubGraph, distVec:Record<RecordId, number[]>): [number, RecordId] {
    let dist: number = 0;
    let nodeId: string = "default" as RecordId;

    Object.entries(distVec).forEach(([key, numbers]) => {
        // Check if the current array's first value is greater than the current known max
        if (numbers.length > 0 && numbers[0] > dist) {
            dist = numbers[0];
            nodeId = key;
        }
    });
    return [dist, nodeId as RecordId];
} 

/**
 * Checks if a given node ID is present in the start ports.
 * @param nodeId - The ID of the node to check.
 * @param startPorts - The start ports object containing node IDs and names.
 * @returns A boolean indicating whether the node ID is present in the start ports.
 */
function isNodeIdInStartPorts(nodeId: RecordId, startPorts: Record<string, { nodeId: RecordId; name: string }>) {
    // Extract all node IDs from startPorts
    const nodeIds = Object.values(startPorts).map(port => port.nodeId);
    // Check if nodeId is in the extracted list
    return nodeIds.includes(nodeId);
}

/**
 * Groups the nodes in a workflow and finds the critical path function.
 * 
 * @param workflow - The workflow as a SubGraph.
 * @param nodeInfo - An object containing information about each node.
 * @returns An array containing the grouped nodes and the critical path function.
 */
export function grouping(workflow: SubGraph, nodeInfo: { [key: number]: number }): [RecordId[][],Set<RecordId>] {
    let groupSet: Array<RecordId[]> = [];
    let criticalPathFunction: Set<RecordId> = new Set<RecordId>();
    let inDegreeVec = init_graph(workflow, groupSet, nodeInfo);
    while (true){
        if (groupSet.length == 1){
            break;
        }
        //topo dp: find each node's longest dis and its predecessor
        let [distVec, prevVec] = topo_search(workflow, inDegreeVec, groupSet);
        let [critLength, tmpNodeId] = getLongestDist(workflow, distVec);

        // find the longest path, edge descent sorted
        criticalPathFunction.clear();
        let crit_vec: {[name: RecordId]: [RecordId, number]} = {};
        const startPorts = workflow.graphInputNameMap;
        while(!isNodeIdInStartPorts(tmpNodeId, startPorts)){
            crit_vec[tmpNodeId] = prevVec[tmpNodeId];
            tmpNodeId = prevVec[tmpNodeId][0];
        }
        // sort the crit_vec
        const entries = Object.entries(crit_vec);
        entries.sort((a, b) => b[1][1] - a[1][1]); 

        // Convert it back to a Record
        const sortedCritVec = entries.reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
            }, {} as Record<RecordId, [RecordId, number]>);
        for(let [key, value] of Object.entries(sortedCritVec)){
            criticalPathFunction.add(key as RecordId);
            criticalPathFunction.add(value[0] as RecordId);
        }
        if(!mergePath(sortedCritVec, workflow, nodeInfo, groupSet)){
            break;
        }
    }

    return [groupSet, criticalPathFunction];
}

