import { useDebounceFn, useLatest } from 'ahooks';
import React, {
  FC,
  Suspense,
  memo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';

import { Portal } from '@mui/base'; 

import { useRecoilState } from 'recoil';

import { useStableCallback } from '../../hooks/useStableCallback';
import { editingCodeIdState } from '../../state/editor';
import { CodeUIContext, Node, UIContext } from '../../types/studio.type';
import { SharedNodeBodyProps, SharedNodeEditorProps, UIContextDescriptor } from '../../types/uicontext.type';
import { LazyCodeEditor, LazySyntaxedText } from '../LazyComponents';
import { Modal } from '../Modal';
import { monaco } from '../../utils/monacoEditor';
import { parseMonacoTextValue } from '../../utils/testFunctions';

/* eslint-disable react/prop-types */
export const CodeNodeContentBody: FC<
  SharedNodeBodyProps & CodeUIContext
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
    return (
      <Suspense fallback={<div />}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            flex: 1,
          }}
          data-label={'editor'}
        >
          <div style={{ paddingLeft: 10 }}>
            <LazySyntaxedText
              text={text}
              language={language}
              keywords={keywords}
              properties={properties}
              variables={variables}
              style={{
                fontSize: '14px',
                fontFamily: 'monospace',
                lineHeight: '21px'
              }}
            />
          </div>
        </div>
      </Suspense>
    );
  },
);

CodeNodeContentBody.displayName = 'CodeNodeContentBody';

/* eslint-disable react/prop-types */
export const CodeNodeContentEditor: FC<
  SharedNodeEditorProps & CodeUIContext
> = memo(
  ({
    node,
    id,
    text,
    language,
    keywords,
    properties,
    variables,
    onChange,
    onEditClick,
  }) => {
    const nodeLatest = useLatest(node);

    const editorInstance = useRef<monaco.editor.IStandaloneCodeEditor>();

    const debouncedOnChange = useDebounceFn<(node: Node) => void>(onChange, { wait: 100 });

    const onEditorChange = async (newText: string) => {
      const output = await parseMonacoTextValue(newText);
      // debouncedOnChange.run({
      //   ...nodeLatest.current,
      //   data: {
      //     ...(nodeLatest.current?.data as Record<string, unknown> | undefined),
      //     [editorDef.dataKey]: newText,
      //   },
      // });
    };

    const onChangeLatest = useLatest(onEditorChange);

    useEffect(() => {
      if (editorInstance.current) {
        const currentValue = text;
  
        if (editorInstance.current.getValue() !== currentValue) {
          editorInstance.current.setValue(currentValue ?? '');
        }
  
        // editorInstance.current.updateOptions({
        //   readOnly: isReadonly,
        // });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text]);

    const [openEditorModal, setOpenEditorModal] = useState<boolean>(false);

    const onDummyClick = useCallback(() => {
      console.log('Opening modal');
      setOpenEditorModal(true);
    }, [setOpenEditorModal]);

    const onDummyClose = useCallback(() => {
      setOpenEditorModal(false);
    }, [setOpenEditorModal]);

    // const container = React.useRef(null);

    return (
      <Suspense fallback={<div />}>
        <div
          style={{
            display: 'flex',
            height: '100%',
            flex: 1,
          }}
          data-label={'editor'}
        >
          {/* <button onClick={onDummyClick}>Open Modal</button> */}
          {/* <Portal container={() => container.current!} disablePortal >
            <LazyCodeEditor
              text={text}
              language={language}
              keywords={keywords}
              properties={properties}
              variables={variables}
              fontSize={14}
              fontFamily={'monospace'}
            />
          </Portal> */}
          <LazyCodeEditor
            editorRef={editorInstance}
            text={text}
            language={language}
            keywords={keywords}
            properties={properties}
            variables={variables}
            fontSize={14}
            fontFamily={'monospace'}
            onChange={(newValue) => {
              onChangeLatest.current?.(newValue);
            }}
          />
        </div>
        {/* <Modal
          open={openEditorModal}
          title={'Dummy Modal'}
          showCloseIcon
          disableEnforceFocus
          disableAutoFocus
          onClose={onDummyClose}
        >
          <div style={{
            display: "flex",
            height: "200px"
          }}>
            <LazyCodeEditor
              text={text}
              language={language}
              keywords={keywords}
              properties={properties}
              variables={variables}
              fontSize={14}
              fontFamily={'monospace'}
            />
          </div>
        </Modal> */}
        {/* <div ref={container} /> */}
      </Suspense>
    );
  },
);

CodeNodeContentEditor.displayName = 'CodeNodeContentEditor';

export const codeDescriptor: UIContextDescriptor<'code'> = {
  Body: CodeNodeContentBody,
  Editor: CodeNodeContentEditor
};
