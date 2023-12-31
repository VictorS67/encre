import { useMemo } from 'react';

import { Abc, Cabin } from '@mui/icons-material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded';

import { ContextMenuConfigContexts } from '../types/contextmenu.type';

export function useContextMenuConfigContexts(): ContextMenuConfigContexts {
  const contexts: ContextMenuConfigContexts = useMemo(
    () => ({
      blankSpace: [
        {
          metadata: {
            label: 'default',
          },
          items: [
            {
              id: 'item-1',
              name: 'Very long command here',
              description:
                'this is a very long command which can be overflowed',
              icon: {
                icon: Abc,
                fontSize: '24px',
                width: '24px',
                height: '24px',
              },
              contexts: [
                {
                  metadata: {
                    label: 'long',
                    showLabel: true,
                  },
                  items: [
                    {
                      id: 'add',
                      name: 'Add',
                      description: 'add a new node',
                      icon: {
                        icon: AddRoundedIcon,
                        fontSize: '24px',
                        width: '24px',
                        height: '24px',
                      },
                    },
                    {
                      id: 'paste',
                      name: 'Paste',
                      icon: {
                        icon: ContentPasteRoundedIcon,
                        fontSize: '18px',
                        width: '24px',
                        height: '24px',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'item-2',
              name: 'Short command',
              icon: {
                icon: ContentPasteRoundedIcon,
                fontSize: '18px',
                width: '24px',
                height: '24px',
              },
              contexts: [
                {
                  metadata: {
                    label: 'short',
                    showLabel: true,
                  },
                  items: [
                    {
                      id: 'fake-add',
                      name: 'Add',
                      description: 'add a new node',
                      icon: {
                        icon: AddRoundedIcon,
                        fontSize: '24px',
                        width: '24px',
                        height: '24px',
                      },
                    },
                    {
                      id: 'fake-paste',
                      name: 'Paste',
                      icon: {
                        icon: ContentPasteRoundedIcon,
                        fontSize: '18px',
                        width: '24px',
                        height: '24px',
                      },
                    },
                  ],
                },
              ],
            },
            {
              id: 'item-3',
              name: 'A command',
              icon: {
                icon: Cabin,
                fontSize: '18px',
                width: '24px',
                height: '24px',
              },
            },
          ],
        },
        {
          metadata: {
            label: 'plugin',
            showLabel: true,
          },
          items: [
            {
              id: 'item-3',
              name: 'A command',
              icon: {
                icon: Cabin,
                fontSize: '18px',
                width: '24px',
                height: '24px',
              },
            },
          ],
        },
      ],
    }),
    [],
  );

  return contexts;
}
