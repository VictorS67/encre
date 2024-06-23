import { SerializableNode } from '@encrejs/core/studio/nodes';

export function getNodeTitle(node: SerializableNode): string {
  return node.title ?? (node.data._id[node.data._id.length - 1] as string);
}
