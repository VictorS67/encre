import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { DN100, DN0, N0, N10 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import { css } from '@mui/material';
import clsx from 'clsx';
import { useRecoilState, useRecoilValue } from 'recoil';

import { useStableCallback } from '../hooks/useStableCallback';
import {
  registeredGuardrailsState,
  selectingGuardrailIdsState,
} from '../state/guardrail';
import {
  Guardrail,
  Node,
  NodeInputPortDef,
  NodeOutputPortDef,
  SerializedRule,
  SerializedRuleCollection,
  UIContext,
} from '../types/studio.type';
import {
  ConditionUIContextContainerProps,
  ConditionUIContextItemProps,
} from '../types/uicontext.type';
import { isNotNull } from '../utils/safeTypes';

import { DropdownButton } from './DropdownButton';
import { GuardrailHub } from './GuardrailHub';
import { Icon } from './Icon';
import { Modal } from './Modal';
import { KnownNodeContentBody } from './NodeContentBody';
import { RuleCollectionEditor } from './RuleCollectionEditor';

const ConditionUIContainer = styled.div`
  align-self: stretch;
  width: 100%;
  margin-top: 3px;
  margin-bottom: 3px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  display: inline-flex;
  user-select: none;
  background: var(--node-background-color);

  .ui-context-key {
    width: 18px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    align-self: stretch;
    background: var(--node-foreground-color);
    border-right: 2px solid var(--primary-color);
  }

  .port-label {
    font-size: 14px;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
    user-select: none;
    align-self: strech;
    cursor: default;

    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    hyphens: auto;
  }

  .input-port.port-label {
    color: var(--text-color-accent-1);
  }

  .output-port.port-label {
    color: var(--text-color-accent-2);
  }

  .ui-context-container {
    display: flex;
    padding: 5px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    flex: 1;
    overflow: hidden;
  }

  .ui-context-container-header {
    display: flex;
    width: auto;
    align-self: stretch;
    gap: 3px;

    &:hover > .ui-context-tooling {
      opacity: 1;
    }
  }

  .ui-context-container-header-part {
    display: flex;
    gap: 2px;
    white-space: nowrap;
    overflow: visible;
  }

  .spacer {
    flex-grow: 1;
  }

  .ui-context-type {
    display: flex;
    padding: 0px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    border: 1px solid var(--text-color-accent-4);
    background: var(--node-foreground-color);

    color: var(--text-color-accent-4);
    text-transform: uppercase;
    word-wrap: break-word;
  }

  .ui-context-editable-label {
    display: flex;
    padding: 0px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    overflow: visible;

    border-radius: 4px;
    background: var(--node-foreground-color);
    border: 1px solid var(--node-foreground-color);

    color: var(--text-color);
    word-wrap: break-word;

    &:hover {
      background: var(--node-background-color-1);
      border: 1px solid var(--text-color-accent-3);
    }

    &.active {
      border: 1px solid var(--text-color-accent-3);
    }
  }

  .ui-context-dropdown {
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
  }

  .ui-context-placeholder {
    color: var(--text-disabled-color);

    white-space: pre-wrap;
  }

  .ui-context-text {
    color: var(--text-color-accent-3);

    white-space: pre-wrap;
  }

  .ui-context-readonly-label {
    display: flex;
    padding: 0px 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    border-radius: 4px;
    border: 1px var(--node-background-color) solid;

    color: var(--text-color);
    word-wrap: break-word;
  }

  .ui-context-button {
    align-self: center;
    height: 15px;
    font-size: 11px;
    display: flex;
    padding: 0px 4px;
    align-items: center;
    overflow: hidden;
    gap: 2px;

    border-radius: 4px;
    border: 1px var(--node-background-color-1) solid;
    background: var(--node-background-color-1);

    color: var(--text-color);
    word-wrap: break-word;

    &:hover {
      border: 1px var(--node-foreground-color) solid;
      background: var(--node-foreground-color);
    }
  }

  .ui-context-tooling {
    opacity: 0;
  }

  .ui-context-editor {
    align-self: stretch;
    overflow: hidden;
    padding: 4px;
    border-radius: 4px;
    flex-direction: column;
    display: flex;

    background: var(--node-foreground-color);
  }
`;

const GuardrailHubTags = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 5px;
  user-select: none;

  .guardrail-tag {
    display: flex;
    flex-shrink: 1;
    gap: 3px;
    border-radius: 4px;

    align-items: center;

    padding: 1px 2px;
    border: 1px solid var(--text-color-2);

    &:hover {
      border: 1px solid var(--primary-color);
      background: var(--primary-color-1);
      color: ${N10};
    }
  }

  .guardrail-tag-index {
    border: 1px solid var(--text-color);
    border-radius: 4px;
    width: 14px;
    height: 14px;
    background: var(--node-background-color);
    color: var(--text-color);
    font-size: 11px;
    font-weight: 700;
    diaplay: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  .guardrail-tag-type {
    display: flex;
    padding: 0 2px;
    height: 14px;
    font-size: 11px;
    font-weight: 700;
    justify-content: center;
    align-items: center;

    border-radius: 4px;
    border: 1px solid var(--text-color-accent-4);
    background: var(--node-background-color);
    color: var(--text-color-accent-4);
    text-transform: uppercase;
    word-wrap: break-word;
  }

  .guardrail-tag-name {
    font-size: 11px;
  }
`;

export const ConditionUIContextContainer: FC<ConditionUIContextContainerProps> =
  memo(
    ({
      node,
      uiType,
      target,
      sources,
      when,
      otherwiseWhen,
      otherwise,
    }: ConditionUIContextContainerProps) => {
      const [
        selectedEditableConditionIndex,
        setSelectedEditableConditionIndex,
      ] = useState<number | undefined>();
      const [openEditorModal, setOpenEditorModal] = useState<boolean>(false);

      const onEditableConditionClick = useStableCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const index = e.currentTarget.getAttribute('data-label');

          if (index !== null) {
            console.log(`onEditableConditionClick: index: ${+index}`);

            if (selectedEditableConditionIndex === +index) {
              setSelectedEditableConditionIndex(undefined);
            } else {
              setSelectedEditableConditionIndex(+index);
            }
          }
        },
      );

      const onConditionEditorClick = useCallback(
        (n: Node, ui: UIContext, id: string) => {
          setOpenEditorModal(true);
          console.log(
            `onConditionEditorClick: openEditorModal - ${openEditorModal}`,
          );
        },
        [],
      );

      const onDummyClick = useCallback(() => {
        console.log('Opening modal');
        setOpenEditorModal(true);
      }, [setOpenEditorModal]);

      const onDummyClose = useCallback(() => {
        setOpenEditorModal(false);
      }, [setOpenEditorModal]);

      const registeredGuardrails = useRecoilValue(registeredGuardrailsState);
      const [selectingGuardrailIds, setSelectingGuardrailIds] = useRecoilState(
        selectingGuardrailIdsState,
      );
      const [selectingGuardDisplayData, setSelectingGuardDisplayData] =
        useState<
          Array<{
            index: number;
            type: string;
            name: string;
          }>
        >([]);

      useEffect(() => {
        const guardrails: Guardrail[] = Object.values(registeredGuardrails);

        setSelectingGuardDisplayData(
          selectingGuardrailIds
            .map((id, index) => {
              const guardrail: Guardrail | undefined = guardrails.find(
                (g) => g.id === id,
              );

              if (guardrail) {
                return {
                  index,
                  type: guardrail.type,
                  name: guardrail.name,
                };
              } else {
                return null;
              }
            })
            .filter(isNotNull),
        );
      }, [selectingGuardrailIds, registeredGuardrails]);

      const updateIfNode = (
        n: Node,
        newRuleCollection: SerializedRule | SerializedRuleCollection,
      ) => {
        // TODO: Update the if node data based on the new rule collection
      };

      return (
        <>
          <ConditionUIContainer>
            <div className="ui-context-key">
              <span className={clsx('output-port', 'port-label')}>
                {target}
              </span>
            </div>
            <div className="ui-context-container">
              <ConditionUIContextItem
                key={`when-${0}`}
                type={'if'}
                node={node}
                condition={when}
                sources={sources}
                index={0}
                selectedIndex={selectedEditableConditionIndex}
                showOtherwiseWhen
                showOtherwise={otherwise === undefined}
                onConditionClick={onEditableConditionClick}
                onConditionEditorClick={onConditionEditorClick}
              />

              {otherwiseWhen?.map((ow, index) => (
                <ConditionUIContextItem
                  key={`when-${index + 1}`}
                  type={'else-if'}
                  node={node}
                  condition={ow}
                  sources={sources}
                  index={index + 1}
                  selectedIndex={selectedEditableConditionIndex}
                  showOtherwiseWhen
                  showOtherwise={otherwise === undefined}
                  onConditionClick={onEditableConditionClick}
                  onConditionEditorClick={onConditionEditorClick}
                />
              ))}

              {otherwise && (
                <ConditionUIContextItem
                  key={`when-${otherwiseWhen ? otherwiseWhen.length + 1 : 1}`}
                  type={'otherwise'}
                  node={node}
                  condition={otherwise}
                  sources={sources}
                  index={otherwiseWhen ? otherwiseWhen.length + 1 : 1}
                  selectedIndex={selectedEditableConditionIndex}
                  onConditionClick={onEditableConditionClick}
                  onConditionEditorClick={onConditionEditorClick}
                />
              )}
            </div>
          </ConditionUIContainer>

          <button onClick={onDummyClick}>Open Modal</button>

          {/* <EditorModal open={openEditorModal} /> */}

          <Modal
            open={openEditorModal}
            title={'If Condition Editor'}
            showCloseIcon
            disableEnforceFocus
            disableAutoFocus
            onClose={onDummyClose}
          >
            <>
              {when.metadata !== undefined && (
                <RuleCollectionEditor
                  sources={sources}
                  ruleCollection={when.metadata}
                  onRuleCollectionUpdate={useStableCallback(
                    (
                      newRuleCollection:
                        | SerializedRule
                        | SerializedRuleCollection,
                    ) => updateIfNode(node, newRuleCollection),
                  )}
                />
              )}

              <GuardrailHubTags>
                {selectingGuardDisplayData.map((gData, idx) => (
                  <div className="guardrail-tag" key={idx}>
                    <div className="guardrail-tag-index">
                      <code>{gData.index + 1}</code>
                    </div>
                    <div className="guardrail-tag-type">
                      <pre className="pre-wrap">{gData.type.slice(0, 3)}</pre>
                    </div>
                    <div>{gData.name}</div>
                  </div>
                ))}
              </GuardrailHubTags>

              <GuardrailHub />
            </>
          </Modal>
        </>
      );
    },
  );

ConditionUIContextContainer.displayName = 'ConditionUIContextContainer';

export const ConditionUIContextItem: FC<ConditionUIContextItemProps> = ({
  type,
  node,
  condition,
  sources,
  index,
  selectedIndex,
  showOtherwiseWhen,
  showOtherwise,
  onConditionClick,
  onConditionEditorClick,
}: ConditionUIContextItemProps) => {
  const [source, setSource] = useState<string | undefined>();
  const uiContext: Extract<UIContext, { type: 'code' }> =
    condition.type === 'otherwise'
      ? {
          type: 'code',
          text: '',
          language: 'encre-code',
          keywords: ['AND', 'OR'],
          // properties: sources,
        }
      : {
          type: 'code',
          text: condition.description ?? '',
          language: 'encre-code',
          keywords: ['AND', 'OR'],
          // properties: sources,
        };

  const onDropDownMenuClick = useStableCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const idx = e.currentTarget.getAttribute('data-label');

    if (idx !== null && +idx < sources.length) {
      const property: string = sources[+idx];

      console.log(`property: ${property}`);
      setSource(property);

      // TODO: update condition target
    }
  });

  useEffect(() => {
    setSource(condition.source);
  }, [condition.source]);

  return (
    <>
      <div className="ui-context-container-header">
        <div className="ui-context-container-header-part">
          <div className="ui-context-readonly-label">
            {type === 'if' && <pre>If</pre>}
            {type === 'else-if' && <pre>Else if</pre>}
            {type === 'otherwise' && <pre>Otherwise</pre>}
          </div>

          {type !== 'otherwise' && (
            <div
              className={clsx({
                'ui-context-editable-label': true,
                active: selectedIndex !== undefined && selectedIndex === index,
              })}
              data-label={index}
              onClick={onConditionClick}
            >
              <pre className="ui-context-text">condition</pre>
            </div>
          )}

          <div className="ui-context-readonly-label">
            <pre>, receives</pre>
          </div>

          <DropdownButton
            name={source ?? ''}
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
            onDropDownMenuClick={onDropDownMenuClick}
          />
        </div>

        {showOtherwiseWhen && (
          <div
            className={clsx(
              'ui-context-container-header-part',
              'ui-context-tooling',
            )}
          >
            <div className="ui-context-button">
              <Icon
                icon={AddRoundedIcon}
                height={'11px'}
                width={'10px'}
                fontSize={'11px'}
              />
              <span>when</span>
            </div>
          </div>
        )}

        {showOtherwise && (
          <div
            className={clsx(
              'ui-context-container-header-part',
              'ui-context-tooling',
            )}
          >
            <div className="ui-context-button">
              <Icon
                icon={AddRoundedIcon}
                height={'11px'}
                width={'10px'}
                fontSize={'11px'}
              />
              <span>otherwise</span>
            </div>
          </div>
        )}

        {type !== 'if' && (
          <div
            className={clsx(
              'ui-context-container-header-part',
              'ui-context-tooling',
            )}
          >
            <Icon
              icon={ClearRoundedIcon}
              height={'15px'}
              width={'15px'}
              fontSize={'15px'}
              additionalStyles={css`
                align-self: center;
                color: var(--error-color-1);

                &:hover {
                  color: var(--error-color);
                }
              `}
            />
          </div>
        )}
      </div>

      {/* {selectedIndex !== undefined && selectedIndex === index ? (
        <div className="ui-context-editor">
          <KnownNodeContentBody
            node={node}
            uiContexts={[uiContext]}
            onEditorClick={onConditionEditorClick}
          />
        </div>
      ) : null} */}
    </>
  );
};
