import { RecordId } from "../load/keymap.js";
import { Callable, CallableConfig } from "./callable.js";
import { CallableNode } from "./callableNode.js";

const GLOBAL_SET = new Set();
const GLOBAL_MAP = new Map();

export class CallableGraph {
  private static _graph: CallableGraph;

  private _nodes: Set<CallableNode>;

  private _nodeMap: Map<string, CallableNode>;

  executionQueue: CallableNode[];

  private constructor() {
    this._nodes = GLOBAL_SET as Set<CallableNode>;
    this._nodeMap = GLOBAL_MAP;
    this.executionQueue = [];
  }

  static getGraph(): CallableGraph {
    if (!CallableGraph._graph) {
      CallableGraph._graph = new CallableGraph();
    }

    return CallableGraph._graph;
  }

  addNode<
    CallInput,
    CallOutput,
    CallOptions extends CallableConfig = CallableConfig,
  >(
    callableNode: CallableNode<CallInput, CallOutput, CallOptions>
  ): CallableNode<CallInput, CallOutput, CallOptions> {
    this._nodes.add(callableNode);
    this._nodeMap.set(callableNode.callable.getNodeId(), callableNode);

    return callableNode;
  }

  getNode(nodeId: RecordId): CallableNode | undefined {
    return this._nodeMap.get(nodeId);
  }

  prepareExecutionQueue() {
    this._nodes.forEach((node) => {
      if (node.isReady()) {
        this.executionQueue.push(node);
      }
    });
  }

  isCyclic(): boolean {
    const visited = new Set<CallableNode>();
    const recStack = new Set<CallableNode>();

    for (const node of this._nodes) {
      if (isCyclicUtil(node, visited, recStack)) {
        return true;
      }
    }

    return false;
  }
}

function isCyclicUtil(
  node: CallableNode,
  visited: Set<CallableNode>,
  recStack: Set<CallableNode>
): boolean {
  if (!visited.has(node)) {
    visited.add(node);
    recStack.add(node);

    for (const dependent of node.dependents) {
      if (
        !visited.has(dependent) &&
        isCyclicUtil(dependent, visited, recStack)
      ) {
        return true;
      } else if (recStack.has(dependent)) {
        return true;
      }
    }
  }
  recStack.delete(node);
  return false;
}
