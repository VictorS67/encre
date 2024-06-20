import { SerializedRuleMetadata } from '@encrejs/core/serde';

export function ruleSplit(
  ruleMetadata: SerializedRuleMetadata,
  splittedRules: Array<{
    showBracket: boolean;
    ruleType: string;
    description: string;
    func: string;
    variables?: Record<string, unknown>;
  }>,
) {}
