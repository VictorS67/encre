import { useMemo } from 'react';

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';

import { ContextMenuConfigContexts } from '../state/contextMenu';

export function useContextMenuConfigContexts(): ContextMenuConfigContexts {
  const contexts: ContextMenuConfigContexts = useMemo(
    () => ({
      blankSpace: {
        items: [
          {
            id: 'add',
            name: 'Add',
            icon: AddRoundedIcon,
          },
          {
            id: 'paste',
            name: 'Paste',
            icon: ContentPasteRoundedIcon,
          },
        ],
      },
    }),
    [],
  );

  return contexts;
}
