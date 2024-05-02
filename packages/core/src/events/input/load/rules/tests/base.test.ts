import { describe, expect, test } from "@jest/globals";
import { ArrayRule } from "../../../../inference/validate/guardrails/array";
import { StringRule } from "../../../../inference/validate/guardrails/string";
import { BaseRuleCollection } from "../base";

describe("test BaseRuleCollection", () => {
  test("simple RuleCollection", () => {
    const stringExistsRule = StringRule.exists();
    const stringEqualsToRule = StringRule.isEqual("John");
    const arrayContainsRule = ArrayRule.contains("Peter");
    const stringLengthLargerRule = StringRule.lengthGreaterThan(2);

    const ruleCollection1 = new BaseRuleCollection({
      collection: {
        A: stringExistsRule
          .concat(stringEqualsToRule, "and")
          .concat(stringLengthLargerRule, "or"),
        B: arrayContainsRule,
      },
    });

    const ruleCollection2 = new BaseRuleCollection({
      collection: {
        C: stringLengthLargerRule,
      },
    });

    const ruleCollection = ruleCollection1.concat(ruleCollection2, "or");

    expect(ruleCollection.serialize()).toMatchSnapshot();
  });
});
