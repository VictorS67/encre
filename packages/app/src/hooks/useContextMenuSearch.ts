// import { useMemo } from "react";
// import {
//   ContextMenuConfigContext,
//   ContextMenuConfigContextItem,
//   ContextMenuSearchContext,
// } from "../types/contextmenu.type";

// export function useContextMenuSearch() {
//   const searchContexts: ContextMenuSearchContext[] = useMemo(() => {
//     const flattenContexts = (
//       contexts: readonly ContextMenuConfigContext[],
//       path: string[] = []
//     ): (Omit<ContextMenuConfigContext, "metadata"> & { path: string[] })[] => {
//       const allContexts = contexts.reduce<
//         {
//           contexts: readonly ContextMenuConfigContext[];
//           path: string[];
//         }[]
//       >((accumulator, context) => {
//         const currPath = [...path, context.metadata.label];

//         const items: readonly ContextMenuConfigContextItem[] = context.items;

//         items.forEach((item: ContextMenuConfigContextItem) => {
//           const newPath = [...currPath, item.id];

//           const newContexts: (Omit<ContextMenuConfigContext, "metadata"> & {
//             path: string[];
//           })[] = flattenContexts(item.contexts || [], newPath);
//         });

//         return accumulator.concat();
//       }, []);
//     };
//   }, []);
// }
