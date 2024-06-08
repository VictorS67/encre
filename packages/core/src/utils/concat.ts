export function concat<
  T extends any
>(first: T, second: T): T {
  if (Array.isArray(first) && Array.isArray(second)) {
    return first.concat(second) as T;
  } else if (typeof first === "string" && typeof second === "string") {
    return (first + second) as T;
  } else if (typeof first === "number" && typeof second === "number") {
    return (first + second) as T;
  } else if (
    "concat" in (first as any) &&
    typeof (first as any).concat === "function"
  ) {
    return (first as any).concat(second) as T;
  } else if (typeof first === "object" && typeof second === "object") {
    const chunk = { ...first } as Record<string, any>;
    for (const [key, value] of Object.entries(second as Record<string, any>)) {
      if (key in chunk && !Array.isArray(chunk[key])) {
        chunk[key] = concat(chunk[key], value);
      } else {
        chunk[key] = value;
      }
    }
    return chunk as T;
  } else {
    throw new Error(`Cannot concat ${typeof first} and ${typeof second}`);
  }
}
