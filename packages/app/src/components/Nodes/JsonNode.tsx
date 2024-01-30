import React, { FC, memo, useMemo } from "react";
import {
  JsonContext,
  JsonTemplate,
  KnownNode,
  NodeContentDescriptor,
} from "../../types/nodecontent.type";

/* eslint-disable react/prop-types */
// export const JsonNodeBody: FC<{ node: KnownNode<"json"> }> = memo(
//   ({ node }) => {
//     const text = useMemo(() => {
//       const jsonTemplate: JsonTemplate = node.content.jsonTemplate;
//       const jsonValue: JsonContext = node.content.context;

//       for (const key in jsonTemplate) {
//         jsonTemplate[key] = `{{${jsonTemplate[key]}}}`;
//       }
  
//       const keyValGrp: [string, unknown][] = Object.entries({
//         ...jsonTemplate,
//         ...jsonValue,
//       });

//       return keyValGrp.map(([k, v]) => {
//         const valStr: string = (typeof v === "string") ? 
//       })
//     }, [node.content.jsonTemplate, node.content.context])
//   }
// );

export const jsonNodeDescriptor: NodeContentDescriptor<"json"> = {
  Body: undefined,
  useMarkdownInDefault: false,
};
