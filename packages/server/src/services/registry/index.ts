import { globalNodeRegistry } from '@encrejs/core/studio/registration/nodes';
import { StatusCodes } from 'http-status-codes';

import { InternalError } from '../../exceptions/internal.js';
import { getErrorMessage } from '../../utils/getErrorMessage.js';

async function getRegisteredNodes() {
  try {
    return globalNodeRegistry.info;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `registryService.getRegisteredNodes: ${getErrorMessage(error)}`
    );
  }
}

async function getRegisteredNodeTypes() {
  try {
    console.log(`node-types: ${JSON.stringify(globalNodeRegistry.nodeTypes)}`);
    return globalNodeRegistry.nodeTypes;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `registryService.getRegisteredNodeTypes: ${getErrorMessage(error)}`
    );
  }
}

async function getRegisteredNodeTypePairs() {
  try {
    console.log(`node-type-pairs: ${JSON.stringify(globalNodeRegistry.nodeTypePairs)}`);
    return globalNodeRegistry.nodeTypePairs;
  } catch (error) {
    throw new InternalError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `registryService.getRegisteredNodeTypePairs: ${getErrorMessage(error)}`
    );
  }
}

export default {
  getRegisteredNodes,
  getRegisteredNodeTypes,
  getRegisteredNodeTypePairs
};