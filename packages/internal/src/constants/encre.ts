export const dataTypes = [
  "string",
  "string[]",
  "number",
  "number[]",
  "boolean",
  "boolean[]",
  "unknown",
  "unknown[]",
  "object",
  "object[]",
  "blob",
  "blob[]",
  "context",
  "context[]",
  "chat-message",
  "chat-message[]",
  "prompt",
  "prompt[]"
] as const;

export type DataType = typeof dataTypes[number];

export const extMap = {
  "text/plain": "bin",
  "text/html": "html",
  "text/javascript": "js",
  "text/css": "css",
  "application/json": "json",
  "application/pdf": "pdf",
  "application/xml": "xml",
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};
