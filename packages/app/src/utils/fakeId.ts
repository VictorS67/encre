import { customAlphabet } from 'nanoid';

import { RecordId } from 'internal/src/types/encre';

// export function fakeId(length: number): string {
//   let result = '';
//   const characters =
//     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   const charactersLength: number = characters.length;
//   let counter = 0;
//   while (counter < length) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//     counter += 1;
//   }
//   return result;
// }

export function fakeId(length: number): string {
  const _alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz@';
  const nanoid = customAlphabet(_alphabet, 17);

  return nanoid() as RecordId;
}
