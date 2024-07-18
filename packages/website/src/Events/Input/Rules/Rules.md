## BaseRuleCollection

A collection of rules that can be evaluated together. This provides functionality to validate a set of inputs against the rules defined in the collection.
---

| Reference | Link |
| --- | --- |
| Encre Concept | [Serializable ](**-a-link-to-the-corresponding-concept-documentation-**) |
| Encre Node | [** A reference to the node that uses this component **](**-a-link-to-the-corresponding-node-documentation-**) |
| API | [** A reference to API Documentation **](**-a-link-to-the-corresponding-api-documentation-**) |

### Overview

TThe `BaseRuleCollection` class allows for the aggregation and evaluation of multiple rules. It provides a structured way to validate complex sets of input data against a collection of rules, supporting both "and" and "or" logical conjunctions.


### Usage

#### Creating with Parameters

Here's an example of how to create `BaseRuleCollection` with parameters:

```typescript
import { BaseRuleCollection, BaseRule } from "@encrejs/core";

const rule1 = new BaseRule({ /* rule parameters */ });
const rule2 = new BaseRule({ /* rule parameters */ });

const ruleCollection = new BaseRuleCollection({
  collection: {
    rule1: rule1,
    rule2: rule2,
  },
  conjunction: 'and',
});

```

Component parameters:

| Parameter | Runtime Type | Description |
| --- | --- | --- |
| _namespace | string[] | Namespace array indicating the event related to the rule |
| collection | Record<string, BaseRule | BaseRuleCollection> | A collection of rules, each identified by a string key. The value can be either a BaseRule or another BaseRuleCollection. |
| conjunction | 'and' \| 'or' | The logical conjunction to use when evaluating the rules in the collection. If 'and', all rules must pass for the collection to pass. If 'or', only one rule must pass for the collection to pass. |
