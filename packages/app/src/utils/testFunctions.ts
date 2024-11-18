interface ParsedResult {
  key: string;
  value: string;
}

const MONACO_TEXT_REGEX = /([\w]+):[ ]+?([\w\/]+)/g;

export const parseMonacoTextValue = async (text: string) => {
  console.log(`parseMonacoTextValue: text: \n${text}`);

  const parsedResults: ParsedResult[] = [];

  let match: RegExpExecArray | null;
  while ((match = MONACO_TEXT_REGEX.exec(text)) !== null) {
    // match[0] is the full matched text
    // match[1], match[2], match[3] are the capturing groups
    const [_, key, value] = match;

    // Push the result into the array
    parsedResults.push({
      key,
      value,
    });
  }

  parsedResults.forEach((result, index) => {
    console.log(`Match ${index + 1}:\n\tKey: ${result.key}\n\tValue: ${result.value}`);
  });

  console.log('---');

  // lintCode(text)
}