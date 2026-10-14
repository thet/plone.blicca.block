import { afterEach, describe, expect, it, vi } from 'vitest';
import config from '@plone/registry';
import Schema, { BLOCK_TYPE } from '../src/demo-block/schema';
import { installUpstreamRegistry } from './upstream-registry';

const upstream = installUpstreamRegistry(config as any);
const styleDefinitions = (config.utilities as any).styleFieldDefinition;
const originalPalette = styleDefinitions.backgroundColor;
afterEach(() => {
  if (originalPalette) styleDefinitions.backgroundColor = originalPalette;
  else delete styleDefinitions.backgroundColor;
});
const fields = (schema: ReturnType<typeof Schema>, id: string) =>
  schema.fieldsets.find((fieldset) => fieldset.id === id)!.fields;

describe('demo block schema', () => {
  it('offers title, description and host width with no required fields', () => {
    const schema = Schema();
    expect(BLOCK_TYPE).toBe('demo-block');
    expect(schema.title).toBe('Demo Block');
    expect(schema.fieldsets.map((fieldset) => fieldset.id)).toEqual(['default', 'styling']);
    expect(fields(schema, 'default')).toEqual(['title', 'description']);
    expect(fields(schema, 'styling')).toEqual(['blockWidth']);
    expect(schema.required).toEqual([]);
    expect(schema.properties.description.widget).toBe('textarea');
    expect(schema.properties.blockWidth).toEqual({
      title: 'Block width', widget: 'width', default: 'default', styleField: true,
    });
    expect(schema.properties).not.toHaveProperty('backgroundColor');
  });

  it('has a titled property for every offered field', () => {
    const schema = Schema({ formData: { title: 'Title', description: 'Description' } });
    for (const name of schema.fieldsets.flatMap((fieldset) => fieldset.fields)) {
      expect((schema.properties as Record<string, any>)[name].title).toBeTruthy();
    }
  });

  it('appends valid host backgrounds and passes form data to the palette', () => {
    const palette = vi.fn(() => [
      { name: 'none', label: 'None' }, { name: 'blue' }, { label: 'Invalid' },
    ]);
    upstream.registerUtility({ type: 'styleFieldDefinition', name: 'backgroundColor', method: palette });
    const formData = { title: 'Title' };
    const schema = Schema({ formData });
    expect(fields(schema, 'styling')).toEqual(['blockWidth', 'backgroundColor']);
    expect(schema.properties).toHaveProperty('backgroundColor', {
      title: 'Background', choices: [['none', 'None'], ['blue', 'blue']],
      default: 'none', styleField: true,
    });
    expect(palette).toHaveBeenCalledWith({ data: formData, blockType: 'demo-block', fieldName: 'backgroundColor' });
  });

  it.each([{ definitions: [] }, { definitions: [{ label: 'Invalid' }] }, { definitions: [{ name: 'blue', label: 'Blue' }] }])(
    'does not invent a default background for $definitions', ({ definitions }) => {
      upstream.registerUtility({ type: 'styleFieldDefinition', name: 'backgroundColor', method: () => definitions });
      const schema = Schema();
      const background = (schema.properties as Record<string, any>).backgroundColor;
      if (definitions.some((definition) => 'name' in definition)) {
        expect(background.choices).toEqual([['blue', 'Blue']]);
        expect(background).not.toHaveProperty('default');
      } else {
        expect(background).toBeUndefined();
        expect(fields(schema, 'styling')).toEqual(['blockWidth']);
      }
    },
  );
});
