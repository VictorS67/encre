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
