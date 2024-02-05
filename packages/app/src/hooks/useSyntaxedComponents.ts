import { useCallback, useEffect, useState } from "react";

// export function useSyntaxedComponents() {
//   const [components, setComponents] = useState<SyntaxedComponent[]>([
//     { type: "editor", content: "", startLineNumber: 1 },
//   ]);

//   const calculateLineNumbers = (
//     components: SyntaxedComponent[]
//   ): SyntaxedComponent[] => {
//     let lineNumber: number = 1;

//     return components.map((c) => {
//       const lines: number =
//         c.type === "editor" ? (c.content.match(/\n/g) || []).length + 1 : 1;
//       const startLineNumber: number = lineNumber;
//       lineNumber += lines;

//       return { ...c, startLineNumber, lines };
//     });
//   };

//   useEffect(() => {
//     setComponents(calculateLineNumbers(components));
//   }, [components]);

//   const updateComponentContent = useCallback(
//     (index: number, newContent: string | HTMLDivElement) => {
//       const newComponents = [...components];
//       newComponents[index].content = newContent;

//       setComponents(newComponents);
//     },
//     [components]
//   );
// }
