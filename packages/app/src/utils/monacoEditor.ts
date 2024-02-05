import * as monaco from 'monaco-editor';

export { monaco };

monaco.languages.register({ id: 'encre-code' });

monaco.languages.setMonarchTokensProvider('encre-code', {
  tokenizer: {
    root: [
      [/[a-zA-Z][\w$]*/, {
        cases: {
          '@keywords': 'keyword',
          '@default': 'variable'
        }
      }],
      [/\{\{[^}]+\}\}/, 'replacement'],
      [/".*?"/, 'string'],
      [/\/\//, 'comment']
    ]
  }
});

const defineTheme = (theme: 'dark' | 'light', colors: {
  editor: {
    foreground: string,
    background: string
  },
  keyword: string,
  variable: string,
  replacement: string,
  string: string,
  comment: string
}) => {
  monaco.editor.defineTheme(`encre-code-${theme}`, {
    base: (theme === 'dark') ? "vs-dark" : "vs",
    inherit: true,
    rules: [
      {
        token: 'keyword',
        foreground: colors.keyword,
        fontStyle: 'bold'
      },
      {
        token: 'variable',
        foreground: colors.variable
      },
      {
      token: 'replacement', 
      foreground: colors.replacement
      },
      {
        token: 'string', 
        foreground: colors.string
      },
      {
        token: 'comment',
        foreground: colors.comment
      }
    ],
    colors: {
      'editor.foreground': colors.editor.foreground,
      'editor.background': colors.editor.background
    }
  })
}

defineTheme('light', {
  editor: {
    foreground: "#ffffff",
    background: "#f0f0f0",
  },
  keyword: "#005fb8",
  variable: "#e42e00",
  replacement: "#005fb8",
  string: "#212121",
  comment: "#49494a"
});

defineTheme('dark', {
  editor: {
    foreground: "#3d3d3d",
    background: "#212121",
  },
  keyword: "#146ba1",
  variable: "#e45c10",
  replacement: "#146ba1",
  string: "#c2c2c2",
  comment: "#474748"
});