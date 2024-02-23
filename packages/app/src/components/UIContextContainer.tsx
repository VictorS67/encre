import React, { FC, memo, useState } from 'react';

import styled from '@emotion/styled';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import clsx from 'clsx';

import { Icon } from './Icon';
import { KnownNodeContentBody } from './NodeContentBody';
import { useUIContextDescriptors } from '../hooks/useUIContextDescriptors';
import { UIContext } from '../types/studio.type';
import {
  UIContextContainerProps,
  UIContextDescriptor,
} from '../types/uicontext.type';

const UIContainer = styled.div`
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
    display: flex;
    padding-right: 2px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    align-self: stretch;
    background: var(--primary-color);
  }

  .ui-context-container {
    display: flex;
    padding: 5px;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    flex: 1;
  }

  .ui-context-container-header {
    display: flex;
    width: auto;
    align-self: stretch;
  }

  .ui-context-container-header-part {
    display: flex;
    gap: 5px;
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
    background: var(--node-forground-color);

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

    border-radius: 4px;
    background: var(--node-forground-color);
    border: 1px solid var(--node-forground-color);

    color: var(--text-color);
    word-wrap: break-word;

    &:hover {
      background: var(--node-background-color-2);
      border: 1px solid var(--text-color-accent-3);
    }

    &.active {
      border: 1px solid var(--text-color-accent-3);
    }
  }

  .ui-context-placeholder {
    color: var(--canvas-foreground-color);

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

  .ui-context-editor {
    align-self: stretch;
    overflow: hidden;
    padding: 4px;
    border-radius: 4px;
    flex-direction: column;
    display: flex;

    background: var(--node-forground-color);
  }

  .ui-context-editor-box {
    align-self: stretch;
    padding-left: 4px;
    padding-right: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;

    color: var(--text-color);
    font-size: 8.24px;
    word-wrap: break-word;
  }
`;

export const UIContextContainer: FC<UIContextContainerProps> = ({
  node,
  uiType,
  editableLabels,
  editableContents,
  readonlyLabels,
}: UIContextContainerProps) => {
  const [selectedEditableContentName, setSelectedEditableContentName] =
    useState<string | undefined>();

  const onEditableContentNameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const name = e.currentTarget.getAttribute('data-label');

    if (name !== null) {
      if (selectedEditableContentName === name) {
        setSelectedEditableContentName(undefined);
      } else {
        setSelectedEditableContentName(name);
      }
    }
  };

  return (
    <UIContainer>
      <div className="ui-context-key">
        <Icon icon={DragIndicatorIcon} width={'18px'} fontSize={'24px'} />
      </div>
      <div className="ui-context-container">
        <div className="ui-context-container-header">
          <div className="ui-context-container-header-part">
            <div className="ui-context-type">
              <pre className="pre-wrap">{uiType}</pre>
            </div>
            {Object.entries(editableLabels).map(([name, value], i) => (
              <div className="ui-context-editable-label" key={i}>
                {value === '' ? (
                  <pre className="ui-context-placeholder">{name}</pre>
                ) : (
                  <pre className="pre-wrap">{value}</pre>
                )}
              </div>
            ))}

            {Object.keys(editableContents).map((name, i) => (
              <div
                className={clsx({
                  'ui-context-editable-label': true,
                  active:
                    selectedEditableContentName &&
                    name === selectedEditableContentName,
                })}
                key={i}
                data-label={name}
                onClick={onEditableContentNameClick}
              >
                <pre className="ui-context-text">{name}</pre>
              </div>
            ))}
          </div>

          <div className="spacer"></div>

          <div
            className="ui-context-container-header-part"
            style={{ marginLeft: 'auto' }}
          >
            {readonlyLabels.map((label, i) => (
              <div className="ui-context-readonly-label" key={i}>
                <pre className="pre-wrap">{label}</pre>
              </div>
            ))}
          </div>
        </div>

        {selectedEditableContentName &&
        editableContents[selectedEditableContentName] ? (
          <div className="ui-context-editor">
            <KnownNodeContentBody
              node={node}
              uiContexts={editableContents[selectedEditableContentName]}
            />
          </div>
        ) : null}
      </div>
    </UIContainer>
  );
};

UIContextContainer.displayName = 'UIContextContainer';
