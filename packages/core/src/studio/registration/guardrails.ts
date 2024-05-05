import { GuardrailImpl } from '../guardrails/base.js';
import { ArrayGuardrailImpl } from '../guardrails/data/array.guard.js';
import { BooleanGuardrailImpl } from '../guardrails/data/boolean.guard.js';
import { NumberGuardrailImpl } from '../guardrails/data/number.guard.js';
import { JSONObjectGuardrailImpl } from '../guardrails/data/object.guard.js';
import { StringGuardrailImpl } from '../guardrails/data/string.guard.js';
import { Guardrail } from '../guardrails/index.js';

type ExtractType<T> = T extends `${infer U}-${any}` ? U : never;

type ExtractName<T> = T extends `${any}-${infer U}` ? U : never;

export interface GuardrailImplConstructor<T extends Guardrail> {
  new (guardrail: T): GuardrailImpl<T>;
  create(method: string): T;
}

export class GuardrailRegistration<
  GuardrailTypes extends string = never,
  GuardrailNames extends string = never,
  Guardrails extends Guardrail = never,
> {
  registeredGuardrails: Guardrails = undefined!;

  registeredGuardrailTypes: GuardrailTypes = undefined!;

  registeredGuardrailTypePairs: { [P in GuardrailTypes]: GuardrailNames[] } =
    undefined!;

  info = {} as {
    [P in `${GuardrailTypes}-${GuardrailNames}`]: {
      impl: GuardrailImplConstructor<
        Extract<Guardrails, { type: ExtractType<P>; name: ExtractName<P> }>
      >;
    };
  };

  implsMap = {} as Record<
    string,
    { impl: GuardrailImplConstructor<Guardrail>; init: Guardrails }
  >;

  readonly guardrailTypes = new Set<GuardrailTypes>();

  readonly guardrailTypePairs = {} as {
    [P in GuardrailTypes]: GuardrailNames[];
  };

  get guardrailConstructors(): GuardrailImplConstructor<Guardrail>[] {
    return Object.values(this.implsMap).map(
      (guardrailImpl) => guardrailImpl.impl
    );
  }

  get dynamicImplsMap(): Record<
    string,
    { impl: GuardrailImplConstructor<Guardrail> }
  > {
    return this.implsMap;
  }

  register<T extends Guardrail>(
    impl: GuardrailImplConstructor<T>,
    method: string
  ): GuardrailRegistration<
    GuardrailTypes | T['type'],
    GuardrailNames | T['name'],
    Guardrails | T
  > {
    const newRegistration = this as GuardrailRegistration<
      GuardrailTypes | T['type'],
      GuardrailNames | T['name'],
      Guardrails | T
    >;

    const guardrail = impl.create(method);
    const type = guardrail.type as T['type'];
    const name = guardrail.name as T['name'];

    const key = [type, name].join('-');

    if (newRegistration.info[key]) {
      throw new Error(`Duplicate guardrail type pair: ${key}`);
    }

    newRegistration.info[key] = {
      impl: impl as any,
    };

    newRegistration.implsMap[key] = {
      impl: impl as any,
      init: guardrail,
    };

    newRegistration.guardrailTypes.add(type);

    if (newRegistration.guardrailTypePairs[type]) {
      newRegistration.guardrailTypePairs[type].push(name);
    } else {
      newRegistration.guardrailTypePairs[type] = [name];
    }

    return newRegistration;
  }

  create<T extends GuardrailTypes, U extends GuardrailNames>(
    type: T,
    name: U,
    method: string
  ): Extract<Guardrails, { type: T; name: U }> {
    const key = [type, name].join('-');

    const guardrailImpl = this.info[key] as {
      impl: GuardrailImplConstructor<Extract<Guardrails, { type: T; name: U }>>;
    };

    if (!guardrailImpl) {
      throw new Error(`Unknown guardrail type pair: ${type}-${name}`);
    }

    return guardrailImpl.impl.create(method);
  }

  createImpl<T extends Guardrails>(guardrail: T): GuardrailImpl<T> {
    const key = [guardrail.type, guardrail.name].join('-');

    const guardrailImpl = this.info[key] as {
      impl: GuardrailImplConstructor<
        Extract<Guardrails, { type: T['type']; name: T['name'] }>
      >;
    };

    if (!guardrailImpl) {
      throw new Error(`Unknown guardrail type pair: ${key}`);
    }

    const { impl: Impl } = guardrailImpl;

    const newGuardrailImpl = new Impl(
      guardrail as any
    ) as unknown as GuardrailImpl<T>;

    if (!newGuardrailImpl) {
      throw new Error(`Unknown guardrail type pair: ${key}`);
    }

    return newGuardrailImpl;
  }

  createDynamic(type: string, name: string, method: string): Guardrail {
    const implClass = this.dynamicImplsMap[`${type}-${name}`];
    if (!implClass) {
      throw new Error(
        `createDynamic: Unknown guardrail - type: ${type}, name: ${name}`
      );
    }

    return implClass.impl.create(method);
  }

  createDynamicImpl(guardrail: Guardrail): GuardrailImpl<Guardrail> {
    const { type, name } = guardrail;
    const implClass = this.dynamicImplsMap[`${type}-${name}`];
    if (!implClass) {
      throw new Error(
        `createDynamicImpl: Unknown guardrail - type: ${type}, name: ${name}`
      );
    }

    const newGuardrailImpl = new implClass.impl(guardrail);
    if (!newGuardrailImpl) {
      throw new Error(
        `createDynamicImpl: Unknown guardrail - type: ${type}, name: ${name}`
      );
    }

    return newGuardrailImpl;
  }

  isRegistered(type: string, name: string): boolean {
    const key = [type, name].join('-');

    return this.info[key] !== undefined;
  }
}

