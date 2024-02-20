import {
  NodeContentDescriptors,
  UnknownNodeContentDescriptor,
} from '../types/descriptor.type';
import { BuiltInNodeType, Node, getNodeTypes } from '../types/studio.type';

export function useNodeTypes(): NodeContentDescriptors {
  const allNodeTypes = getNodeTypes();

  return Object.fromEntries(
    allNodeTypes.map((nodeType) => {
      const descriptor = {};

      return [nodeType, descriptor];
    }),
  ) as NodeContentDescriptors;
}

export function useUnknownNodeContentDescriptor(
  node: Node,
): UnknownNodeContentDescriptor {
  const nodeDescriptors: NodeContentDescriptors = useNodeTypes();

  return (nodeDescriptors[node.type as BuiltInNodeType] ??
    {}) as UnknownNodeContentDescriptor;
}
