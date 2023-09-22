// A customized Function type
type Func = (...args: any[]) => void;

// A customized Class type
type Class<T = object> = new (...args: any[]) => T;

// Add a _ prefix to all attributes (no function) in T
type Public<T> = {
  [K in keyof T as T[K] extends Func
    ? K // Do not change name for any Function
    : K extends `_${unknown & string}`
    ? K // Do not add prefix if the prefix is already in the name
    : `_${K & string}` extends keyof T
    ? K // Do not add prefix if the name with prefix exists
    : `_${K & string}`]: T[K];
};

type PartialPick<T, K extends keyof T> = Partial<Pick<T, K>>;

export { Public, Func, Class, PartialPick };
