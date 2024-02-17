# Contributing to Encre

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## We Develop with Github

We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Github Flow](https://guides.github.com/introduction/flow/index.html), So All Code Changes Happen Through Pull Requests

Pull requests are the best way to propose changes to the codebase (we use [Github Flow](https://guides.github.com/introduction/flow/index.html)). We actively welcome your pull requests:

1. Fork the repo and create your branch from `master`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/VictorS67/encre/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/VictorS67/encre/issues/new); it's that easy!

## Write bug reports with detail, background, and sample code

[This is an example](http://stackoverflow.com/q/12488905/180626) of a bug report I wrote, and I think it's not a bad model. Here's [another example from Craig Hockenberry](http://www.openradar.me/11905408), an app developer whom I greatly respect.

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can. This [example question](http://stackoverflow.com/q/12488905/180626) includes sample code that _anyone_ with a base R setup can run to reproduce what I was seeing
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People _love_ thorough bug reports. I'm not even kidding.

## Prerequisites

- Node.js >=20
- [yarn](https://yarnpkg.com/getting-started/install) - dependency management
- [eslint](https://eslint.org/) - enforcing standard lint rules
- [prettier](https://prettier.io/) - enforcing standard code formatting
- [jest](https://jestjs.io/) - testing code

## Quick Start

1. Clone the repository to your local machine, for example using SSH:

```bash
git clone git@github.com:VictorS67/encre.git
```

2. `cd` into your the cloned folder and run `yarn` in the root folder
3. Start the app in development mode by running `yarn dev`

## Build Packages

To build all packages, run `yarn build` in the root folder. This will compile the TypeScript for all packages, and build everything for a production release.

To build a specific package, run `yarn workspace xxx build` in the root folder. For example, to build the `@encre/core` package, run `yarn workspace @encre/core build`.

The following is the packages information:

```json
{
  "@encre/app": {
    "location": "packages/app",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "@encre/core": {
    "location": "packages/core",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  }
}
```

## Test

To run tests, run `yarn test` in the root folder. This will run all tests for all packages.

To run tests for a specific package, run `yarn workspace xxx test` in the root folder. For example, to test the `@encre/core` package, run `yarn workspace @encre/core test`.

The following is the packages that are able to test:

```json
{
  "@encre/core": {
    "location": "packages/core",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  }
}
```

## Lint & Format

We use [ESLint](https://eslint.org/) for linting and [Prettier](https://prettier.io/) for formatting. To run linting, run `yarn lint` in the root folder. This will run linting for all packages.

We also recommend enabling the `Format on Save` option in VS Code to automatically format files with Prettier on save. In addition, we use 2 spaces for indentation rather than tabs.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
