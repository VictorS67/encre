import { atom } from 'recoil';
// import { recoilPersist } from 'recoil-persist';

// const { persistAtom } = recoilPersist({ key: 'userInput' });

export const userInputGuesserModalState = atom({
  key: 'userInputGuesserModalState',
  default: '',
});
