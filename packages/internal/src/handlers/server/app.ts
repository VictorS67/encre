import * as ts from "typescript";
import * as asyncStorage from "../../asyncStorage";
import { createApp } from "../../server/app";
import { getServer, setServer } from "../../server/config";
import { get, post } from "../../server/post";
import {
  BuiltInNodeTypePairs,
  DataFields,
  KeyAlias,
  Node,
  NodeAttrs,
  NodeBody,
  NodeConnection,
  SecretFields,
} from "../../types/encre";
import { compile } from "../../compiler/compile";
import { APIError } from "../types";
import { ServerHandlers } from ".";
import { send } from "../../fetch";

export const app = createApp<ServerHandlers>();

app.method("get-server-url", async function (): Promise<string | null> {
  return getServer() && getServer()!.BASE_SERVER;
});

app.method("set-server-url", async function ({ url }): Promise<void> {
  await asyncStorage.set("server-url", url);
  setServer(url);
});

app.method("get-all-nodes", async function (): Promise<APIError | Node[]> {
  try {
    const nodes = await get(getServer()!.API_SERVER + "/nodes", {});
    return JSON.parse(nodes);
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
});

app.method(
  "get-node",
  async function ({
    type,
    subType,
    registerArgs,
  }: {
    type: string;
    subType: string;
    registerArgs?: Record<string, unknown>;
  }): Promise<APIError | Node> {
    try {
      console.log(`get-node: type: ${type} - subtype: ${subType}`);

      const node = await post(
        getServer()!.API_SERVER + `/nodes/${type}/${subType}`,
        registerArgs ?? {}
      );
      return node;
    } catch (e) {
      console.error(e);
      return { error: "failed" };
    }
  }
);

app.method("get-node-body", async function ({ node }: { node: Node }): Promise<
  APIError | NodeBody
> {
  try {
    console.log(`get-node-body: type: ${node.type} - subtype: ${node.subType}`);

    const nodeBody = await post(
      getServer()!.API_SERVER + `/nodes/node-body`,
      JSON.parse(JSON.stringify(node))
    );
    return nodeBody;
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
});

app.method(
  "get-node-io",
  async function ({
    node,
    connections,
    nodeMap,
  }: {
    node: Node;
    connections?: NodeConnection[];
    nodeMap?: Record<string, Node>;
  }): Promise<APIError | void> {
    try {
      console.log(`get-node-io: type: ${node.type} - subtype: ${node.subType}`);

      const nodeIODefs = await post(
        getServer()!.API_SERVER + `/nodes/node-io`,
        { node, connections, nodeMap }
      );

      return nodeIODefs;
    } catch (e) {
      console.log(e);
      return { error: "failed" };
    }
  }
);

app.method("get-registry-nodes-type-pairs", async function (): Promise<
  APIError | BuiltInNodeTypePairs
> {
  try {
    console.log("get-registry-nodes-type-pairs");

    const typePairs = await get(
      getServer()!.API_SERVER + `/registry/nodes/type-pairs`,
      {}
    );

    return JSON.parse(typePairs);
  } catch (e) {
    console.log(e);
    return { error: "failed" };
  }
});

app.method("get-node-attrs", async function ({ node }: { node: Node }): Promise<
  APIError | NodeAttrs
> {
  try {
    console.log(
      `get-node-attrs: type: ${node.type} - subtype: ${node.subType}`
    );

    const nodeAttrs = await post(
      getServer()!.API_SERVER + `/nodes/node-attrs`,
      JSON.parse(JSON.stringify(node))
    );
    return nodeAttrs;
  } catch (e) {
    console.error(e);
    return { error: "failed" };
  }
});

app.method(
  "change-node-attrs",
  async function ({
    id,
    node,
    code,
    compileType,
  }: {
    id: string;
    node: Node;
    code: string;
    compileType: "json" | "ts";
  }): Promise<APIError | void> {
    try {
      const nodeAttrs: APIError | NodeAttrs = await send(
        "get-registry-nodes-type-pairs"
      );
      if ((nodeAttrs as APIError)?.error) {
        return { error: "failed" };
      }

      const scriptKind: ts.ScriptKind =
        compileType === "json" ? ts.ScriptKind.JSON : ts.ScriptKind.TS;
      const { api, sourceFile, program, checker } = await compile(
        id,
        code,
        "typescript",
        ts.ScriptTarget.Latest,
        scriptKind
      );
    } catch (e) {
      console.log(e);
      return { error: "failed" };
    }
  }
);
