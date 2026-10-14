import { describe, expect, it } from 'vitest';
import config from '@plone/registry';
import { getStyleFieldDefinitionsFromRegistry } from '@plone/helpers';

import { BlockInfo as DemoBlockInfo } from '../src/demo-block';
import install from '../src/index';
import {
  BLICCA_ONLY_REGISTRATIONS,
  UPSTREAM_WIDTHS,
  installUpstreamRegistry,
} from './upstream-registry';

// A vitest file gets its own module registry, so this singleton is this
// file's alone.
const upstream = installUpstreamRegistry(config as any);

describe('install()', () => {
  it('registers the block under @type demo-block', () => {
    install(upstream);
    expect(upstream.blocks.blocksConfig['demo-block']).toBe(DemoBlockInfo);
  });
});

describe('the blocksConfig entry', () => {
  it('has the two fields whose absence silently drops it from the slash menu', () => {
    expect(DemoBlockInfo.id).toBe('demo-block');
    expect(DemoBlockInfo.title).toBe('Demo Block');
  });

  it('carries id as a plain string, matching the stored @type', () => {
    expect(typeof DemoBlockInfo.title).toBe('string');
  });

  it('gives icon as a component — a string breaks the slash menu', () => {
    expect(typeof DemoBlockInfo.icon).toBe('function');
  });

  it('declares no defaultBlockWidth: the schema offers blockWidth instead', () => {
    expect(DemoBlockInfo).not.toHaveProperty('defaultBlockWidth');
  });
});

describe('the upstream registry fixture', () => {
  it('registers blockWidth and only blockWidth as a style field', () => {
    // The real signature takes `args` as a REQUIRED second parameter —
    // fragmentsblock's stub made it optional, which is the kind of drift a
    // hand-written facade hides until the host disagrees at runtime.
    expect(
      getStyleFieldDefinitionsFromRegistry('blockWidth', {
        data: {},
        fieldName: 'blockWidth',
        blockType: 'demo-block',
      }),
    ).toEqual(UPSTREAM_WIDTHS);
    for (const name of BLICCA_ONLY_REGISTRATIONS.styleFieldDefinitions) {
      expect(
        upstream.getUtility({ type: 'styleFieldDefinition', name }).method,
      ).toBeUndefined();
    }
  });
});
