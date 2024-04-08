import { SubGraph } from "../graph";
import { NodeConnection } from "../nodes";
import { globalNodeRegistry } from "../nodes/registration";


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
const flattenConns = graph.flattenConnections;

let mem_usage: number = 0;
let max_mem_usage: number = 0;
const group_ip: { [key: string]: string } = {};
const group_scale: { [key: string]: number } = {};

function uniqueHash(input: string): number {
    let hash = 0, i, chr;
    for (i = 0; i < input.length; i++) {
       chr   = input.charCodeAt(i);
       hash  = ((hash << 5) - hash) + chr;
       hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


interface NodeInfo {
    [key: string]: number;
}

function init_graph(workflow: component.Workflow, group_set: string[][], node_info: NodeInfo): { [key: string]: number } {
    const ip_list: string[] = Object.keys(node_info);
    const in_degree_vec: { [key: string]: number } = {};
    const q: string[] = [];

    for (const name of workflow.start_functions) {
        q.push(workflow.nodes[name]);
        group_set.push([name]);
    }

    while (q) {
        const node: component.Node = q.pop();
        for (const next_node_name of node.next) {
            if (!(next_node_name in in_degree_vec)) {
                in_degree_vec[next_node_name] = 1;
                q.push(workflow.nodes[next_node_name]);
                group_set.push([next_node_name]);
            } else {
                in_degree_vec[next_node_name] += 1;
            }
        }
    }

    for (const s of group_set) {
group_ip[JSON.stringify(s)] = ip_list[uniqueHash(JSON.stringify(s)) % ip_list.length];
        group_scale[JSON.stringify(s)] = workflow.nodes[s[0]].scale;
        node_info[group_ip[JSON.stringify(s)]] -= workflow.nodes[s[0]].scale;
    }

    return in_degree_vec;
}

function find_set(node: string, group_set: string[][]): string[] | null {
    for (const node_set of group_set) {
        if (node_set.includes(node)) {
            return node_set;
        }
    }
    return null;
}

function topo_search(workflow: component.Workflow, in_degree_vec: { [key: string]: number }, group_set: string[][]): [{ [key: string]: [number, number] }, { [key: string]: [string, number] }] {
    const dist_vec: { [key: string]: [number, number] } = {};
    const prev_vec: { [key: string]: [string, number] } = {};
    // let q: string[];

    let q: string[] = [];

    for (const name of workflow.start_functions) {
        q.push(workflow.nodes[name]);
        dist_vec[name] = [workflow.nodes[name].runtime, 0];
        prev_vec[name] = ["", 0];
    }

     while (q.length > 0) {
         const node: component.Node = workflow.nodes[q.pop() as string];
        const pre_dist: [number, number] = dist_vec[node.name];
        const prev_name: string = node.name;

        for (let index = 0; index < node.next.length; index++) {
            const next_node: component.Node = workflow.nodes[node.next[index]];
            let w: number = node.nextDis[index];
            const next_node_name: string = next_node.name;

            const set = find_set(prev_name, group_set);
            if (set && next_node_name in set) {
                w = w / config.NET_MEM_BANDWIDTH_RATIO;
            }

            if (!(next_node_name in dist_vec)) {
                dist_vec[next_node_name] = [pre_dist[0] + w + next_node.runtime, Math.max(pre_dist[1], w)];
                prev_vec[next_node_name] = [prev_name, w];
            } else if (dist_vec[next_node_name][0] < pre_dist[0] + w + next_node.runtime) {
                dist_vec[next_node_name] = [pre_dist[0] + w + next_node.runtime, Math.max(pre_dist[1], w)];
                prev_vec[next_node_name] = [prev_name, w];
            } else if (dist_vec[next_node_name][0] === pre_dist[0] + w + next_node.runtime && Math.max(pre_dist[1], w) > dist_vec[next_node_name][1]) {
                dist_vec[next_node_name][1] = Math.max(pre_dist[1], w);
                prev_vec[next_node_name] = [prev_name, w];
            }

            in_degree_vec[next_node_name] -= 1;

            if (in_degree_vec[next_node_name] === 0) {
             q.push(next_node_name);
         }
        }
    }

    return [dist_vec, prev_vec];
}

function mergeable(node1: string, node2: string, group_set: string[][], workflow: component.Workflow, write_to_mem_nodes: string[], node_info: NodeInfo): boolean {
    

    const node_set1: string[] | null = find_set(node1, group_set);

    if (node_set1 && node_set1.includes(node2)) {
        return false;
    }

    const node_set2: string[] | null = find_set(node2, group_set);

    if (!node_set1 || !node_set2) {
        return false;
    }

    const new_node_info: NodeInfo = { ...node_info };
    const node_set1_scale: number = group_scale[JSON.stringify(node_set1)];
    const node_set2_scale: number = group_scale[JSON.stringify(node_set2)];

    new_node_info[group_ip[JSON.stringify(node_set1)]] += node_set1_scale;
    new_node_info[group_ip[JSON.stringify(node_set2)]] += node_set2_scale;

    let best_fit_addr: string | null = null;
    let best_fit_scale: number = 10000000;

    for (const addr in new_node_info) {
        if (new_node_info[addr] >= node_set1_scale + node_set2_scale && new_node_info[addr] < best_fit_scale) {
            best_fit_addr = addr;
            best_fit_scale = new_node_info[addr];
        }
    }

    if (!best_fit_addr) {
        return false;
    }

    if (!write_to_mem_nodes.includes(node1)) {
        const current_mem_usage: number = workflow.nodes[node1].nextDis[0] * config.NETWORK_BANDWIDTH;
        if (mem_usage + current_mem_usage > max_mem_usage) {
            return false;
        }
        mem_usage += current_mem_usage;
        write_to_mem_nodes.push(node1);
    }

    const new_group_set: string[] = [...node_set1, ...node_set2];

    group_set.push(new_group_set);
    group_ip[JSON.stringify(new_group_set)] = best_fit_addr;
    node_info[best_fit_addr] -= node_set1_scale + node_set2_scale;
    group_scale[JSON.stringify(new_group_set)] = node_set1_scale + node_set2_scale;

    node_info[group_ip[JSON.stringify(node_set1)]] += node_set1_scale;
    node_info[group_ip[JSON.stringify(node_set2)]] += node_set2_scale;

    group_set.splice(group_set.indexOf(node_set1), 1);
    group_set.splice(group_set.indexOf(node_set2), 1);
    delete group_ip[JSON.stringify(node_set1)];
    delete group_ip[JSON.stringify(node_set2)];
    delete group_scale[JSON.stringify(node_set1)];
    delete group_scale[JSON.stringify(node_set2)];

    return true;
}

function merge_path(crit_vec: [string, [string, number]][], group_set: string[][], workflow: component.Workflow, write_to_mem_nodes: string[], node_info: NodeInfo): boolean {
    for (const edge of crit_vec) {
        if (mergeable(edge[1][0], edge[0], group_set, workflow, write_to_mem_nodes, node_info)) {
            return true;
        }
    }
    return false;
}

function get_longest_dis(workflow: component.Workflow, dist_vec: { [key: string]: [number, number] }): [number, string] {
    let dist: number = 0;
    let node_name: string = '';
    for (const name in workflow.nodes) {
        if (dist_vec[name][0] > dist) {
            dist = dist_vec[name][0];
            node_name = name;
        }
    }
    return [dist, node_name];
}

function grouping(workflow: component.Workflow, node_info: NodeInfo): [string[][], Set<string>] {
    const group_set: string[][] = [];
    const critical_path_functions: Set<string> = new Set();
    const write_to_mem_nodes: string[] = [];
    let in_degree_vec: { [key: string]: number } = init_graph(workflow, group_set, node_info);

    while (true) {
        if (group_set.length === 1) {
            break;
        }

        const [dist_vec, prev_vec] = topo_search(workflow, { ...in_degree_vec }, group_set);
        let [crit_length, tmp_node_name]: [number, string] = get_longest_dis(workflow, dist_vec);
        const crit_vec: [string, [string, number]][] = [];

        while (!workflow.start_functions.includes(tmp_node_name)) {
            crit_vec.push([tmp_node_name, prev_vec[tmp_node_name]]);
            tmp_node_name = prev_vec[tmp_node_name][0];
        }

        crit_vec.sort((a, b) => b[1][1] - a[1][1]);

        for (const [k, v] of crit_vec) {
            critical_path_functions.add(k);
            critical_path_functions.add(v[0]);
        }

        if (!merge_path(crit_vec, group_set, workflow, write_to_mem_nodes, node_info)) {
            break;
        }
    }

    return [group_set, critical_path_functions];
}

function get_type(workflow: component.Workflow, node: component.Node, group_detail: string[][]): string {
    let not_in_same_set: boolean = false;
    let in_same_set: boolean = false;

    for (const next_node_name of node.next) {
        const node_set: string[] | null = find_set(next_node_name, group_detail);
        if (node_set && !node_set.includes(node.name)) {
            not_in_same_set = true;
        } else if (node_set) {
            in_same_set = true;
        }
    }

    if (not_in_same_set && in_same_set) {
        return 'DB+MEM';
    } else if (in_same_set) {
        return 'MEM';
    } else {
        return 'DB';
    }
}

function get_max_mem_usage(workflow: component.Workflow): number {
    let max_mem_usage: number = 0;
    for (const name in workflow.nodes) {
        if (!name.startsWith('virtual')) {
            max_mem_usage += (1 - config.RESERVED_MEM_PERCENTAGE - workflow.nodes[name].mem_usage) * config.CONTAINER_MEM * workflow.nodes[name].split_ratio;
        }
    }
    return max_mem_usage;
}

function get_grouping_config(workflow: component.Workflow): [NodeInfo, { [key: string]: any }, { [key: string]: any }, Set<string>] {
   

    // const node_info_list: any = yaml.load(open('node_info.yaml'), Loader=yaml.FullLoader);
   
    const node_info_list = {
        nodes: [
            { worker_address: "worker1", scale_limit: 100 },
            { worker_address: "worker2", scale_limit: 100 },
            { worker_address: "worker3", scale_limit: 100},
        ],
    };
    const node_info_dict: NodeInfo = {};
    for (const node_info of node_info_list.nodes) {
        node_info_dict[node_info.worker_address] = node_info.scale_limit;
    }

    const max_mem_usage: number = get_max_mem_usage(workflow);
    const [group_detail, critical_path_functions]: [string[][], Set<string>] = grouping(workflow, node_info_dict);

    const ip_list: string[] = Object.keys(node_info_dict);
    const function_info_dict: { [key: string]: any } = {};
    const function_info_raw_dict: { [key: string]: any } = {};

    for (const node_name in workflow.nodes) {
        const node: component.Node = workflow.nodes[node_name];
        const to: string = get_type(workflow, node, group_detail);
        const ip: string = group_ip[JSON.stringify(find_set(node_name, group_detail))];
        const function_info: any = { function_name: node.name, runtime: node.runtime, to, ip, parent_cnt: workflow.parent_cnt[node.name], conditions: node.conditions };
        const function_info_raw: any = { function_name: node.name, runtime: node.runtime, to: 'DB', ip: ip_list[uniqueHash(node.name) % ip_list.length], parent_cnt: workflow.parent_cnt[node.name], conditions: node.conditions };
        const function_input: any = {};
        const function_input_raw: any = {};
        for (const arg in node.input_files) {
            function_input[arg] = { size: node.input_files[arg].size, function: node.input_files[arg].function, parameter: node.input_files[arg].parameter, type: node.input_files[arg].type };
            function_input_raw[arg] = { size: node.input_files[arg].size, function: node.input_files[arg].function, parameter: node.input_files[arg].parameter, type: node.input_files[arg].type };
        }
        const function_output: any = {};
        const function_output_raw: any = {};
        for (const arg in node.output_files) {
            function_output[arg] = { size: node.output_files[arg].size, type: node.output_files[arg].type };
            function_output_raw[arg] = { size: node.output_files[arg].size, type: node.output_files[arg].type };
        }
        function_info.input = function_input;
        function_info.output = function_output;
        function_info.next = node.next;
        function_info_raw.input = function_input_raw;
        function_info_raw.output = function_output_raw;
        function_info_raw.next = node.next;
        function_info_dict[node_name] = function_info;
        function_info_raw_dict[node_name] = function_info_raw;
    }

    for (const name in workflow.nodes) {
        for (const next_name of workflow.nodes[name].next) {
            if (next_name.startsWith('virtual')) {
                if (function_info_dict[next_name].to !== function_info_dict[name].to) {
                    function_info_dict[name].to = 'DB+MEM';
                }
            }
        }
    }

    return [node_info_dict, function_info_dict, function_info_raw_dict, critical_path_functions];
}


