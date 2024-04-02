import { atom } from 'recoil';

import { ClipboardItem } from '../types/clipboard.type';

export const clipboardState = atom<ClipboardItem | undefined>({
  key: 'clipboardState',
  default: undefined,
});
