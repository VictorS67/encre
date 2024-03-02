import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({ key: 'theme' });

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
