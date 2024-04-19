import React, { FC, memo, Suspense, useMemo } from "react";
import { Node, UIContext } from "../../types/studio.type";
import {
  ConditionField,
  UIContextDescriptor,
} from "../../types/uicontext.type";
import { ConditionUIContextContainer } from "../ConditionUIContextContainer";

/* eslint-disable react/prop-types */
export const ConditionNodeContentBody: FC<
  { node: Node } & Extract<UIContext, { type: "condition" }>
> = memo(({ node, subject, properties, conditions }) => {
  const [when, otherwiseWhen, otherwise] = useMemo(() => {
    const first = conditions.filter((c) => c.type === "if");
    const middle = conditions.filter((c) => c.type === "else-if");
    const last = conditions.filter((c) => c.type === "otherwise");

    if (first.length === 0) {
      return [{} as ConditionField, undefined, undefined];
    }

    return [first[0], middle, last.length > 0 ? last[0] : undefined];
  }, [conditions]);

  return (
    <Suspense fallback={<div />}>
      <div style={{ paddingRight: 5 }}>
        <ConditionUIContextContainer
          node={node}
          uiType="condition"
          subject={subject}
          properties={properties}
          when={when}
          otherwiseWhen={otherwiseWhen}
          otherwise={otherwise}
        />
      </div>
    </Suspense>
  );
});

ConditionNodeContentBody.displayName = "ConditionNodeContentBody";

export const conditionDescriptor: UIContextDescriptor<"condition"> = {
  Body: ConditionNodeContentBody,
};
