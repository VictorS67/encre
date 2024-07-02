import { NodeBody } from "@encrejs/core";
import type {
  BuiltInNodeTypePairs,
  Node,
  NodeConnection,
} from "../../types/encre";

export interface ServerHandlers {
  "get-server-url": () => Promise<string | null>;
  "set-server-url": (arg: { url: string }) => Promise<{ error?: string }>;

  "get-all-nodes": () => Promise<Node[]>;
  "get-node-by-id": (arg: { id: string[] }) => Promise<Node>;
  "get-node": (arg: {
    type: string;
    subType: string;
    registerArgs?: Record<string, unknown>;
  }) => Promise<Node>;
  "get-node-io": (arg: {
    node: Node;
    connections?: NodeConnection[];
    nodeMap?: Record<string, Node>;
  }) => Promise<void>;
  "get-node-body": (arg: { node: Node }) => Promise<NodeBody>;

  "get-registry-nodes-type-pairs": () => Promise<BuiltInNodeTypePairs>;
}
