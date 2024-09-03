export enum MessageRole {
  User = 'human',
  Assistant = 'assistant',
  System = 'system',
  Tool = 'function',
  General = 'general',
}

export type MessageContent = string | Record<string, unknown>;

export interface Message {
  role: MessageRole;
  content: MessageContent | MessageContent[];
  name?: string;
  additionalKwargs?: Record<string, unknown>;
}
