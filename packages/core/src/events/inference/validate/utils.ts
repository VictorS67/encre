/**
 * Replaces occurrences of a specified variable placeholder within a string description with a new variable name.
 * This function is useful for dynamically updating templates or text that include variable placeholders.
 *
 * ### Example
 * ```typescript
 * const description = "The value of {{oldName}} will be updated.";
 * const updatedDescription = swapVariableNameInDescription(description, "oldName", "newName");
 * 
 * console.log(updatedDescription); 
 * // Outputs: "The value of {{newName}} will be updated."
 * ```
 * 
 * @param description The string containing the variable placeholders to be swapped.
 * @param oldVarName The current variable name (placeholder) to be replaced.
 * @param newVarName The new variable name to replace the old variable name.
 * @returns A new string with the old variable names replaced by the new variable names.
 */
export function swapVariableNameInDescription(
  description: string,
  oldVarName: string,
  newVarName: string
): string {
  const regex = new RegExp(`{{${oldVarName}}}`, 'g');
  const newDescription: string = description.replace(
    regex,
    `{{${newVarName}}}`
  );

  return newDescription;
}

/**
 * Conditionally wraps a description in parentheses based on the logical operators present
 * and the intended conjunction for the description. This function is typically used to ensure
 * logical grouping in expressions when modifying or combining conditions.
 * 
 * ### Example
 * ```typescript
 * const description = "condition1 OR condition2";
 * const wrapped = wrapDescription(description, 'and');
 * 
 * console.log(wrapped); 
 * // Outputs: "(condition1 OR condition2)"
 * ```
 *
 * @param description The description text that might need to be wrapped.
 * @param conjunction The logical conjunction ('or' | 'and') that determines how the description should be wrapped.
 * @returns The description, possibly wrapped in parentheses to ensure correct logical grouping.
 */
export function wrapDescription(
  description: string,
  conjunction: 'or' | 'and'
): string {
  const needsParentheses = (
    description: string,
    conjunction: 'or' | 'and'
  ): boolean => {
    if (conjunction === 'and') {
      // Add parentheses if the description contains "or" to maintain logical grouping
      return / OR /.test(description);
    } else {
      // Add parentheses if the description contains "and" for an "or" outer conjunction
      return / AND /.test(description);
    }
  };

  return needsParentheses(description, conjunction)
    ? `(${description})`
    : description;
}

/**
 * Creates a new variables record by appending a suffix to each key in the original variables record.
 * This function is useful for namespace management or when duplicating variable sets with modified keys.
 * 
 * ### Example
 * ```typescript
 * const oldVariables = { key1: "value1", key2: "value2" };
 * const newVariables = swapKeysInVariables(oldVariables, "_new");
 * 
 * console.log(newVariables);
 * // Outputs: { key1_new: "value1", key2_new: "value2" }
 * ```
 * 
 * @param oldVariables The original record of variables whose keys need to be modified.
 * @param suffix The suffix to append to each key in the original record.
 * @returns A new record with the keys modified by appending the specified suffix.
 */
export function swapKeysInVariables(
  oldVariables: Record<string, unknown>,
  suffix: string
): Record<string, unknown> {
  const newVariables: Record<string, unknown> = {};
  Object.keys(oldVariables).forEach((key) => {
    const newKey = `${key}${suffix}`;
    newVariables[newKey] = oldVariables[key];
  });

  return newVariables;
}
