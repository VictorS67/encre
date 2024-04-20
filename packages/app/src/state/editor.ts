import { atom } from 'recoil';

export const editingCodeIdState = atom<string | undefined>({
  key: 'editingCodeIdState',
  default: undefined,
});
