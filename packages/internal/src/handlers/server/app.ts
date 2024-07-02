import * as asyncStorage from "../../asyncStorage";
import { createApp } from "../../server/app";
import { getServer, setServer } from "../../server/config";
import { get, post } from "../../server/post";
import { Node, NodeConnection } from "../../types/encre";
import { ServerHandlers } from ".";

export const app = createApp<ServerHandlers>();

/* eslint-disable  @typescript-eslint/no-non-null-assertion */
app.method("get-server-url", async function () {
  return getServer() && getServer()!.BASE_SERVER;
});

app.method("set-server-url", async function ({ url }) {
  await asyncStorage.set("server-url", url);
  setServer(url);
  return {};
});

app.method("get-all-nodes", async function () {
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
  }) {
    try {
      console.log(`get-node: type: ${type} - subtype: ${subType}`);

      const node = await post(
        getServer()!.API_SERVER + `/nodes/${type}/${subType}`,
        registerArgs ?? {},
      );
      return node;
    } catch (e) {
      console.error(e);
      return { error: "failed" };
    }
  },
);

app.method("get-node-body", async function ({ node }: { node: Node }) {
  try {
    console.log(`get-node-body: type: ${node.type} - subtype: ${node.subType}`);

    const nodeBody = await post(
      getServer()!.API_SERVER + `/nodes/node-body`,
      JSON.parse(JSON.stringify(node)),
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
  }) {
    try {
      console.log(`get-node-io: type: ${node.type} - subtype: ${node.subType}`);

      const nodeIODefs = await post(
        getServer()!.API_SERVER + `/nodes/node-io`,
        { node, connections, nodeMap },
      );

      return nodeIODefs;
    } catch (e) {
      console.log(e);
      return { error: "failed" };
    }
  },
);

app.method("get-registry-nodes-type-pairs", async function () {
  try {
    console.log("get-registry-nodes-type-pairs");

    const typePairs = await get(
      getServer()!.API_SERVER + `/registry/nodes/type-pairs`,
      {},
    );

    return JSON.parse(typePairs);
  } catch (e) {
    console.log(e);
    return { error: "failed" };
  }
});
