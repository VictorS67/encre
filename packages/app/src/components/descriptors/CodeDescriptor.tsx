import React, {
  FC,
  Suspense,
  memo,
  useCallback,
  useState,
  useEffect,
} from 'react';

import { useRecoilState } from 'recoil';

import { useStableCallback } from '../../hooks/useStableCallback';
import { editingCodeIdState } from '../../state/editor';
import { editingNodeIdState } from '../../state/node';
import { CodeUIContext, Node, UIContext } from '../../types/studio.type';
import { UIContextDescriptor } from '../../types/uicontext.type';
import { fakeId } from '../../utils/fakeId';
import { LazyCodeEditor, LazySyntaxedText } from '../LazyComponents';

/* eslint-disable react/prop-types */
export const CodeNodeContentBody: FC<
  {
    node: Node;
    id: string;
    onEditClick?: (node: Node, editingId: string) => void;
  } & CodeUIContext
> = memo(
  ({
    node,
    id,
    text,
    language,
    keywords,
    properties,
    variables,
    onEditClick,
  }) => {
    const [editingNodeId, setEditingNodeId] =
      useRecoilState(editingNodeIdState);
    const [editingCodeId, setEditingCodeId] =
      useRecoilState(editingCodeIdState);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const onCodeContentClick = useCallback(
      (e: React.MouseEvent) => {
        console.log(`on code click: ${node.id}`);

        e.preventDefault();
        e.stopPropagation();

        onEditClick?.(node, id);

        setEditingNodeId(node.id);
        setEditingCodeId(id);
      },
      [setEditingNodeId, setEditingCodeId],
    );

    // useEffect(() => {
    //   setEditingNodeId(undefined);
    //   setEditingCodeId(undefined);
    // }, []);

    useEffect(() => {
      console.log(
        `editingNodeId: ${editingNodeId}, editingCodeId: ${editingCodeId}`,
      );

      setIsEditing(editingNodeId === node.id && editingCodeId === id);
    }, [editingCodeId, editingNodeId]);

    return (
      <Suspense fallback={<div />}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            flex: 1,
          }}
          onClick={onCodeContentClick}
          data-label={'editor'}
        >
          {isEditing && !onEditClick && (
            <LazyCodeEditor
              text={text}
              language={language}
              keywords={keywords}
              properties={properties}
              variables={variables}
            />
          )}
          {(!isEditing || onEditClick) && (
            <div style={{ paddingLeft: 10 }}>
              <LazySyntaxedText
                text={text}
                language={language}
                keywords={keywords}
                properties={properties}
                variables={variables}
              />
            </div>
          )}
        </div>
      </Suspense>
    );
  },
);

CodeNodeContentBody.displayName = 'CodeNodeContentBody';

export const codeDescriptor: UIContextDescriptor<'code'> = {
  Body: CodeNodeContentBody,
};
