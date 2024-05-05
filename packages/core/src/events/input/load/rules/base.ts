import { RecordId } from '../../../../load/keymap';
import { Serializable } from '../../../../load/serializable';
import { SerializedRuleCollection } from '../../../../studio/serde';
import { BaseRule } from '../../../inference/validate/guardrails/base';

export interface BaseRuleCollectionField {
  collection: Record<string, BaseRule | BaseRuleCollection>;
  conjunction?: 'and' | 'or'; // default is AND
}

export class BaseRuleCollection
  extends Serializable
  implements BaseRuleCollectionField
{
  _namespace: string[] = ['events', 'input', 'load', 'rules'];

  collection: Record<string, BaseRule | BaseRuleCollection>;

  conjunction: 'and' | 'or';

  constructor(fields: BaseRuleCollectionField) {
    super(fields);

    this.collection = fields.collection;
    this.conjunction = fields.conjunction ?? 'and';
  }

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

  protected _isCompositeRule(description: string): boolean {
    return description.includes('AND') || description.includes('OR');
  }

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
