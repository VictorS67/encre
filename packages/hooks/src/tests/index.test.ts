import * as hooks from '..';

describe('hooks', () => {
  test('exports modules should be defined', () => {
    Object.keys(hooks).forEach((module) => {
      expect(hooks[module]).toBeDefined();
    });
  });
});
