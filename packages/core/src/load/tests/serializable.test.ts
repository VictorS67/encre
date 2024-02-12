import { beforeAll, describe, expect, test } from '@jest/globals';
import { OptionalImportMap, SecretMap } from '../importType.js';
import { load } from '../index.js';
import {
  SecretFields,
  SerializedFields,
  SerializedKeyAlias,
} from '../keymap.js';
import { Serializable } from '../serializable.js';

describe('information stored in serializable', () => {
  class NoAttr extends Serializable {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'NoAttr';
    }
  }

  interface SecretAttrParams {
    secret1: string | undefined;
    secret2: {
      sub1: string | undefined;
      sub2: string | undefined;
    };
  }

  class SecretAttr extends Serializable implements SecretAttrParams {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'SecretAttr';
    }

    get _secrets(): SecretFields {
      return {
        secret1: 'SECRET_1',
        'secret2.sub1': 'SECRET_2_SUB_1',
        'secret2.sub2': 'SECRET_2_SUB_2',
      };
    }

    secret1: string | undefined;

    secret2: {
      sub1: string | undefined;
      sub2: string | undefined;
    };

    constructor(fields: SecretAttrParams) {
      super(fields);

      this.secret1 = fields.secret1;
      this.secret2 = fields.secret2;
    }
  }

  class ImplicitAttr extends Serializable {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'ImplicitAttr';
    }

    get _attributes(): SerializedFields {
      return {
        attr1: 1,
        attr2: '2',
        attr3: false,
        attr4: {
          sub1: 4,
          sub2: '5',
          sub3: true,
          sub4: undefined,
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      };
    }
  }

  interface ExplicitAttrParams {
    attr1: number;
    attr2: string;
    attr3: boolean;
    attr4: {
      sub1: number;
      sub2: string;
      sub3: boolean;
      sub4: undefined;
      sub5: null;
    };
    attr5: undefined;
    attr6: null;
  }

  class ExplicitAttr extends Serializable implements ExplicitAttrParams {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'ExplicitAttr';
    }

    attr1: number;

    attr2: string;

    attr3: boolean;

    attr4: {
      sub1: number;
      sub2: string;
      sub3: boolean;
      sub4: undefined;
      sub5: null;
    };

    attr5: undefined;

    attr6: null;

    constructor(fields: Partial<ExplicitAttrParams>) {
      super(fields);

      this.attr1 = fields.attr1 ?? 1;
      this.attr2 = fields.attr2 ?? '2';
      this.attr3 = fields.attr3 ?? false;
      this.attr4 = fields.attr4 ?? {
        sub1: 4,
        sub2: '5',
        sub3: true,
        sub4: undefined,
        sub5: null,
      };
      this.attr5 = fields.attr5;
      this.attr6 = fields.attr6 ?? null;
    }
  }

  interface AttrWithAliasesParams {
    attr1: number;
    newAttr2: string;
    attr3: boolean;
    attr4: {
      sub1: number;
      sub2: string;
      sub3: boolean;
      sub4: undefined;
      sub5: null;
    };
    attr5: undefined;
    attr6: null;
  }

  class AttrWithAliases extends Serializable implements AttrWithAliasesParams {
    _isSerializable = true;

    _namespace: string[] = ['custom', 'tests'];

    static _name(): string {
      return 'AttrWithAliases';
    }

    attr1: number;

    newAttr2: string;

    attr3: boolean;

    attr4: {
      sub1: number;
      sub2: string;
      sub3: boolean;
      sub4: undefined;
      sub5: null;
    };

    attr5: undefined;

    attr6: null;

    get _aliases(): SerializedKeyAlias {
      return {
        attr1: 'newAttr1',
        sub1: 'newSub1',
      };
    }

    get _attributes(): SerializedFields {
      return {
        attr1: 1,
        newAttr2: '2',
        attr3: false,
        attr4: {
          sub1: 4,
          sub2: '5',
          sub3: true,
          sub4: undefined,
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      };
    }

    constructor(fields: Partial<ExplicitAttrParams>) {
      super(fields);

      this.attr1 = fields.attr1 ?? 1;
      this.newAttr2 = fields.attr2 ?? '2';
      this.attr3 = fields.attr3 ?? false;
      this.attr4 = fields.attr4 ?? {
        sub1: 4,
        sub2: '5',
        sub3: true,
        sub4: undefined,
        sub5: null,
      };
      this.attr5 = fields.attr5;
      this.attr6 = fields.attr6 ?? null;
    }
  }

  test('no attributes', async () => {
    const noAttr = new NoAttr();

    expect(noAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
    });

    const str: string = JSON.stringify(noAttr, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'NoAttr'],
          _kwargs: {},
        },
        null,
        2
      )
    );

    const anotherNoAttr: NoAttr = await load<NoAttr>(
      str,
      {} as SecretMap,
      { 'custom/tests': { NoAttr } } as OptionalImportMap
    );

    expect(anotherNoAttr).toBeInstanceOf(NoAttr);
    expect(JSON.stringify(anotherNoAttr, null, 2)).toBe(str);

    expect(anotherNoAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {},
    });
  });

  test('secrets should be removed in kwargs', async () => {
    const secretAttr = new SecretAttr({
      secret1: 'some secret 1',
      secret2: { sub1: 'some secret 1 sub 1', sub2: 'some secret 1 sub 2' },
    });

    expect(secretAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {
        secret1: 'SECRET_1',
        'secret2.sub1': 'SECRET_2_SUB_1',
        'secret2.sub2': 'SECRET_2_SUB_2',
      },
      kwargs: {},
    });

    const str: string = JSON.stringify(secretAttr, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'SecretAttr'],
          _kwargs: {
            secret1: {
              _grp: 1,
              _type: 'secret',
              _id: ['SECRET_1'],
            },
            secret2: {
              sub1: {
                _grp: 1,
                _type: 'secret',
                _id: ['SECRET_2_SUB_1'],
              },
              sub2: {
                _grp: 1,
                _type: 'secret',
                _id: ['SECRET_2_SUB_2'],
              },
            },
          },
        },
        null,
        2
      )
    );

    const anotherSecretAttr: SecretAttr = await load<SecretAttr>(
      str,
      {
        SECRET_1: 'other secret 1',
        SECRET_2_SUB_1: 'other secret 1 sub 1',
        SECRET_2_SUB_2: 'other secret 1 sub 2',
      } as SecretMap,
      { 'custom/tests': { SecretAttr } } as OptionalImportMap
    );

    expect(anotherSecretAttr).toBeInstanceOf(SecretAttr);
    expect(JSON.stringify(anotherSecretAttr, null, 2)).toBe(str);

    expect(anotherSecretAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {
        secret1: 'SECRET_1',
        'secret2.sub1': 'SECRET_2_SUB_1',
        'secret2.sub2': 'SECRET_2_SUB_2',
      },
      kwargs: {},
    });
  });

  test('show all attributes in kwargs', async () => {
    const implicitAttr = new ImplicitAttr();

    expect(implicitAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        attr1: 1,
        attr2: '2',
        attr3: false,
        attr4: {
          sub1: 4,
          sub2: '5',
          sub3: true,
          sub4: undefined,
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      },
    });

    const str: string = JSON.stringify(implicitAttr, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'ImplicitAttr'],
          _kwargs: {
            attr1: 1,
            attr2: '2',
            attr3: false,
            attr4: {
              sub1: 4,
              sub2: '5',
              sub3: true,
              sub4: undefined,
              sub5: null,
            },
            attr5: undefined,
            attr6: null,
          },
        },
        null,
        2
      )
    );

    const anotherImplicitAttr: ImplicitAttr = await load<ImplicitAttr>(
      str,
      {} as SecretMap,
      { 'custom/tests': { ImplicitAttr } } as OptionalImportMap
    );

    expect(anotherImplicitAttr).toBeInstanceOf(ImplicitAttr);
    expect(JSON.stringify(anotherImplicitAttr, null, 2)).toBe(str);

    expect(anotherImplicitAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        attr1: 1,
        attr2: '2',
        attr3: false,
        attr4: {
          sub1: 4,
          sub2: '5',
          sub3: true,
          // sub4: undefined, // This is not observed in the invoked Class
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      },
    });
  });

  test('only show assigned attributes in kwargs', async () => {
    const explicitAttr = new ExplicitAttr({
      attr1: 999,
    });

    expect(explicitAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        attr1: 999,
        // attr2: '2', // Any other attributes are not displayed because it is not defined in the `_attribute`
        // attr3: false,
        // attr4: {
        //   sub1: 4,
        //   sub2: '5',
        //   sub3: true,
        //   sub4: undefined,
        //   sub5: null,
        // },
        // attr5: undefined,
        // attr6: null,
      },
    });

    const str: string = JSON.stringify(explicitAttr, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'ExplicitAttr'],
          _kwargs: {
            attr1: 999,
          },
        },
        null,
        2
      )
    );

    const anotherExplicitAttr: ExplicitAttr = await load<ExplicitAttr>(
      str,
      {} as SecretMap,
      { 'custom/tests': { ExplicitAttr } } as OptionalImportMap
    );

    expect(anotherExplicitAttr).toBeInstanceOf(ExplicitAttr);
    expect(JSON.stringify(anotherExplicitAttr, null, 2)).toBe(str);

    expect(anotherExplicitAttr.getAttributes()).toStrictEqual({
      aliases: {},
      secrets: {},
      kwargs: {
        attr1: 999,
        // attr2: '2', // Any other attributes are not displayed because it is not defined in the `_attribute`
        // attr3: false,
        // attr4: {
        //   sub1: 4,
        //   sub2: '5',
        //   sub3: true,
        //   sub4: undefined,
        //   sub5: null,
        // },
        // attr5: undefined,
        // attr6: null,
      },
    });
  });

  test('replace attribute keys from aliases in kwargs', async () => {
    const attrWithAliases = new AttrWithAliases({
      attr1: 999,
      attr4: {
        sub1: 998,
        sub2: '5',
        sub3: true,
        sub4: undefined,
        sub5: null,
      },
    });

    expect(attrWithAliases.getAttributes()).toStrictEqual({
      aliases: {
        attr1: 'newAttr1',
        sub1: 'newSub1', // This is not used
      },
      secrets: {},
      kwargs: {
        attr1: 999,
        newAttr2: '2',
        attr3: false,
        attr4: { 
          sub1: 998, // The aliases only change keys in the root level
          sub2: '5',
          sub3: true,
          sub4: undefined,
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      },
    });

    const str: string = JSON.stringify(attrWithAliases, null, 2);

    expect(str).toBe(
      JSON.stringify(
        {
          _grp: 1,
          _type: 'constructor',
          _id: ['custom', 'tests', 'AttrWithAliases'],
          _kwargs: {
            newAttr1: 999, // The serialization will not decamel the aliases
            attr4: {
              sub1: 998, // The aliases only change keys in the root level
              sub2: '5',
              sub3: true,
              sub4: undefined,
              sub5: null,
            },
            new_attr2: '2', // The serialization decamel the naming
            attr3: false,
            attr5: undefined,
            attr6: null,
          },
        },
        null,
        2
      )
    );

    const anotherAttrWithAliases: AttrWithAliases = await load<AttrWithAliases>(
      str,
      {} as SecretMap,
      { 'custom/tests': { AttrWithAliases } } as OptionalImportMap
    );

    expect(anotherAttrWithAliases).toBeInstanceOf(AttrWithAliases);
    expect(JSON.stringify(anotherAttrWithAliases, null, 2)).toBe(str);

    expect(anotherAttrWithAliases.getAttributes()).toStrictEqual({
      aliases: {
        attr1: 'newAttr1',
        sub1: 'newSub1', // This is not used
      },
      secrets: {},
      kwargs: {
        attr1: 999,
        newAttr2: '2',
        attr3: false,
        attr4: {
          sub1: 998, // The aliases only change keys in the root level
          sub2: '5',
          sub3: true,
          // sub4: undefined, // This is not observed in the invoked Class
          sub5: null,
        },
        attr5: undefined,
        attr6: null,
      },
    });
  });
});
