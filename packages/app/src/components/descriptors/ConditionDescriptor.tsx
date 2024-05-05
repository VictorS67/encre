import React, { FC, memo, Suspense, useMemo } from 'react';

import {
  ElseIfConditionUI,
  IfConditionUI,
  Node,
  OtherwiseConditionUI,
  UIContext,
} from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { ConditionUIContextContainer } from '../ConditionUIContextContainer';

/* eslint-disable react/prop-types */
export const ConditionNodeContentBody: FC<
  { node: Node; id: string } & Extract<UIContext, { type: 'condition' }>
> = memo(({ node, id, target, sources, conditions }) => {
  const [when, otherwiseWhen, otherwise] = useMemo(() => {
    const first = conditions.filter((c) => c.type === 'if');
    const middle = conditions.filter((c) => c.type === 'else-if');
    const last = conditions.filter((c) => c.type === 'otherwise');

    if (first.length === 0) {
      return [{ type: 'if' } as IfConditionUI, undefined, undefined];
    }

    return [
      first[0] as IfConditionUI,
      middle as ElseIfConditionUI[],
      last.length > 0 ? (last[0] as OtherwiseConditionUI) : undefined,
    ];
  }, [conditions]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <ConditionUIContextContainer
          node={node}
          uiType="condition"
          target={target}
          sources={sources}
          when={when}
          otherwiseWhen={otherwiseWhen}
          otherwise={otherwise}
        />
      </div>
    </Suspense>
  );
});

ConditionNodeContentBody.displayName = 'ConditionNodeContentBody';

export const conditionDescriptor: UIContextDescriptor<'condition'> = {
  Body: ConditionNodeContentBody,
};
