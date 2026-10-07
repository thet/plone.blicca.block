import { describe, expect, it } from 'vitest';
import config from '@plone/registry';
import install from '../src';
import { BlockInfo as DemoBlockInfo, Edit as DemoEdit, Schema as DemoSchema, View as DemoView } from '../src/demo-block';
import { installUpstreamRegistry, UpstreamTextField } from './upstream-registry';

const aurora = installUpstreamRegistry(config as any);
// Stand in for a host-provided component; its behavior is tested in the host.
const HostTextarea = () => null;
aurora.registerWidget({ key: 'widget', definition: { textarea: HostTextarea } });
const originalBlocks = { ...aurora.blocks.blocksConfig };
const originalWidgets = { ...aurora.widgets.widget };
install(aurora);

describe('demo block in the upstream Aurora registry', () => {
  it('preserves upstream blocks and widgets', () => {
    for (const [name, block] of Object.entries(originalBlocks)) {
      expect(aurora.blocks.blocksConfig[name]).toBe(block);
    }
    for (const [name, widget] of Object.entries(originalWidgets)) {
      expect(aurora.getWidget(name)).toBe(widget);
    }
    expect(aurora.widgets.widget).toEqual(originalWidgets);
    expect(aurora.getWidget('textarea')).toBe(HostTextarea);
  });

  it('connects the registered schema, editor and view', () => {
    expect(aurora.blocks.blocksConfig['demo-block']).toBe(DemoBlockInfo);
    expect(DemoBlockInfo.blockSchema).toBe(DemoSchema);
    expect(DemoBlockInfo.edit).toBe(DemoEdit);
    expect(DemoBlockInfo.view).toBe(DemoView);
  });

  it('resolves every sidebar field through host widgets', () => {
    expect(aurora.widgets.default).toBe(UpstreamTextField);
    const properties = DemoSchema().properties;
    expect(aurora.getWidget(properties.description.widget)).toBe(HostTextarea);
    expect(aurora.getWidget(properties.blockWidth.widget)).toBeDefined();
  });
});
