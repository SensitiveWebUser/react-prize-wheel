# Deploying to npm

This guide is a reference for publishing updates to the [react-prize-wheel](https://www.npmjs.com/package/react-prize-wheel) package on npm.

## Prerequisites

- You must have an npm account ([Sign up](https://www.npmjs.com/signup) if needed)
- Node.js and pnpm installed ([pnpm install guide](https://pnpm.io/installation))
- You are logged in to npm:

```bash
npm login
```

## Build the Package

Navigate to the package directory and build:

```bash
cd packages/react-prize-wheel
pnpm build
```

## Update Version

Update the version in `package.json` as needed:

```bash
pnpm version patch # or minor/major
```

## Publish to npm

Run the following command in the package directory:

```bash
pnpm publish --access public
```

> **Note:** For scoped packages (e.g., `@your-scope/react-prize-wheel`), always use `--access public`.

## Reference Links

- [react-prize-wheel on npm](https://www.npmjs.com/package/react-prize-wheel)
- [npm Publishing Docs](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [pnpm Publish Docs](https://pnpm.io/cli/publish)

---

For troubleshooting:

- Ensure your build output is included in the `files` field of `package.json` or not listed in `.npmignore`
- If you get permission errors, check your npm account and package ownership