export function registerBuiltInGuardrails(registry: GuardrailRegistration) {
  return registry
    .register(StringGuardrailImpl, 'exists')
    .register(StringGuardrailImpl, 'doesNotExist')
    .register(StringGuardrailImpl, 'isEqual')
    .register(StringGuardrailImpl, 'isNotEqual')
    .register(StringGuardrailImpl, 'contains')
    .register(StringGuardrailImpl, 'doesNotContain')
    .register(StringGuardrailImpl, 'startsWith')
    .register(StringGuardrailImpl, 'doesNotStartWith')
    .register(StringGuardrailImpl, 'endsWith')
    .register(StringGuardrailImpl, 'doesNotEndWith')
    .register(StringGuardrailImpl, 'matchesRegex')
    .register(StringGuardrailImpl, 'doesNotMatchRegex')
    .register(StringGuardrailImpl, 'lengthEqual')
    .register(StringGuardrailImpl, 'lengthNotEqual')
    .register(StringGuardrailImpl, 'lengthGreaterThan')
    .register(StringGuardrailImpl, 'lengthLessThan')
    .register(StringGuardrailImpl, 'lengthGreaterThanOrEqual')
    .register(StringGuardrailImpl, 'lengthLessThanOrEqual')
    .register(BooleanGuardrailImpl, 'exists')
    .register(BooleanGuardrailImpl, 'doesNotExist')
    .register(BooleanGuardrailImpl, 'isEqual')
    .register(BooleanGuardrailImpl, 'isNotEqual')
    .register(BooleanGuardrailImpl, 'isTrue')
    .register(BooleanGuardrailImpl, 'isFalse')
    .register(NumberGuardrailImpl, 'exists')
    .register(NumberGuardrailImpl, 'doesNotExist')
    .register(NumberGuardrailImpl, 'isEqual')
    .register(NumberGuardrailImpl, 'isNotEqual')
    .register(NumberGuardrailImpl, 'isGreaterThan')
    .register(NumberGuardrailImpl, 'isLessThan')
    .register(NumberGuardrailImpl, 'isGreaterThanOrEqual')
    .register(NumberGuardrailImpl, 'isLessThanOrEqual')
    .register(JSONObjectGuardrailImpl, 'exists')
    .register(JSONObjectGuardrailImpl, 'doesNotExist')
    .register(JSONObjectGuardrailImpl, 'isEmpty')
    .register(JSONObjectGuardrailImpl, 'isNotEmpty')
    .register(JSONObjectGuardrailImpl, 'isStrictlyEqual')
    .register(JSONObjectGuardrailImpl, 'isNotStrictlyEqual')
    .register(ArrayGuardrailImpl, 'exists')
    .register(ArrayGuardrailImpl, 'doesNotExist')
    .register(ArrayGuardrailImpl, 'isStrictlyEqual')
    .register(ArrayGuardrailImpl, 'isNotStrictlyEqual')
    .register(ArrayGuardrailImpl, 'contains')
    .register(ArrayGuardrailImpl, 'doesNotContain')
    .register(ArrayGuardrailImpl, 'lengthEqual')
    .register(ArrayGuardrailImpl, 'lengthNotEqual')
    .register(ArrayGuardrailImpl, 'lengthGreaterThan')
    .register(ArrayGuardrailImpl, 'lengthLessThan')
    .register(ArrayGuardrailImpl, 'lengthGreaterThanOrEqual')
    .register(ArrayGuardrailImpl, 'lengthLessThanOrEqual');
}

let globalGuardrailRegistry = registerBuiltInGuardrails(
  new GuardrailRegistration()
);

export { globalGuardrailRegistry };

export type BuiltInGuardrails =
  typeof globalGuardrailRegistry.registeredGuardrails;

export type BuiltInGuardrailTypes =
  typeof globalGuardrailRegistry.registeredGuardrailTypes;

export type BuiltInGuardrailTypePairs =
  typeof globalGuardrailRegistry.registeredGuardrailTypePairs;

export type GuardrailOf<T extends BuiltInGuardrailTypes> = Extract<
  BuiltInGuardrails,
  { type: T }
>;

export function resetGuardrailRegistry() {
  globalGuardrailRegistry = registerBuiltInGuardrails(
    new GuardrailRegistration()
  );
}
