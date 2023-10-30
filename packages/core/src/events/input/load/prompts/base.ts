import { Serializable } from '../../../../load/serializable';
import { BaseMessage, HumanMessage } from '../msgs/base';

export abstract class BasePrompt extends Serializable {
  abstract toString(): string;

  abstract toChatMessages(): BaseMessage[];
}

export class StringPrompt extends BasePrompt {
  _namespace: string[] = ['events', 'input', 'load', 'prompts'];

  value: string;

  constructor(value: string, ...args) {
    super(...args);
    this.value = value;
  }

  toString(): string {
    return this.value;
  }

  toChatMessages(): BaseMessage[] {
    return [new HumanMessage(this.value)];
  }
}
