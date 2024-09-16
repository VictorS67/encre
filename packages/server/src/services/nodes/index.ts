import type {
  NodeConnection,
  SerializableNode,
} from '@encrejs/core/studio/nodes';
import {
  globalNodeRegistry,
  type NodeImplConstructor,
} from '@encrejs/core/studio/registration/nodes';
import { StatusCodes } from 'http-status-codes';
import { InternalError } from '../../exceptions/internal.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unreachable */
async function getAllNodes() {
  try {
    return Object.values(globalNodeRegistry.rawImplsMap).map(
      (v: {
        impl: NodeImplConstructor<SerializableNode>;
        init: SerializableNode;
      }) => v.init
    );
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `nodesService.getAllNodes: ${getErrorMessage(error)}`
    );
  }
}

async function getNodeById(id: string) {
  try {
    const node: SerializableNode | undefined =
      globalNodeRegistry.rawImplsMap[id]?.init;

    if (!node) {
      throw new Error(`CANNOT find node id: ${id}`);
    }

    return node;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `nodesService.getNodeById: ${getErrorMessage(error)}`
    );
  }
}

async function getNode(
  type: string,
  subType: string,
  registerArgs?: Record<string, unknown>
) {
  try {
    const node: SerializableNode = globalNodeRegistry.createDynamic(
      type,
      subType,
      registerArgs
    );

    return node;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `nodesService.getNode: ${getErrorMessage(error)}`
    );
  }
}

async function getNodeIODefs({
  node,
  connections,
  nodeMap,
}: {
  node: SerializableNode;
  connections?: NodeConnection[];
  nodeMap?: Record<string, SerializableNode>;
}) {
  try {
    // const nodeImpl = globalNodeRegistry.createDynamicImpl(node);

    return {
      inputDefs: [
        {
          nodeId: node.id,
          name: 'prompt',
          type: ['string'],
        },
        {
          nodeId: node.id,
          name: 'number',
          type: ['number'],
        },
        {
          nodeId: node.id,
          name: 'boolean',
          type: ['boolean'],
        }
      ],
      outputDefs: [
        {
          nodeId: node.id,
          name: 'prompt',
          type: ['string'],
        },
        {
          nodeId: node.id,
          name: 'number',
          type: ['number'],
        },
        {
          nodeId: node.id,
          name: 'boolean',
          type: ['boolean'],
        }
      ],
    };
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `nodesService.getNodeIODefs: ${getErrorMessage(error)}`
    );
  }
}

async function getNodeBody(node: SerializableNode) {
  try {
    // const nodeImpl = globalNodeRegistry.createImpl(node as any);

    // const kwargs = nodeImpl.kwargs;
    // console.log(kwargs);

    return [
      {
        'isHoldingValues': false,
        'keywords': [
          'shouldSplit',
          'verbose',
          'callbacks',
        ],
        'language': 'encre-code',
        'text': `shouldSplit: false
verbose: undefined
callbacks: undefined`,
        'type': 'code',
      },
    ];
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `nodesService.getNodeBody: ${getErrorMessage(error)}`
    );
  }
}

export default { 
  getAllNodes, 
  getNodeById, 
  getNode, 
  getNodeIODefs, 
  getNodeBody
};
