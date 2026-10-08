# plone.blicca.block

A blueprint for building Aurora blocks for Plone Blicca. Copy this project to
start a new add-on. The working example is **demo-block**: its stored `@type`,
editor registration, server renderer, and asset names all use that identifier.

The package includes a React editor and view, a Python server renderer, Plone
installation and uninstall profiles, scoped CSS, and tests for both renderers.

## Install in Plone

Install `plone.blicca.block` alongside
[plone.blicca.auroraeditor](https://github.com/derico-de/plone.blicca.auroraeditor)
in your Plone environment. Include `plone.blicca.block` in ZCML if your setup
does not use automatic inclusion, then activate **Blicca Demo Block** in the
Add-ons control panel (GenericSetup profile `plone.blicca.block:default`).

The editor host must provide the `textarea` widget used by the description
field. The add-on registers its block; shared widgets belong to the host.
Committed JavaScript and CSS live in `src/plone/blicca/block/static/`, so
installing the Python package does not require Node.

## Develop and test

Place the editor host checkout next to this project:

```text
src/
  plone.blicca.auroraeditor/
  plone.blicca.block/
```

The local source override in `pyproject.toml` uses that sibling checkout.
From this project's root:

```sh
uv sync --extra test
uv run pytest -v
cd resources
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm test
```

Use the Node version in `resources/.nvmrc` and the pnpm version pinned in
`.github/workflows/ci.yml`. Commit rebuilt static assets whenever frontend
source changes. CI checks that the committed bundle matches its source.
The Python CI job needs the `BLICCA_SSH_KEY` repository secret to check out
the private editor host; update that job and the uv source override if your
host dependency is distributed differently.

## Create a new block project

1. Copy this directory to your new project, excluding `.git`, `.venv`,
   `node_modules`, caches, and build output outside the package's `static/`
   directory. Initialize a new Git repository when ready.
2. Choose a Python package name, for example `myorg.teaser`, and replace
   `plone.blicca.block` throughout the copied project. Move
   `src/plone/blicca/block/` to `src/myorg/teaser/` and replace the corresponding
   paths in build configuration, locale tools, and CI. Set Hatch's wheel
   package path to `src/myorg`, and adjust `known-first-party` in the Ruff
   configuration. Keep namespace parent directories free of `__init__.py`.
3. Set the frontend package name in `resources/package.json`. Set your own
   project description, profile titles, author details, version, and repository
   URLs in the package metadata. Update the changelog for your first release.
4. When creating a different block type, replace `demo-block` with its unique
   stored identifier, `demo_block` with its Python directory name, and
   `DemoBlock` / `DEMO_BLOCK` / `Demo Block` with corresponding code and display
   names. Rename the matching source directories and test and asset files.
   This blueprint itself intentionally keeps `demo-block`.
5. Implement the fields in `resources/src/demo-block/schema.ts`, editing in
   `Edit.tsx`, frontend rendering in `View.tsx`, and public rendering in
   `src/plone/blicca/block/blocks/demo_block/view.py` and `view.pt`. Keep data
   normalization and CSS anatomy consistent across both renderers. Adapt the
   shared examples in `tests/anatomy-cases.json` and the existing tests.
6. Rebuild the frontend and run both test suites. Verify installation,
   insertion, editing, public rendering, and uninstalling in your Plone site.

Package identity is used in the browser layer, resource URLs, permissions,
translation domain and catalog filenames, registry records, and profiles.
Keep the default and uninstall profile record names in sync. The block
identifier also appears in the Python renderer registration, TypeScript
schema, CSS, and tests. Give each derived block a unique identifier before
installing it alongside another copy; changing a stored identifier later
requires migrating existing content.

## Using the block in Aurora

The frontend is also a source package named `plone.blicca.block`, rooted in
`resources/`. Add it as a local dependency in an Aurora frontend, import its
default installer, and call it with the frontend's registry configuration:

```ts
import installDemoBlock from "plone.blicca.block";

installDemoBlock(config);
```

Your frontend must compile TypeScript/TSX, load the imported CSS, provide the
package's peer dependencies, and register a `textarea` widget. See
[resources/README.md](resources/README.md) for the frontend layout.

## License and author

Python package: GPL-2.0-or-later. Frontend package: MIT, as declared in
`resources/package.json`. Preserve applicable notices when deriving a project.

[syslab.com](https://syslab.com), <devel@syslab.com>
