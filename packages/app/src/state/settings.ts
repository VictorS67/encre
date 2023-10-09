import { atom } from 'recoil';

import { persistAtom } from './persist';

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

export const themeState = atom<Theme>({
  key: 'theme',
  default: Theme.LIGHT,
  effects_UNSTABLE: [persistAtom],
});
