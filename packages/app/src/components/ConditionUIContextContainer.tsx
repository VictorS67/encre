import React, { FC, memo, useEffect, useRef, useState } from 'react';

import { DN100, DN0, N0 } from '@atlaskit/theme/colors';
import styled from '@emotion/styled';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { css } from '@mui/material';
import clsx from 'clsx';
import { useSetRecoilState } from 'recoil';

import { DropdownButton } from './DropdownButton';
import { Icon } from './Icon';
import { KnownNodeContentBody } from './NodeContentBody';
import { useStableCallback } from '../hooks/useStableCallback';
import { editingCodeIdState } from '../state/editor';
import { editingNodeIdState } from '../state/node';
import { UIContext } from '../types/studio.type';
import {
  ConditionUIContextContainerProps,
  ConditionUIContextItemProps,
} from '../types/uicontext.type';
import { hexToRgba } from '../utils/colorConverter';

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

export const ConditionUIContextContainer: FC<ConditionUIContextContainerProps> =
  memo(
    ({
      node,
      uiType,
      subject,
      properties,
      when,
      otherwiseWhen,
      otherwise,
    }: ConditionUIContextContainerProps) => {
      const setEditingNodeId = useSetRecoilState(editingNodeIdState);
      const setEditingCodeId = useSetRecoilState(editingCodeIdState);
      const [
        selectedEditableConditionIndex,
        setSelectedEditableConditionIndex,
      ] = useState<number | undefined>();

      const onEditableConditionClick = useStableCallback(
        (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();

          const index = e.currentTarget.getAttribute('data-label');
          // setEditingNodeId(undefined);
          // setEditingCodeId(undefined);

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

      return (
        <ConditionUIContainer>
          <div className="ui-context-key">
            <span className={clsx('output-port', 'port-label')}>{subject}</span>
          </div>
          <div className="ui-context-container">
            <ConditionUIContextItem
              key={`when-${0}`}
              type={'if'}
              node={node}
              condition={when}
              properties={properties}
              index={0}
              selectedIndex={selectedEditableConditionIndex}
              showOtherwiseWhen
              showOtherwise={otherwise === undefined}
              onConditionClick={onEditableConditionClick}
            />

            {otherwiseWhen?.map((ow, index) => (
              <ConditionUIContextItem
                key={`when-${index + 1}`}
                type={'else-if'}
                node={node}
                condition={ow}
                properties={properties}
                index={index + 1}
                selectedIndex={selectedEditableConditionIndex}
                showOtherwiseWhen
                showOtherwise={otherwise === undefined}
                onConditionClick={onEditableConditionClick}
              />
            ))}

            {otherwise && (
              <ConditionUIContextItem
                key={`when-${otherwiseWhen ? otherwiseWhen.length + 1 : 1}`}
                type={'otherwise'}
                node={node}
                condition={otherwise}
                properties={properties}
                index={otherwiseWhen ? otherwiseWhen.length + 1 : 1}
                selectedIndex={selectedEditableConditionIndex}
                onConditionClick={onEditableConditionClick}
              />
            )}
          </div>
        </ConditionUIContainer>
      );
    },
  );

ConditionUIContextContainer.displayName = 'ConditionUIContextContainer';

export const ConditionUIContextItem: FC<ConditionUIContextItemProps> = ({
  type,
  node,
  condition,
  properties,
  index,
  selectedIndex,
  showOtherwiseWhen,
  showOtherwise,
  onConditionClick,
}: ConditionUIContextItemProps) => {
  const [target, setTarget] = useState<string | undefined>();
  const uiContext: Extract<UIContext, { type: 'code' }> = {
    type: 'code',
    text: condition.description ?? '',
    language: 'encre-code',
    keywords: ['AND', 'OR'],
    properties,
  };

  const onDropDownMenuClick = useStableCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const idx = e.currentTarget.getAttribute('data-label');

    if (idx !== null && +idx < properties.length) {
      const property: string = properties[+idx];

      console.log(`property: ${property}`);
      setTarget(property);

      // TODO: update condition target
    }
  });

  const onEditorClick = useStableCallback((n: Node, ui: UIContext) => {});

  useEffect(() => {
    setTarget(condition.target);
  }, [condition.target]);

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
            name={target ?? ''}
            items={properties.map((p) => ({ name: p }))}
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

      {selectedIndex !== undefined && selectedIndex === index ? (
        <div className="ui-context-editor">
          <KnownNodeContentBody node={node} uiContexts={[uiContext]} />
        </div>
      ) : null}
    </>
  );
};
