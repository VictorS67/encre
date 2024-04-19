import { Graph } from "redis";
import { SubGraph } from "../graph";
import { NodeConnection } from "../nodes";
import { globalNodeRegistry } from "../nodes/registration";
import { RecordId } from "../../load/keymap";
import { group } from "console";


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
let globalnode: number = 0;
const group_ip: { [key: RecordId]: number} = {};
const group_scale: { [key: RecordId]: number } = {};
let ip_list: number[] = [100,200,300,400,500,600];
let node_info: { [key: number]: number } = {100: 10, 200: 10, 300: 10, 400: 10, 500: 10, 600: 10};
const defaultID: RecordId = "default" as RecordId;
const defaultLength: number = 0;


function init_graph(workflow: SubGraph, group_set: Array<RecordId[]>): Record<RecordId, number> {

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

    for (let s of group_set) {
        group_ip[s[0]] = ip_list[globalnode % 6];
        group_scale[s[0]] = 1;
        node_info[group_ip[s[0]]] -= group_scale[s[0]];
    }
    return inDegreeVec;
}

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

function topo_search(workflow: SubGraph, inDegreeVec: Record<string, number>,
    groupSet: Array<RecordId>[], Intenet_latency: boolean = false): [Record<RecordId, number[]>, {[name: RecordId]: [RecordId, number]}] {
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
function mergeable(node1: RecordId, node2: RecordId, groupSet: Array<RecordId>[]): boolean {
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
    const new_node_info = {...node_info};
    return false;
}