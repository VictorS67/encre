import { useEffect, useState } from "react";

import { produce } from "immer";

import {
  CodeEditorContent,
  ImageEditorContent,
  MessageEditorContent,
  StringEditorContent,
  SyntaxedEditor,
} from "../types/editor.type";
import { Node } from "../types/node.type";
import {
  ChatContent,
  ImageContent,
  JsonContent,
  JsonContext,
  JsonTemplate,
  TextContent,
} from "../types/descriptor.type";

function getEditorForText(textContent: TextContent) {
  if (typeof textContent === "object") {
    return {
      type: "code",
      language: "json",
      text: JSON.stringify(textContent, null, 2),
    } as CodeEditorContent;
  }

  return {
    type: "string",
    text: textContent,
  } as StringEditorContent;
}

function getEditorForChat(chatContent: ChatContent) {
  return {
    type: "message",
    role: chatContent.role,
    name: chatContent.name,
    editors: [
      typeof chatContent.context === "object"
        ? ({
            type: "code",
            language: "json",
            text: JSON.stringify(chatContent.context, null, 2),
          } as CodeEditorContent)
        : ({
            type: "string",
            text: chatContent.context,
          } as StringEditorContent),
    ],
  } as MessageEditorContent;
}

function getEditorForImage(imageContent: ImageContent) {
  const dataUri: string | undefined = imageContent.data
    ? `data:${imageContent.mimeType};base64,${imageContent.data}`
    : undefined;

  return {
    type: "image",
    dataUri,
    description: imageContent.description,
  } as ImageEditorContent;
}

function getEditorForJson(jsonContent: JsonContent) {
  const jsonTemplate: JsonTemplate = jsonContent.jsonTemplate;
  const jsonValue: JsonContext = jsonContent.context;

  for (const key in jsonTemplate) {
    jsonTemplate[key] = `{{${jsonTemplate[key]}}}`;
  }

  return {
    type: "code",
    language: "json",
    text: JSON.stringify(
      {
        ...jsonValue,
        ...jsonTemplate,
      },
      null,
      2
    ),
  } as CodeEditorContent;
}

function getEditorWithType(
  type: Node["type"],
  content: unknown
): SyntaxedEditor {
  switch (type) {
    case "text":
      return getEditorForText(content as TextContent);
    case "chat":
      return getEditorForChat(content as ChatContent);
    case "image":
      return getEditorForImage(content as ImageContent);
    case "json":
      return getEditorForJson(content as JsonContent);
    default:
      return {
        type: "code",
        language: "text",
        text: "",
      } as CodeEditorContent;
  }
}

export function getEditors(node: Node): SyntaxedEditor[] {
  return [
    {
      type: "code",
      language: "text",
      text: "",
    } as CodeEditorContent,
  ];
}

export function useNodeContentEditors(node: Node) {
  const [editors, setEditors] = useState<SyntaxedEditor[]>([]);

  useEffect(() => {
    let loadedEditors: SyntaxedEditor[] = getEditors(node);

    loadedEditors = produce(loadedEditors, (draft) => {
      const autoFocusedEditor = draft.find((e) => e.autoFocus);

      if (!autoFocusedEditor) {
        const firstEditorToFocus = draft.find(
          (e) => e.type === "code" || e.type === "string"
        );

        if (firstEditorToFocus) {
          firstEditorToFocus.autoFocus = true;
        }
      }
    });

    setEditors(loadedEditors);
  }, [node]);

  return editors;
}
