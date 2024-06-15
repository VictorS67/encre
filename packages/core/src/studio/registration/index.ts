import { type GuardrailRegistration } from './guardrails.js';
import { type NodeRegistration } from './nodes.js';

export type NodeRegistry = {
  guardrails?: GuardrailRegistration;
  nodes?: NodeRegistration;
}