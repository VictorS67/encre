import {
  Guardrail,
  SerializedRule,
  SerializedRuleCollection,
} from './studio.type';

export type GuardrailHubProps = {
  onGuardrailSelect?: (guardrail: Guardrail) => void;
  onGuardrailUnselect?: (guardrail: Guardrail) => void;
};

export type GuardrailCardProps = {
  guardrail: Guardrail;
  selectedIndex?: number;
  onGuardrailToggle?: (guardrail: Guardrail, isSelected: boolean) => void;
};

export type RuleCollectionEditorProps = {
  sources: string[];
  ruleCollection: SerializedRuleCollection;
  isPlaceholder?: boolean;
  onRuleCollectionUpdate: (
    newRuleCollection: SerializedRuleCollection | SerializedRule,
  ) => void;
};

export type RuleEditorProps = {
  rule: SerializedRule;
  showBracket?: boolean;
  isPlaceholder?: boolean;
};
