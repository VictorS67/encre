import React, { FC, useEffect, useState } from 'react';

import { DN100, DN0, N0, N10 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';
import { match } from 'ts-pattern';

import { DropdownButton } from './DropdownButton';
import { useStableCallback } from '../hooks/useStableCallback';
import {
  RuleCollectionEditorProps,
  RuleEditorProps,
} from '../types/guardrail.type';
import { SerializedRule, SerializedRuleCollection } from '../types/studio.type';

export const RuleCollection = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 5px;
  align-items: center;

  span {
    white-space: normal;
    overflow-wrap: break-word;
  }

  .root-rule-collection {
    display: flex;
    flex-flow: row wrap;
    gap: 3px;
    align-items: center;

    padding: 2px 3px;
    border-radius: 4px;
    border: 1px solid var(--text-color-2);

    &:hover {
      border: 1px solid var(--text-color);
      background: var(--text-color-2);
    }
  }

  .rule-collection-wrapper {
    display: flex;
    flex-flow: row wrap;
    gap: 2px;
    align-items: center;
  }

  .root-rule {
    display: flex;
    flex-flow: row wrap;
    gap: 2px;
    align-items: center;
    border-radius: 4px;
  }

  .merged-rule {
    display: flex;
    flex-flow: row wrap;
    gap: 3px;
    align-items: center;
    border-radius: 4px;

    &:hover {
      background: var(--node-background-color-1);
    }
  }

  .rule {
    display: flex;
    flex-flow: row wrap;
    gap: 5px;
    padding: 1px 2px;
    border-radius: 4px;

    &:hover {
      background: var(--primary-color-1);
      outline: 1px solid var(--primary-color);
      color: ${N10};
    }
  }

  .rule-editable-label {
    display: flex;
    padding: 0px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    background: var(--node-foreground-color);
    border: 1px solid var(--node-foreground-color);

    color: var(--text-color);
    word-wrap: break-word;

    &:hover {
      border: 1px solid var(--text-color-accent-3);
    }

    &.active {
      border: 1px solid var(--text-color-accent-3);
    }
  }

  .rule-placeholder {
    color: var(--text-disabled-color);

    white-space: pre-wrap;
  }
`;

export const RuleCollectionEditor: FC<RuleCollectionEditorProps> = ({
  sources,
  ruleCollection,
  isPlaceholder = false,
  onRuleCollectionUpdate,
}) => {
  const { description, collection, conjunction } = ruleCollection;
  const operations: string[] = ['AND', 'OR', 'NEW'];

  /* eslint no-useless-escape: "warn" */
  const pattern =
    /(?<bracket>[\(]?)((\{\{\{([^}]+)\}\}\} )?<(?<source>[^}]+)>([\w\W]*)<\/(\k<source>)>)[\)]?/g;

  const [conditionsToRender, setConditionsToRender] = useState<
    Array<{
      subject: string;
      showSubject: boolean;
      showBracket: boolean;
      rule: SerializedRuleCollection | SerializedRule;
      isPlaceholder?: boolean;
    }>
  >([]);

  useEffect(() => {
    const conditions: Array<{
      subject: string;
      showSubject: boolean;
      showBracket: boolean;
      rule: SerializedRuleCollection | SerializedRule;
      isPlaceholder?: boolean;
    }> = [];

    let ruleCollectionMatch: RegExpExecArray | null;
    while ((ruleCollectionMatch = pattern.exec(description)) !== null) {
      const bracket: string = ruleCollectionMatch[1];
      const subjectToDisplay: string | undefined = ruleCollectionMatch[3];
      const subject: string = ruleCollectionMatch[5];

      const showSubject = !!subjectToDisplay;
      const showBracket: boolean = bracket === '(';
      const rule: SerializedRuleCollection | SerializedRule =
        collection[subject];

      conditions.push({
        subject,
        showSubject,
        showBracket,
        rule,
      });
    }

    setConditionsToRender(conditions);
  }, []);

  const onDropDownConjMenuClick = useStableCallback(
    (
      e: React.MouseEvent,
      additionalKwargs?: {
        root: SerializedRuleCollection;
        left: {
          subject: string;
          rule: SerializedRuleCollection | SerializedRule;
        };
        right: {
          subject: string;
          rule: SerializedRuleCollection | SerializedRule;
        };
        index: number;
        items: string[];
      },
    ) => {
      e.preventDefault();
      e.stopPropagation();

      if (!additionalKwargs) {
        return;
      }

      const idx = e.currentTarget.getAttribute('data-label');
      const { root, left, right, index, items } = additionalKwargs;

      console.log(`idx: ${idx}`);
      console.log(`items: ${JSON.stringify(items)}`);

      if (idx !== null && +idx < items.length) {
        const operation: string = items[+idx];

        console.log(`operation: ${operation}`);

        if (operation.toLowerCase() === root.conjunction) {
          return;
        }

        // remove left and right rule/collection
        const conditionsToRenderBefore = conditionsToRender.slice(0, index);
        const conditionsToRenderAfter = conditionsToRender.slice(index + 2);

        const newRuleCollection = ruleCollection.collection;
        delete newRuleCollection[left.subject];
        delete newRuleCollection[right.subject];

        if (operation.toLowerCase() === 'new') {
          // TODO: clear the current pair, change it to a new single collection with empty subject

          // NOTE: do not update rule collection for now, this should be changed when the user update the condition
          const newCondition = {
            subject: '',
            showSubject: true,
            showBracket: false,
            rule: {
              _type: 'rule',
              _ruleType: '',
              description: '',
              func: '',
            } as SerializedRule,
            isPlaceholder: true,
          };
          setConditionsToRender([
            ...conditionsToRenderBefore,
            newCondition,
            ...conditionsToRenderAfter,
          ]);
        } else if (operation.toLowerCase() === 'and') {
          // TODO: wrap left and right rule/collection into a new collection with the conjunction of "and"
        } else {
          // TODO: wrap left and right rule/collection into a new collection with the conjuection of "or"
        }
      }
    },
  );

  return (
    <RuleCollection>
      {conditionsToRender.map((conditionToRender, index) => (
        <React.Fragment key={index}>
          <div className="rule-collection-wrapper">
            {conditionToRender.showBracket ? <span>{'('}</span> : null}
            <div className="root-rule-collection">
              {conditionToRender.showSubject && (
                <DropdownButton
                  name={conditionToRender.subject}
                  items={sources.map((p) => ({ name: p }))}
                  showIcon={false}
                  styling={{
                    width: 30,
                    borderRadius: 4,
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: 'Arial, Helvetica, sans-serif',
                    color: 'var(--text-color-accent-1)',
                    activeBorderColor: 'var(--text-color-accent-3)',
                  }}
                />
              )}
              {conditionToRender.rule._type === 'rule-collection' ? (
                <RuleCollectionEditor
                  sources={sources}
                  ruleCollection={conditionToRender.rule}
                  isPlaceholder={conditionToRender.isPlaceholder}
                  onRuleCollectionUpdate={onRuleCollectionUpdate}
                />
              ) : (
                <RuleEditor rule={conditionToRender.rule} />
              )}
            </div>
            {conditionToRender.showBracket ? <span>{')'}</span> : null}
          </div>

          {index < conditionsToRender.length - 1 && (
            <DropdownButton
              name={conjunction.toUpperCase()}
              items={operations
                .filter((name) => name !== conjunction.toUpperCase())
                .map((name) => ({
                  name,
                }))}
              showIcon={false}
              styling={{
                width: 45,
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Arial, Helvetica, sans-serif',
                color: 'var(--text-color-accent-3)',
                activeBorderColor: 'var(--text-color-accent-3)',
              }}
              additionalKwargs={{
                root: ruleCollection,
                left: {
                  subject: conditionsToRender[index].subject,
                  rule: conditionsToRender[index].rule,
                },
                right: {
                  subject: conditionsToRender[index + 1].subject,
                  rule: conditionsToRender[index + 1].rule,
                },
                index,
                items: operations.filter(
                  (name) => name !== conjunction.toUpperCase(),
                ),
              }}
              onDropDownMenuClick={onDropDownConjMenuClick}
            />
          )}
        </React.Fragment>
      ))}
    </RuleCollection>
  );
};

export const RuleEditor: FC<RuleEditorProps> = ({
  rule,
  showBracket,
  isPlaceholder = false,
}) => {
  const [cleanDescription, setCleanDescription] = useState<string>(
    rule.description,
  );
  const [editingFields, setEditingFields] = useState<
    Array<
      | {
          isEditable: false;
          description: string;
        }
      | {
          isEditable: true;
          description: {
            type: string;
            value: unknown;
          };
        }
    >
  >([]);

  const [leftShowBracket, setLeftShowBracket] = useState<boolean>(false);
  const [rightShowBracket, setRightShowBracket] = useState<boolean>(false);

  useEffect(() => {
    if (isPlaceholder) {
      setEditingFields([
        {
          isEditable: false,
          description: '',
        },
      ]);
    } else if (rule.metadata === undefined) {
      /* eslint no-useless-escape: "warn" */
      const pattern = /\{\{([^}]+)\}\}/g;

      let variableMatch: RegExpExecArray | null;
      const tempEditingFields: Array<
        | {
            isEditable: false;
            description: string;
          }
        | {
            isEditable: true;
            description: {
              type: string;
              value: unknown;
            };
          }
      > = [];
      while ((variableMatch = pattern.exec(rule.description)) !== null) {
        const varName: string = variableMatch[1];
        const path: string[] = varName.split('.');

        let json: Record<string, unknown> = rule.variables ?? {};
        for (let i = 0; i < path.length; i++) {
          const attr: string = path[i];
          const isLastAttr: boolean = i === path.length - 1;

          if (!Object.prototype.hasOwnProperty.call(json, attr)) {
            continue;
          }

          if (!isLastAttr) {
            json = json[attr] as Record<string, unknown>;
          } else {
            const regex = new RegExp(
              `\\{\\{${path.slice(0, i + 1).join('.')}\\}\\}`,
              'g',
            );

            const valueMatch: RegExpExecArray | null =
              regex.exec(cleanDescription);

            if (!valueMatch) {
              continue;
            }

            console.log(`cleanDescription: ${cleanDescription}`);
            console.log(
              `substring: ${cleanDescription.substring(0, valueMatch.index)}`,
            );
            console.log(valueMatch);
            const index = valueMatch.index;
            const matchText = valueMatch[0];
            const before = cleanDescription.substring(0, index);
            const after = cleanDescription.substring(index + matchText.length);

            tempEditingFields.push({
              isEditable: false,
              description: before,
            });

            tempEditingFields.push({
              isEditable: true,
              description: match(typeof json[attr])
                .with('string', () => ({
                  type: 'string',
                  value: json[attr],
                }))
                .with('boolean', () => ({
                  type: 'boolean',
                  value: json[attr],
                }))
                .with('number', () => ({
                  type: 'number',
                  value: json[attr],
                }))
                .otherwise(() => ({
                  type: 'string',
                  value: JSON.stringify(json[attr]),
                })),
            });

            setCleanDescription(after);
          }
        }
      }

      console.log(JSON.stringify(tempEditingFields));
      setEditingFields(tempEditingFields);
    } else {
      let pattern: RegExp;
      if (rule.metadata.conjunction === 'and') {
        pattern = /([\w\W]*) AND ([\w\W]*)/gm;
      } else {
        pattern = /([\w\W]*) OR ([\w\W]*)/gm;
      }

      console.log(`description: ${rule.description}`);

      let ruleMatch: RegExpExecArray | null;
      while ((ruleMatch = pattern.exec(rule.description)) !== null) {
        const leftDescription: string | undefined = ruleMatch[1];
        const rightDescription: string | undefined = ruleMatch[2];

        console.log(`leftDescription: ${leftDescription}`);
        console.log(`rightDescription: ${rightDescription}`);

        if (leftDescription) {
          setLeftShowBracket(
            leftDescription.startsWith('(') && leftDescription.endsWith(')'),
          );
        }

        if (rightDescription) {
          setRightShowBracket(
            rightDescription.startsWith('(') && rightDescription.endsWith(')'),
          );
        }
      }
    }
  }, []);

  return (
    <div className="root-rule">
      {showBracket ? <span>{'('}</span> : null}
      {rule.metadata !== undefined && (
        <div className="merged-rule">
          <RuleEditor rule={rule.metadata.left} showBracket={leftShowBracket} />
          <code
            style={{
              overflowWrap: 'break-word',
              color: 'var(--text-color-accent-3)',
            }}
          >
            {rule.metadata.conjunction.toUpperCase()}
          </code>
          {rule.metadata.right !== undefined && (
            <RuleEditor
              rule={rule.metadata.right}
              showBracket={rightShowBracket}
            />
          )}
        </div>
      )}
      {rule.metadata === undefined && (
        <div className="rule">
          {editingFields.map((ef, i) => {
            if (ef.isEditable) {
              const name = ef.description.type;
              const value = JSON.stringify(ef.description.value);

              return (
                <div className="rule-editable-label" key={i}>
                  {value === '' ? (
                    <pre className="rule-placeholder">{name}</pre>
                  ) : (
                    <pre className="pre-wrap">{value}</pre>
                  )}
                </div>
              );
            } else {
              return (
                <span style={{ overflowWrap: 'break-word' }} key={i}>
                  {ef.description}
                </span>
              );
            }
          })}
          {cleanDescription !== '' && (
            <span style={{ overflowWrap: 'break-word' }}>
              {cleanDescription}
            </span>
          )}
        </div>
      )}
      {showBracket ? <span>{')'}</span> : null}
    </div>
  );
};
