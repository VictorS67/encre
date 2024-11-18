import * as monaco from 'monaco-editor';

import { dataTypes } from 'internal/src/constants/encre';

export { monaco };

monaco.languages.register({ id: 'encre-code' });

export const defineTokens = (
  keywords: string[] = [],
  properties: string[] = [],
  variables: string[] = [],
) => {
  return monaco.languages.setMonarchTokensProvider('encre-code', {
    default: variables,
    properties: properties,
    keywords: keywords,
    typeKeywords: dataTypes,
    operators: [
      '<=',
      '>=',
      '==',
      '!=',
      '===',
      '!==',
      '=>',
      '+',
      '-',
      '**',
      '*',
      '/',
      '%',
      '++',
      '--',
      '<<',
      '</',
      '>>',
      '>>>',
      '&',
      '|',
      '^',
      '!',
      '~',
      '&&',
      '||',
      '?',
      ':',
      '=',
      '+=',
      '-=',
      '*=',
      '**=',
      '/=',
      '%=',
      '<<=',
      '>>=',
      '>>>=',
      '&=',
      '|=',
      '^=',
      '@',
    ],

    // we include these common regular expressions
    symbols: /[=><!~?:&|+\-*\/\^%]+/, // eslint-disable-line no-useless-escape
    escapes:
      /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
    digits: /\d+(_+\d+)*/,
    octaldigits: /[0-7]+(_+[0-7]+)*/,
    binarydigits: /[0-1]+(_+[0-1]+)*/,
    hexdigits: /[[0-9a-fA-F]+(_+[0-9a-fA-F]+)*/,

    regexpctl: /[(){}\[\]\$\^|\-*+?\.]/, // eslint-disable-line no-useless-escape
    regexpesc:
      /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/, // eslint-disable-line no-useless-escape
    tokenizer: {
      root: [{ include: 'common' }],
      common: [
        [
          /[a-zA-Z_$][\w$]*/,
          {
            cases: {
              '@typeKeywords': 'keyword',
              '@keywords': 'keyword',
              '@properties': 'property',
              '@default': 'variable',
            },
          },
        ],
        [/\{\{[^}]+\}\}/, 'replacement'],

        // numbers
        [/(@digits)[eE]([\-+]?(@digits))?/, 'number.float'], // eslint-disable-line no-useless-escape
        [/(@digits)\.(@digits)([eE][\-+]?(@digits))?/, 'number.float'], // eslint-disable-line no-useless-escape
        [/0[xX](@hexdigits)/, 'number.hex'],
        [/0[oO]?(@octaldigits)/, 'number.octal'],
        [/0[bB](@binarydigits)/, 'number.binary'],
        [/(@digits)/, 'number'],

        // strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/'([^'\\]|\\.)*$/, 'string.invalid'], // non-teminated string
        [/"/, 'string', '@string_double'],
        [/'/, 'string', '@string_single'],
        [/`/, 'string', '@string_backtick'],
      ],
      comment: [[/\/\//, 'comment']],
      // We match regular expression quite precisely
      regexp: [
        [
          /(\{)(\d+(?:,\d*)?)(\})/,
          [
            'regexp.escape.control',
            'regexp.escape.control',
            'regexp.escape.control',
          ],
        ],
        [
          /(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, // eslint-disable-line no-useless-escape
          [
            'regexp.escape.control',
            { token: 'regexp.escape.control', next: '@regexrange' },
          ],
        ],
        [
          /(\()(\?:|\?=|\?!)/,
          ['regexp.escape.control', 'regexp.escape.control'],
        ],
        [/[()]/, 'regexp.escape.control'],
        [/@regexpctl/, 'regexp.escape.control'],
        [/[^\\\/]/, 'regexp'], // eslint-disable-line no-useless-escape
        [/@regexpesc/, 'regexp.escape'],
        [/\\\./, 'regexp.invalid'],
        [
          /(\/)([gimsuy]*)/,
          [
            { token: 'regexp', bracket: '@close', next: '@pop' },
            'keyword.other',
          ],
        ],
      ],

      regexrange: [
        [/-/, 'regexp.escape.control'],
        [/\^/, 'regexp.invalid'],
        [/@regexpesc/, 'regexp.escape'],
        [/[^\]]/, 'regexp'],
        [
          /\]/,
          { token: 'regexp.escape.control', next: '@pop', bracket: '@close' },
        ],
      ],

      string_double: [
        [/[^\\"]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/"/, 'string', '@pop'],
      ],

      string_single: [
        [/[^\\']+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/'/, 'string', '@pop'],
      ],

      string_backtick: [
        [/[^\\`$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\\./, 'string.escape.invalid'],
        [/`/, 'string', '@pop'],
      ],

      bracketCounting: [{ include: 'common' }],
    },
  });
};

export const defineSuggestions = (
  keywords: string[] = [],
  properties: string[] = [],
  variables: string[] = [],
) => {
  console.log('MONACO: defineSuggestions')

  return monaco.languages.registerCompletionItemProvider('encre-code', {
    provideCompletionItems: (model, position) => {
      const wordBeforePosition = model.getWordUntilPosition({
        lineNumber: position.lineNumber,
        column: position.column - 1,
      });

      const wordUntilPosition = model.getWordUntilPosition(position);

      if (wordBeforePosition.word.trim() === '' ||  wordUntilPosition.word.trim() === '') {
        const suggestions = [
          ...keywords.map((k) => {
            return {
              label: k,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: k,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endColumn: wordUntilPosition.endColumn - 1,
              },
            };
          }),
          ...properties.map((k) => {
            return {
              label: k,
              kind: monaco.languages.CompletionItemKind.Property,
              insertText: k,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endColumn: wordUntilPosition.endColumn - 1,
              },
            };
          }),
          ...variables.map((k) => {
            return {
              label: k,
              kind: monaco.languages.CompletionItemKind.Variable,
              insertText: k,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endColumn: wordUntilPosition.endColumn - 1,
              },
            };
          }),
          ...commands.map((c) => {
            return {
              label: c.label,
              kind: c.kind,
              description: c.description,
              documentation: c.description,
              insertText: c.insertText,
              detail: c.description,
              insertTextRules: c.insertTextRules,
              range: {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: wordUntilPosition.startColumn,
                endColumn: wordUntilPosition.endColumn - 1,
              },
            }
          })
        ];
        return { suggestions };
      }
    },
    triggerCharacters: ["$"]
  });
};

// export const defineCommands = (keywords: string[] = []) => {
//   return monaco.languages.registerCompletionItemProvider('encre-code', {
//     provideCompletionItems: (model, position) => {
//       const wordBeforePosition = model.getWordUntilPosition({
//         lineNumber: position.lineNumber,
//         column: position.column - 1,
//       });

//       const wordUntilPosition = model.getWordUntilPosition(position);

//       if (wordBeforePosition.word.trim() === '' ||  wordUntilPosition.word.trim() === '') {
//         const suggestions = [
//           ...keywords.map((k) => {
//             return {
//               label: k,
//               kind: monaco.languages.CompletionItemKind.Keyword,
//               insertText: k,
//               range: {
//                 startLineNumber: position.lineNumber,
//                 endLineNumber: position.lineNumber,
//                 startColumn: wordUntilPosition.startColumn - 1,
//                 endColumn: wordUntilPosition.endColumn - 1,
//               },
//             };
//           }),
//           ...commands.map((c) => {
//             return {
//               label: c.label,
//               kind: c.kind,
//               description: c.description,
//               documentation: c.description,
//               insertText: c.insertText,
//               detail: c.description,
//               insertTextRules: c.insertTextRules,
//               range: {
//                 startLineNumber: position.lineNumber,
//                 endLineNumber: position.lineNumber,
//                 startColumn: wordUntilPosition.startColumn,
//                 endColumn: wordUntilPosition.endColumn - 1,
//               },
//             }
//           })
//         ];
//         return { suggestions };
//       }
//     },
//     triggerCharacters: ["/"]
//   });
// }

const commands = [
  {
    label: '$image',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'image',
    description: 'Image Content',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  }
];


const defineTheme = (
  theme: 'dark' | 'light',
  colors: {
    editor: {
      foreground: string;
      background: string;
    };
    keyword: string;
    variable: string;
    replacement: string;
    string: string;
    comment: string;
    property: string;
  },
) => {
  monaco.editor.defineTheme(`encre-code-${theme}`, {
    base: theme === 'dark' ? 'vs-dark' : 'vs',
    inherit: true,
    rules: [
      {
        token: 'keyword',
        foreground: colors.keyword,
        fontStyle: 'bold',
      },
      {
        token: 'variable',
        foreground: colors.variable,
        fontStyle: 'bold',
      },
      {
        token: 'replacement',
        foreground: colors.replacement,
      },
      {
        token: 'string',
        foreground: colors.string,
      },
      {
        token: 'comment',
        foreground: colors.comment,
      },
      {
        token: 'property',
        foreground: colors.property,
        fontStyle: 'bold',
      },
    ],
    colors: {
      'editor.foreground': colors.editor.foreground,
      'editor.background': colors.editor.background,
    },
  });
};

defineTheme('light', {
  editor: {
    foreground: '#212121',
    background: '#f0f0f0',
  },
  keyword: '#e42e00',
  variable: '#005fb8',
  replacement: '#005fb8',
  string: '#212121',
  comment: '#00A844',
  property: '#01b2b2',
});

defineTheme('dark', {
  editor: {
    foreground: '#c2c2c2',
    background: '#212121',
  },
  keyword: '#e45c10',
  variable: '#146ba1',
  replacement: '#146ba1',
  string: '#c2c2c2',
  comment: '#005800',
  property: '#00beb5',
});
