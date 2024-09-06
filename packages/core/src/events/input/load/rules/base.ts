import { type RecordId } from '../../../../load/keymap.js';
import { Serializable } from '../../../../load/serializable.js';
import { type SerializedRuleCollection } from '../../../../serde.js';
import { BaseRule } from '../../../inference/validate/guardrails/index.js';

/**
 * Defines the structure for initializing a BaseRuleCollection.
 * It specifies a collection of rules and optionally a conjunction to define how
 * the rules should be evaluated.
 */
export interface BaseRuleCollectionField {
  /**
   * A collection of rules, each identified by a string key. The value can be
   * either a BaseRule or another BaseRuleCollection.
   */
  collection: Record<string, BaseRule | BaseRuleCollection>;

  /**
   * The logical conjunction used to evaluate the rules. Default is "and".
   * Possible values are 'and' or 'or'.
   */
  conjunction?: 'and' | 'or';
}

/**
 * A collection of rules that can be evaluated together. This provides functionality
 * to validate a set of inputs against the rules defined in the collection.
 */
export class BaseRuleCollection
  extends Serializable
  implements BaseRuleCollectionField
{
  _isSerializable = true;

  _namespace: string[] = ['events', 'input', 'load', 'rules'];

  /**
   * A collection of rules, each identified by a string key. The value can be
   * either a BaseRule or another BaseRuleCollection.
   */
  collection: Record<string, BaseRule | BaseRuleCollection>;

  /**
   * The logical conjunction used to evaluate the rules. Default is "and".
   * Possible values are 'and' or 'or'.
   */
  conjunction: 'and' | 'or';

  /**
   * Initializes a new instance of BaseRuleCollection with the specified rules
   * and conjunction.
   * @param fields The fields required to initialize the rule collection.
   */
  constructor(fields: BaseRuleCollectionField) {
    super(fields);

    this.collection = fields.collection;
    this.conjunction = fields.conjunction ?? 'and';
  }

  /**
   * Provides a human-readable description of the rule collection, detailing the
   * rules and their logical relationship.
   */
  get description(): string {
    return Object.entries(this.collection)
      .map(([subject, rule]) => {
        const currDescription: string = rule.description;
        const isInvert: boolean = this._isInvertLogic(
          currDescription,
          this.conjunction
        );
        const isCollection: boolean = rule instanceof BaseRuleCollection;

        return isInvert
          ? `(${
              !isCollection ? `{{{${subject}}}} ` : ''
            }<${subject}>${currDescription}</${subject}>)`
          : `${
              !isCollection ? `{{{${subject}}}} ` : ''
            }<${subject}>${currDescription}</${subject}>`;
      })
      .join(` ${this.conjunction.toUpperCase()} `);
  }

  /**
   * Deserializes a given serialized rule collection into an instance of BaseRuleCollection.
   * @param serialized The serialized rule collection.
   * @param values Optional additional values for rule deserialization.
   * @returns The deserialized rule collection.
   */
  static async deserialize(
    serialized: SerializedRuleCollection,
    values: Record<string, unknown> = {}
  ): Promise<BaseRuleCollection> {
    if (serialized._type !== 'rule-collection') {
      throw new Error(
        `CANNOT deserialize this type in rule collection: ${serialized._type}`
      );
    }

    const { BaseRule } = await import(
      '../../../inference/validate/guardrails/base.js'
    );

    const ruleCollectionField: BaseRuleCollectionField = {
      collection: Object.fromEntries(
        await Promise.all(
          Object.entries(serialized.collection).map(async ([subject, rule]) => [
            subject,
            rule._type === 'rule-collection'
              ? await BaseRuleCollection.deserialize(
                  rule,
                  (values?.[subject] ?? {}) as Record<string, unknown>
                )
              : await BaseRule.deserialize(
                  rule,
                  (values?.[subject] ?? {}) as Record<string, unknown>
                ),
          ])
        )
      ),
      conjunction: serialized.conjunction,
    };

    return new BaseRuleCollection(ruleCollectionField);
  }

  /**
   * Serializes the current state of the rule collection to a format suitable for storage or transmission.
   * This method facilitates the conversion of the rule collection into a simplified JSON format,
   * capturing essential properties like description, collection, and conjunction.
   * @returns The serialized form of the rule collection.
   */
  serialize(): SerializedRuleCollection {
    return {
      _type: 'rule-collection',
      description: this.description,
      collection: Object.fromEntries(
        Object.entries(this.collection).map(([subject, rule]) => [
          subject,
          rule.serialize(),
        ])
      ),
      conjunction: this.conjunction,
    };
  }

  /**
   * Generates a simplified description of the rule collection without any special formatting.
   * This method provides a clean, readable description of each rule's logic without including
   * XML-like tags or additional decorators used in more complex descriptions.
   * @returns A simplified string representation of the rule collection's logic.
   */
  getCleanDescription(): string {
    return Object.entries(this.collection)
      .map(([subject, rule]) => {
        const currDescription: string = rule.getCleanDescription();
        const isInvert: boolean = this._isInvertLogic(
          currDescription,
          this.conjunction
        );
        const isCollection: boolean = rule instanceof BaseRuleCollection;

        return isInvert
          ? `(${!isCollection ? `${subject} ` : ''}${currDescription})`
          : `${!isCollection ? `${subject} ` : ''}${currDescription}`;
      })
      .join(` ${this.conjunction.toUpperCase()} `);
  }

  /**
   * Validates the provided inputs against the rules in the collection.
   * @param input Inputs to validate.
   * @param variables Optional variables for rule validation.
   * @returns The result of the validation.
   */
  async validate(
    input: {
      [key in string]: unknown;
    },
    variables?: {
      [key in string]?: Record<string, unknown>;
    }
  ): Promise<boolean> {
    if (
      !this._isIdenticalKeySet(Object.keys(this.collection), Object.keys(input))
    ) {
      throw new Error(
        'CANNOT perform validation in rule collection because of two different key sets.'
      );
    }

    const recordHistory: Set<RecordId> = new Set([this._recordId]);

    if (Object.keys(this.collection).length === 0) {
      return false;
    }

    if (this.conjunction === 'and') {
      return Object.entries(this.collection).every(async ([subject, rule]) => {
        return this._validate(subject, rule, recordHistory, input, variables);
      });
    }

    return Object.entries(this.collection).some(async ([subject, rule]) => {
      return this._validate(subject, rule, recordHistory, input, variables);
    });
  }

  /**
   * Combines two rule collections into a new rule collection with a specified conjunction.
   * @param ruleCollection Another rule collection to combine with this one.
   * @param conjunction The conjunction to use for the new combined rule collection.
   * @returns The new combined rule collection.
   */
  concat(
    ruleCollection: BaseRuleCollection,
    conjunction: 'and' | 'or'
  ): BaseRuleCollection {
    return new BaseRuleCollection({
      collection: {
        '0': this,
        '1': ruleCollection,
      },
      conjunction,
    });
  }

  /**
   * Validates a specific input against a specific rule within the rule collection.
   * This protected method is used internally by the `validate` method to apply individual
   * rules  to corresponding parts of the input data.
   * @param subject The key representing the specific part of input data to validate.
   * @param rule The rule or rule collection to apply.
   * @param recordHistory A set of record IDs to track rule application and prevent recursion.
   * @param input The entire input data.
   * @param variables Optional additional variables needed for validation.
   * @returns The result of the validation for the specific input part.
   * @internal
   */
  protected async _validate(
    subject: string,
    rule: BaseRule | BaseRuleCollection,
    recordHistory: Set<RecordId>,
    input: {
      [key in string]: unknown;
    },
    variables?: {
      [key in string]?: Record<string, unknown>;
    }
  ): Promise<boolean> {
    if (rule instanceof BaseRule) {
      return await rule.validate(input[subject], variables?.[subject]);
    }
    const collectionVariables = Object.fromEntries(
      Object.entries(variables ?? {})
        .filter(([cSubject, _]) => {
          return cSubject.startsWith(`${subject}.`);
        })
        .map(([cSubject, cVariables]) => {
          const substring = `${subject}.`;
          const startIndex = cSubject.indexOf(substring);

          if (startIndex === -1) {
            throw new Error(
              `CANNOT perform validation bacause of incorrect key name of the variable: ${subject}`
            );
          }

          const sliceFromIndex = startIndex + substring.length;
          return [cSubject.substring(sliceFromIndex), cVariables];
        })
    );

    if (recordHistory.size === 17) {
      throw new Error('number of collections reaches the maximum');
    }

    if (recordHistory.has(rule._recordId)) {
      throw new Error('CANNOT recursively register rule collection');
    }
    recordHistory.add(rule._recordId);

    return await rule.validate(input, collectionVariables);
  }

  protected _isIdenticalKeySet(keyset1: string[], keyset2: string[]): boolean {
    if (keyset1.length !== keyset2.length) {
      return false;
    }

    const sortedKeys1 = keyset1.slice().sort();
    const sortedKeys2 = keyset1.slice().sort();

    for (let i = 0; i < sortedKeys1.length; i++) {
      if (sortedKeys1[i] !== sortedKeys2[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Determines whether a given description represents a composite rule.
   * This method checks if the description includes logical operators such as 'AND' or 'OR',
   * indicating a composite of multiple rules.
   * @param description The rule description to check.
   * @returns True if the description includes composite rule indicators, false otherwise.
   * @internal
   */
  protected _isCompositeRule(description: string): boolean {
    return description.includes('AND') || description.includes('OR');
  }

  /**
   * Extracts the outermost logical conjunction ('AND' or 'OR') from a rule description.
   * This method analyzes the rule description to determine the highest-level logical operator
   * governing its logic.
   * @param description The rule description to analyze.
   * @returns The outermost logical conjunction ('AND' or 'OR').
   * @throws Throws if the description does not contain a clear outermost conjunction.
   * @internal
   */
  protected _getOutermostConjunction(description: string): string {
    const isMatchingParentheses = (expression: string): boolean => {
      let balance = 0;
      for (let i = 0; i < expression.length; i++) {
        if (expression[i] === '(') balance++;
        else if (expression[i] === ')') balance--;

        if (balance < 0) return false;
      }
      return balance === 0;
    };

    let expression = description.trim();

    while (
      expression.startsWith('(') &&
      expression.endsWith(')') &&
      isMatchingParentheses(expression)
    ) {
      expression = expression.substring(1, expression.length - 1).trim();
    }

    let depth = 0;
    let cleanedExpression = '';

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];
      if (char === '(') {
        depth++;
      } else if (char === ')') {
        depth--;
      } else if (depth === 0) {
        cleanedExpression += char;
      }
    }

    const andIndex: number = cleanedExpression.indexOf('AND');
    const orIndex: number = cleanedExpression.indexOf('OR');

    if (andIndex !== -1 && (andIndex < orIndex || orIndex === -1)) {
      return 'AND';
    } else if (orIndex !== -1 && (orIndex < andIndex || andIndex === -1)) {
      return 'OR';
    }

    throw new Error(
      `description CANNOT get outmost conjunction: ${description}`
    );
  }

  /**
   * Checks if the logic of a rule description is inverted relative to a given conjunction.
   * This method is used to determine if the description's logic needs to be presented 
   * differently based on the specified conjunction.
   * @param description The description of the rule.
   * @param conjunction The conjunction to compare against.
   * @returns True if the rule's logic is inverted relative to the conjunction, false otherwise.
   * @internal
   */
  protected _isInvertLogic(
    description: string,
    conjunction: 'and' | 'or'
  ): boolean {
    if (!this._isCompositeRule(description)) {
      return false;
    }

    const currConjunction: string = this._getOutermostConjunction(description);
    return currConjunction.toLowerCase() !== conjunction;
  }
}
