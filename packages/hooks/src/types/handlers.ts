export interface EncreAppInputHandler {
  handlerType: 'input';
  description: string;
  event: 'userInput';
  graphId: string;
  nodeId: string;
  portName: string;
  dataType:
    | 'string'
    | 'number'
    | 'boolean'
    | 'context'
    | 'chat-message'
    | 'object'
    | 'unknown';
}

export interface EncreAppActionHandler {
  handlerType: 'action';
  description: string;
  event: 'runGraph';
  graphId: string;
  graphInputs: string[];
  graphOutputs: string[];
}

export interface EncreAppOutputHandler {
  handlerType: 'output';
  description: string;
  event: 'graphOutput' | 'nodeOutput';
  graphId: string;
  nodeId: string;
  portName: string;
  dataType:
    | 'string'
    | 'number'
    | 'boolean'
    | 'context'
    | 'chat-message'
    | 'object'
    | 'unknown';
}

export type EncreAppHander =
  | EncreAppInputHandler
  | EncreAppActionHandler
  | EncreAppOutputHandler;

export interface ProcessStreamEventFilter {
  nodeStart?: string[] | true;
  nodeFinish?: string[] | true;
  done?: true;
  error?: true;
}
