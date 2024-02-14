/**
 * Creates a tuple ensuring at least one instance of each specified string literal type.
 *
 * `exhaustiveTuple` is a higher-order function for compile-time validation of tuples to contain at least
 * one of each specified string literal in type `T`. Useful in cases requiring a complete set of specified literals.
 *
 * @see https://stackoverflow.com/questions/55265679/enforce-that-an-array-is-exhaustive-over-a-union-type/55266531#55266531
 *
 * @example
 * ```
 * type Fruit = "apple" | "banana" | "cherry";
 *
 * const missingFruit = exhaustiveTuple<Fruit>()("apple", "banana");
 * // error, argument of type '"apple"' is not assignable to parameter of type '"cherry"'
 *
 * const extraFruit = exhaustiveTuple<Fruit>()("apple", "banana", "cherry", "orange");
 * // error, "orange" is not assignable to a parameter of type 'Fruit'
 *
 * const fruitTuple = exhaustiveTuple<Fruit>()("apple", "banana", "cherry");
 * // fruitTuple is now ensured to contain each literal in `Fruit` at least once.
 * ```
 */
export const exhaustiveTuple =
  <T extends string>() =>
  <L extends AtLeastOne<T>>(
    ...x: [T] extends any
      ? Exclude<T, L[number]> extends never
        ? L
        : Exclude<T, L[number]>[]
      : never
  ) =>
    x;

type AtLeastOne<T> = [T, ...T[]];