import { FC, memo } from "react";

import { KnownNode, NodeContentDescriptor } from "../../types/descriptor.type";

// /* eslint-disable react/prop-types */
// export const ChatNodeBody: FC<{ node: KnownNode<"chat"> }> = memo(
//   ({ node }) => {
//     if (Array.isArray(node.content)) {
//       return <></>;
//     }

//     const role: string = node.content.role;
//     const name: string | undefined = node.content.name;
//     const context = node.content.context;

//     return <></>;
//   }
// );

// export const ChatMessage: FC<{
//   role: string;
//   name?: string;
//   context: string | { [key: string]: unknown };
// }> = memo(({ role, name, context }) => {

//   return <></>;
// });

export const chatNodeDescriptor: NodeContentDescriptor<"chat"> = {
  Body: undefined,
  useMarkdownInDefault: true,
};
