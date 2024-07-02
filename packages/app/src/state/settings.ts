import { atom, DefaultValue, selector, selectorFamily } from 'recoil';
import { recoilPersist } from 'recoil-persist';

import { send } from 'internal/src/fetch';

const { persistAtom } = recoilPersist({ key: 'settings' });

export interface Server {
  url: string;
  version?: string;
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
  AUTO = 'auto',
}

export const themeState = atom<Theme>({
  key: 'theme',
  default: Theme.DARK,
  effects_UNSTABLE: [persistAtom],
});

export const serverState = atom<Server>({
  key: 'server',
  default: { url: '' },
});

export const serverURLState = selector<string>({
  key: 'serverURLState',
  get: ({ get }) => {
    const url = get(serverState).url;
    return url;
  },
  set: ({ get, set }, newVal) => {
    if (newVal instanceof DefaultValue) return;
    const url: string = newVal;
    const server = get(serverState);
    const newServer = { ...server, url };
    set(serverState, newServer);
  },
});
