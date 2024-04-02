import { atom } from 'recoil';

export const showContextMenuState = atom<boolean>({
  key: 'showContextMenuState',
  default: false,
});
