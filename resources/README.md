# Demo block frontend

The `plone.blicca.block` frontend package supplies the schema, editor, and view
for `demo-block`. Its default export registers the block in an Aurora registry
and returns the configuration. The Plone integration is in
`../src/plone/blicca/block/`.

- `src/index.ts`: package installer.
- `src/demo-block/`: schema, editor, view, icon, and styles.
- `build-plugins/scope-wrap.ts`: CSS isolation for editor and public views.
- `test/`: frontend behavior, registry integration, and rendering checks.
- `vite.config.ts`: library build and shared host module exclusions.

Run `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm build`, and
`pnpm test` here. The build writes `demo-block.js`, its source map, and
`demo-block.css` into `../src/plone/blicca/block/static/`. Commit generated
assets with frontend changes. Shared runtime modules are supplied by the
editor host through its import map.

See the [project README](../README.md) for installation and scaffolding steps.
