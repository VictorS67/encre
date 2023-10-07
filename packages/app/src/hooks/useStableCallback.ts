import { useCallback, useLayoutEffect, useRef } from 'react';

/**
 * `useStableCallback` Hook
 *
 * Maintains a stable reference to a `useCallback` function across component re-renders
 * ensuring the most recent version of the callback is used without causing
 * additional re-renders.
 *
 * @template T The argument types that the callback function accepts, in an array.
 * @template R The return type of the callback function.
 *
 * @param {(...args: T) => R} callback - The callback function whose reference needs
 * to be stabilized across re-renders.
 *
 * @returns {(...args: T) => R} - A stable callback function that always refers to
 * the most recent version of the `callback` parameter.
 *
 * @example
 * ```jsx
 * const [count, setCount] = useState(0);
 * const fetchData = useStableCallback(async () => {
 *   // Fetch some data
 *   const data = await myApi.fetchData();
 *   // Use the latest 'count' here
 *   console.log(count, data);
 * });
 *
 * // Example usage: Fetch data on a button click
 * const handleButtonClick = () => {
 *   fetchData(); // Always uses the latest count in its logic
 *   setCount(count + 1); // Update count
 * };
 * ```
 *
 * While the callback reference is stable, be careful that closed-over variables may
 * not be as up-to-date as expected due to the disconnection between the stale closure
 * and updated `ref`.
 */
export function useStableCallback<T extends Array<unknown>, R>(
  callback: (...args: T) => R,
): (...args: T) => R {
  // DO NOT use these values to render content because new references are required for
  // React to render at the correct times.
  const ref = useRef(callback);

  // Frequent changes to the callback and subsequent updates to the `ref` within
  // `useLayoutEffect` can introduce overhead and potentially degrade performance,
  // especially in components that re-render often.
  useLayoutEffect(() => {
    ref.current = callback;
  });

  const stableCallback = useCallback((...args: T) => {
    // The use of `useLayoutEffect` to update the callback might create synchronization
    // issues if the callback depends on the render phase side-effects. You may encounter
    // unexpected behaviors in certain scenarios.
    return ref.current(...args);
  }, []);

  return stableCallback;
}
