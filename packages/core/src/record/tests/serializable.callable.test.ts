import { beforeAll, describe, expect, test } from '@jest/globals';
import { OptionalImportMap, SecretMap } from '../../load/importType.js';
import { load } from '../../load/index.js';
import { SecretFields, SerializedFields } from '../../load/keymap.js';
import {
  Callable,
  CallableBind,
  CallableConfig,
  CallableEach,
  CallableLambda,
  CallableMap,
  CallableSequence,
  CallableWithFallbacks,
} from '../callable.js';

describe('information stored in serializable', () => {
  interface SimpleCallableParams {
    attr1: number;
    attr2: string;
    secret1: string | undefined;
  }

  type SimpleCallableInput = string | number;

  interface SimpleCallableOutput {
    output1: string;
    output2: boolean;
  }

  interface CallInput {
    input1?: string;
  }

  interface SimpleCallableOptions extends CallableConfig {
    option1: string;
  }

  class SimpleCallable<
      CallOptions extends SimpleCallableOptions = SimpleCallableOptions,
    >
    extends Callable<SimpleCallableInput, SimpleCallableOutput, CallOptions>
    implements SimpleCallableParams
  {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'SimpleCallable';
    }

    get _attributes(): SerializedFields {
      return {
        attr2: '2',
      };
    }

    get _secrets(): SecretFields {
      return {
        secret1: 'TEST_SECRET_1',
      };
    }

    attr1: number;

    attr2: string;

    secret1: string | undefined;

    constructor(fields: Partial<SimpleCallableParams>) {
      super(fields);

      this.attr1 = fields.attr1 ?? 1;
      this.attr2 = fields.attr2 ?? (this._attributes.attr2 as string);
      this.secret1 = fields.secret1;
    }

    async invoke(
      input: string | number,
      options?: Partial<CallOptions> | undefined
    ): Promise<SimpleCallableOutput> {
      return {
        output1: 'output1',
        output2: true,
      };
    }
  }

  test('callable', async () => {
    const simpleCallable = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret',
    });

    expect(simpleCallable.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {
        secret1: 'TEST_SECRET_1',
      },
      kwargs: {
        attr1: 1,
        attr2: '2',
      },
      metadata: {
        type: 'Callable',
      },
    });

    const str: string = JSON.stringify(simpleCallable, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'SimpleCallable'],
          _kwargs: {
            attr1: 1,
            secret1: {
              _grp: 1,
              _type: 'secret',
              _id: ['TEST_SECRET_1'],
            },
            attr2: '2',
          },
        },
        null,
        2
      )
    );

    const anotherCallable: SimpleCallable = await load<SimpleCallable>(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      { 'custom/tests': { SimpleCallable } } as OptionalImportMap
    );

    expect(anotherCallable).toBeInstanceOf(SimpleCallable);
    expect(JSON.stringify(anotherCallable, null, 2)).toBe(str);

    expect(anotherCallable.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {
        secret1: 'TEST_SECRET_1',
      },
      kwargs: {
        attr1: 1,
        attr2: '2',
      },
      metadata: {
        type: 'Callable',
      },
    });
  });

  test('callableBind', async () => {
    const simpleCallable = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret',
    });

    const simpleCallableBind = simpleCallable.bind({
      option1: 'new option 1',
    });

    expect(simpleCallableBind.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        kwargs: {
          option1: 'new option 1',
        },
        config: {},
      },
      metadata: {
        type: 'CallableBind',
        callables: {
          bound: {
            aliases: {},
            secrets: {
              secret1: 'TEST_SECRET_1',
            },
            kwargs: {
              attr1: 1,
              attr2: '2',
            },
            metadata: {
              type: 'Callable',
            },
          },
        },
      },
    });

    const str: string = JSON.stringify(simpleCallableBind, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableBind'],
          _kwargs: {
            bound: {
              _grp: 1,
              _type: 'constructor',
              _id: ['custom', 'tests', 'SimpleCallable'],
              _kwargs: {
                attr1: 1,
                secret1: {
                  _grp: 1,
                  _type: 'secret',
                  _id: ['TEST_SECRET_1'],
                },
                attr2: '2',
              },
            },
            kwargs: {
              option1: 'new option 1',
            },
            config: {},
          },
        },
        null,
        2
      )
    );

    const anotherCallableBind = await load<
      CallableBind<
        SimpleCallableInput,
        SimpleCallableOutput,
        SimpleCallableOptions
      >
    >(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableBind },
      } as OptionalImportMap
    );

    expect(anotherCallableBind).toBeInstanceOf(CallableBind);
    expect(JSON.stringify(anotherCallableBind, null, 2)).toBe(str);

    expect(
      anotherCallableBind.getAttributes().metadata.callables?.bound
    ).toStrictEqual(simpleCallable.getAttributes());
  });

  test('callableLambda', async () => {
    const lambda = async (
      input: SimpleCallableInput,
      options?: Partial<SimpleCallableOptions> | undefined
    ): Promise<SimpleCallableOutput> => {
      return {
        output1: 'output1',
        output2: true,
      };
    };

    const simpleCallableLambda = CallableLambda.from(lambda);

    expect(simpleCallableLambda.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        func: lambda.toString(),
      },
      metadata: {
        type: 'CallableLambda',
      },
    });

    const str: string = JSON.stringify(simpleCallableLambda, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableLambda'],
          _kwargs: {
            func: lambda.toString(),
          },
        },
        null,
        2
      )
    );

    const anotherCallableLambda = await load<
      CallableLambda<SimpleCallableInput, SimpleCallableOutput>
    >(
      str,
      {} as SecretMap,
      {
        'record/callable': { CallableLambda },
      } as OptionalImportMap
    );

    expect(anotherCallableLambda).toBeInstanceOf(CallableLambda);
    expect(JSON.stringify(anotherCallableLambda, null, 2)).toBe(str);
  });

  test('callableMap', async () => {
    const simpleCallable1 = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret 1',
    });

    const simpleCallable2 = new SimpleCallable({
      attr1: 2,
      secret1: 'this is a secret 2',
    });

    const simpleCallable3 = new SimpleCallable({
      attr1: 3,
      secret1: 'this is a secret 3',
    });

    const simpleCallableMap = CallableMap.from({
      first: simpleCallable1,
      second: simpleCallable2,
      third: simpleCallable3,
    });

    expect(simpleCallableMap.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
      metadata: {
        type: 'CallableMap',
        callables: {
          steps: {
            first: {
              aliases: {},
              secrets: {
                secret1: 'TEST_SECRET_1',
              },
              kwargs: {
                attr1: 1,
                attr2: '2',
              },
              metadata: {
                type: 'Callable',
              },
            },
            second: {
              aliases: {},
              secrets: {
                secret1: 'TEST_SECRET_1',
              },
              kwargs: {
                attr1: 2,
                attr2: '2',
              },
              metadata: {
                type: 'Callable',
              },
            },
            third: {
              aliases: {},
              secrets: {
                secret1: 'TEST_SECRET_1',
              },
              kwargs: {
                attr1: 3,
                attr2: '2',
              },
              metadata: {
                type: 'Callable',
              },
            },
          },
        },
      },
    });

    const str: string = JSON.stringify(simpleCallableMap, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableMap'],
          _kwargs: {
            steps: {
              first: {
                _grp: 1,
                _type: 'constructor',
                _id: ['custom', 'tests', 'SimpleCallable'],
                _kwargs: {
                  attr1: 1,
                  secret1: {
                    _grp: 1,
                    _type: 'secret',
                    _id: ['TEST_SECRET_1'],
                  },
                  attr2: '2',
                },
              },
              second: {
                _grp: 1,
                _type: 'constructor',
                _id: ['custom', 'tests', 'SimpleCallable'],
                _kwargs: {
                  attr1: 2,
                  secret1: {
                    _grp: 1,
                    _type: 'secret',
                    _id: ['TEST_SECRET_1'],
                  },
                  attr2: '2',
                },
              },
              third: {
                _grp: 1,
                _type: 'constructor',
                _id: ['custom', 'tests', 'SimpleCallable'],
                _kwargs: {
                  attr1: 3,
                  secret1: {
                    _grp: 1,
                    _type: 'secret',
                    _id: ['TEST_SECRET_1'],
                  },
                  attr2: '2',
                },
              },
            },
          },
        },
        null,
        2
      )
    );

    const anotherCallableMap = await load<CallableMap<SimpleCallableInput>>(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableMap },
      } as OptionalImportMap
    );

    expect(anotherCallableMap).toBeInstanceOf(CallableMap);
    expect(JSON.stringify(anotherCallableMap, null, 2)).toBe(str);

    expect(
      typeof anotherCallableMap.getAttributes().metadata.callables?.steps ===
        'object' &&
        !Array.isArray(
          anotherCallableMap.getAttributes().metadata.callables?.steps
        )
    ).toBeTruthy();

    expect(
      anotherCallableMap.getAttributes().metadata.callables?.steps!['first']
    ).toStrictEqual(simpleCallable1.getAttributes());

    expect(
      anotherCallableMap.getAttributes().metadata.callables?.steps!['second']
    ).toStrictEqual(simpleCallable2.getAttributes());

    expect(
      anotherCallableMap.getAttributes().metadata.callables?.steps!['third']
    ).toStrictEqual(simpleCallable3.getAttributes());
  });

  test('callableEach', async () => {
    const simpleCallable = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret',
    });

    const simpleCallableEach = simpleCallable.map();

    expect(simpleCallableEach.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
      metadata: {
        type: 'CallableEach',
        callables: {
          bound: {
            aliases: {},
            secrets: {
              secret1: 'TEST_SECRET_1',
            },
            kwargs: {
              attr1: 1,
              attr2: '2',
            },
            metadata: {
              type: 'Callable',
            },
          },
        },
      },
    });

    const str: string = JSON.stringify(simpleCallableEach, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableEach'],
          _kwargs: {
            bound: {
              _grp: 1,
              _type: 'constructor',
              _id: ['custom', 'tests', 'SimpleCallable'],
              _kwargs: {
                attr1: 1,
                secret1: {
                  _grp: 1,
                  _type: 'secret',
                  _id: ['TEST_SECRET_1'],
                },
                attr2: '2',
              },
            },
          },
        },
        null,
        2
      )
    );

    const anotherCallableEach = await load<
      CallableEach<
        SimpleCallableInput,
        SimpleCallableOutput,
        SimpleCallableOptions
      >
    >(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableEach },
      } as OptionalImportMap
    );

    expect(anotherCallableEach).toBeInstanceOf(CallableEach);
    expect(JSON.stringify(anotherCallableEach, null, 2)).toBe(str);

    expect(
      anotherCallableEach.getAttributes().metadata.callables?.bound
    ).toStrictEqual(simpleCallable.getAttributes());
  });

  test('callableWithFallbacks', async () => {
    const simpleCallable1 = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret 1',
    });

    const fallbackCallable2 = new SimpleCallable({
      attr1: 2,
      secret1: 'this is a secret 2',
    });

    const fallbackCallable3 = new SimpleCallable({
      attr1: 3,
      secret1: 'this is a secret 3',
    });

    const simpleCallableWithFallbacks = simpleCallable1.withFallbacks({
      fallbacks: [fallbackCallable2, fallbackCallable3],
    });

    expect(simpleCallableWithFallbacks.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
      metadata: {
        type: 'CallableWithFallbacks',
        callables: {
          callable: {
            aliases: {},
            secrets: {
              secret1: 'TEST_SECRET_1',
            },
            kwargs: {
              attr1: 1,
              attr2: '2',
            },
            metadata: {
              type: 'Callable',
            },
          },
          fallbacks: [
            {
              aliases: {},
              secrets: {
                secret1: 'TEST_SECRET_1',
              },
              kwargs: {
                attr1: 2,
                attr2: '2',
              },
              metadata: {
                type: 'Callable',
              },
            },
            {
              aliases: {},
              secrets: {
                secret1: 'TEST_SECRET_1',
              },
              kwargs: {
                attr1: 3,
                attr2: '2',
              },
              metadata: {
                type: 'Callable',
              },
            },
          ],
        },
      },
    });

    const str: string = JSON.stringify(simpleCallableWithFallbacks, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableWithFallbacks'],
          _kwargs: {
            callable: {
              _grp: 1,
              _type: 'constructor',
              _id: ['custom', 'tests', 'SimpleCallable'],
              _kwargs: {
                attr1: 1,
                secret1: {
                  _grp: 1,
                  _type: 'secret',
                  _id: ['TEST_SECRET_1'],
                },
                attr2: '2',
              },
            },
            fallbacks: [
              {
                _grp: 1,
                _type: 'constructor',
                _id: ['custom', 'tests', 'SimpleCallable'],
                _kwargs: {
                  attr1: 2,
                  secret1: {
                    _grp: 1,
                    _type: 'secret',
                    _id: ['TEST_SECRET_1'],
                  },
                  attr2: '2',
                },
              },
              {
                _grp: 1,
                _type: 'constructor',
                _id: ['custom', 'tests', 'SimpleCallable'],
                _kwargs: {
                  attr1: 3,
                  secret1: {
                    _grp: 1,
                    _type: 'secret',
                    _id: ['TEST_SECRET_1'],
                  },
                  attr2: '2',
                },
              },
            ],
          },
        },
        null,
        2
      )
    );

    const anotherCallableWithFallbacks = await load<
      CallableWithFallbacks<SimpleCallableInput, SimpleCallableOutput>
    >(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableWithFallbacks },
      } as OptionalImportMap
    );

    expect(anotherCallableWithFallbacks).toBeInstanceOf(CallableWithFallbacks);
    expect(JSON.stringify(anotherCallableWithFallbacks, null, 2)).toBe(str);

    expect(
      Array.isArray(
        anotherCallableWithFallbacks.getAttributes().metadata.callables?.fallbacks
      )
    ).toBeTruthy();

    expect(
      anotherCallableWithFallbacks.getAttributes().metadata.callables?.callable
    ).toStrictEqual(simpleCallable1.getAttributes());

    expect(
      anotherCallableWithFallbacks.getAttributes().metadata.callables?.fallbacks![0]
    ).toStrictEqual(fallbackCallable2.getAttributes());

    expect(
      anotherCallableWithFallbacks.getAttributes().metadata.callables?.fallbacks![1]
    ).toStrictEqual(fallbackCallable3.getAttributes());
  });

  test('callableSequence', async () => {
    const simpleCallable1 = new SimpleCallable({
      attr1: 1,
      secret1: 'this is a secret 1',
    });

    const lambda = async (
      input: SimpleCallableOutput,
      options?: Partial<SimpleCallableOptions> | undefined
    ): Promise<SimpleCallableOutput> => {
      return {
        output1: 'output1',
        output2: true,
      };
    };

    const simpleCallable2 = CallableLambda.from(lambda);

    const simpleCallable3 = CallableLambda.from(lambda);

    const simpleCallableSequence = CallableSequence.from([
      simpleCallable1,
      simpleCallable2,
      simpleCallable3,
    ]);

    expect(simpleCallableSequence.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
      metadata: {
        type: 'CallableSequence',
        callables: {
          first: {
            aliases: {},
            secrets: {
              secret1: 'TEST_SECRET_1',
            },
            kwargs: {
              attr1: 1,
              attr2: '2',
            },
            metadata: {
              type: 'Callable',
            },
          },
          middle: [{
            aliases: {},
            secrets: {},
            kwargs: {
              func: lambda.toString(),
            },
            metadata: {
              type: 'CallableLambda',
            },
          }],
          last: {
            aliases: {},
            secrets: {},
            kwargs: {
              func: lambda.toString(),
            },
            metadata: {
              type: 'CallableLambda',
            },
          },
        },
      },
    });

    const str: string = JSON.stringify(simpleCallableSequence, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['record', 'callable', 'CallableSequence'],
          _kwargs: {
            first: {
              _grp: 1,
              _type: 'constructor',
              _id: ['custom', 'tests', 'SimpleCallable'],
              _kwargs: {
                attr1: 1,
                secret1: {
                  _grp: 1,
                  _type: 'secret',
                  _id: ['TEST_SECRET_1'],
                },
                attr2: '2',
              },
            },
            middle: [
              {
                _grp: 1,
                _type: 'constructor',
                _id: ['record', 'callable', 'CallableLambda'],
                _kwargs: {
                  func: lambda.toString(),
                },
              },
            ],
            last: {
              _grp: 1,
              _type: 'constructor',
              _id: ['record', 'callable', 'CallableLambda'],
              _kwargs: {
                func: lambda.toString(),
              },
            },
          },
        },
        null,
        2
      )
    );

    const anotherCallableSequence = await load<
      CallableSequence<SimpleCallableInput, SimpleCallableOutput>
    >(
      str,
      { TEST_SECRET_1: 'other secret 1' } as SecretMap,
      {
        'custom/tests': { SimpleCallable },
        'record/callable': { CallableLambda, CallableSequence },
      } as OptionalImportMap
    );

    expect(anotherCallableSequence).toBeInstanceOf(CallableSequence);
    expect(JSON.stringify(anotherCallableSequence, null, 2)).toBe(str);

    expect(
      Array.isArray(
        anotherCallableSequence.getAttributes().metadata.callables?.middle
      )
    ).toBeTruthy();

    expect(
      anotherCallableSequence.getAttributes().metadata.callables?.first
    ).toStrictEqual(simpleCallable1.getAttributes());

    expect(
      anotherCallableSequence.getAttributes().metadata.callables?.middle![0]
    ).toStrictEqual(simpleCallable2.getAttributes());

    expect(
      anotherCallableSequence.getAttributes().metadata.callables?.last
    ).toStrictEqual(simpleCallable3.getAttributes());
  });
});
