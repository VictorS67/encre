import { useEffect } from 'react';

import { useSetRecoilState } from 'recoil';

import { editingCodeIdState } from '../state/editor';
import { editingNodeIdState } from '../state/node';

export function useEditorClick({ onDeselect }: { onDeselect?: () => void }) {
  const setEditingNodeId = useSetRecoilState(editingNodeIdState);
  const setEditingCodeId = useSetRecoilState(editingCodeIdState);

  useEffect(() => {
    const handleWindowClick = (event: Event) => {
      const target = (event as CustomEvent).target;
      const label = (target as HTMLElement).getAttribute('data-label');

      if (label !== 'editor') {
        setEditingNodeId(undefined);
        setEditingCodeId(undefined);
      }
    };

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);
}
