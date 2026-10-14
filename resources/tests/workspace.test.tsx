import { describe, expect, it } from 'vitest';
import config from '@plone/registry';

import install from '../src/index';
import {
  BLICCA_ONLY_REGISTRATIONS,
  UpstreamAlignWidget,
  UpstreamImageWidget,
  choicesWidgetOf,
  installUpstreamRegistry,
} from './upstream-registry';

// A vitest file gets its own module registry, so this singleton is this
// file's alone.
const upstream = installUpstreamRegistry(config as any);

describe('install()', () => {
  it('returns the config — the loader convention requires it', () => {
    expect(install(upstream)).toBe(upstream);
  });
});

describe('the upstream registry fixture', () => {
  it('resolves widgets across all categories flat, as the host does', () => {
    expect(upstream.getWidget('align')).toBe(UpstreamAlignWidget);
    expect(upstream.getWidget('image')).toBe(UpstreamImageWidget);
    // registered under `vocabulary`, not `widget` — found anyway
    expect(upstream.getWidget('plone.app.vocabularies.Catalog')).toBeDefined();
  });

  it('leaves choices and textarea registration to the Blicca host', () => {
    // Via `choicesWidgetOf`: `getWidget('choices')` is blind to the way this
    // widget is registered and returns undefined either way.
    expect(BLICCA_ONLY_REGISTRATIONS.widgetKeys).toEqual(['choices', 'textarea']);
    expect(choicesWidgetOf(upstream)).toBeUndefined();
    expect(upstream.getWidget('textarea')).toBeUndefined();
  });
});
