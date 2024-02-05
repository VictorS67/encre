import React, { FC, memo } from 'react';

import { useUnknownNodeContentDescriptor } from '../hooks/useNodeTypes';
import {
  NodeContentBodyProps,
  UnknownNodeContentBodyProps,
} from '../types/nodecontent.type';

export const NodeContentBody: FC<NodeContentBodyProps> = memo(
  ({ node }: NodeContentBodyProps) => {
    const { Body } = useUnknownNodeContentDescriptor(node);

    const body = Body ? (
      <Body node={node} />
    ) : (
      <UnknownNodeContentBody node={node} />
    );

    return <div className="node-content-body">{body}</div>;
  },
);

NodeContentBody.displayName = 'NodeContentBody';

export const UnknownNodeContentBody: FC<UnknownNodeContentBodyProps> = ({
  node,
}: UnknownNodeContentBodyProps) => {
  return <div>Node Content is Unknown</div>;
};
