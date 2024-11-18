import type {
  BuiltInNodeTypePairs,
  Node,
  NodeConnection,
  NodeBody
} from "../../types/encre";
import type { APIError } from "../types";

export interface ServerHandlers {
  "get-server-url": () => Promise<string | null>;
  "set-server-url": (arg: { url: string }) => Promise<void>;

  "get-all-nodes": () => Promise<APIError | Node[]>;
  "get-node-by-id": (arg: { id: string[] }) => Promise<APIError | Node>; // TODO
  "get-node": (arg: {
    type: string;
    subType: string;
    registerArgs?: Record<string, unknown>;
  }) => Promise<APIError | Node>;
  "get-node-io": (arg: {
    node: Node;
    connections?: NodeConnection[];
    nodeMap?: Record<string, Node>;
  }) => Promise<APIError | void>;
  "get-node-body": (arg: { node: Node }) => Promise<APIError | NodeBody>;

  "get-registry-nodes-type-pairs": () => Promise<APIError | BuiltInNodeTypePairs>;
  "change-node-attrs": (arg: {
    id: string,
    code: string,
    compileType: "json" | "ts"
  }) => Promise<APIError | void>;
}
