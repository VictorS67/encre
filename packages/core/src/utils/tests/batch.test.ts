import { expect, test } from '@jest/globals';
import { batch } from '../batch';

test('test batch function', () => {
  const arr: number[] = [1, 2, 3, 4, 5, 6];
  const size = 2;

  const expectArr: number[][] = [
    [1, 2],
    [3, 4],
    [5, 6],
  ];
  expect(batch(arr, size)).toStrictEqual(expectArr);

  const size2 = 4;
  const expectArr2: number[][] = [
    [1, 2, 3, 4],
    [5, 6]
  ];
  expect(batch(arr, size2)).toStrictEqual(expectArr2);
});
