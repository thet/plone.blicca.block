/** Real Aurora registrations, without the Blicca wrapper overrides. */
import type { ComponentType } from 'react';

import installTheming from '@plone/theming';
import installPlate from '@plone/plate';
import installBlocks from '@plone/blocks';
import installLayout from '@plone/layout';
import installCmsui from '@plone/cmsui';

import { AlignWidget, TextField } from '@plone/components/quanta';
import ImageWidget from '@plone/cmsui/components/ImageWidget/ImageWidget';
import { ObjectBrowserWidget } from '@plone/cmsui/components/ObjectBrowserWidget/ObjectBrowserWidget';

export type UpstreamConfig = {
  blocks: {
    blocksConfig: Record<string, unknown>;
    widths?: unknown[];
    plateBlocksConfig?: Record<string, unknown>;
  };
  widgets: Record<string, any>;
  settings: Record<string, any>;
  registerWidget: (options: { key: string; definition: unknown }) => void;
  registerDefaultWidget: (widget: unknown) => void;
  getWidget: (key: string) => ComponentType<any> | undefined;
  registerUtility: (options: {
    type: string;
    name: string;
    method: unknown;
  }) => void;
  getUtility: (options: { type: string; name: string }) => { method?: unknown };
};

export const UpstreamTextField = TextField as unknown as ComponentType<any>;
export const UpstreamAlignWidget = AlignWidget as unknown as ComponentType<any>;
export const UpstreamImageWidget = ImageWidget as unknown as ComponentType<any>;
export const UpstreamObjectBrowserWidget =
  ObjectBrowserWidget as unknown as ComponentType<any>;

export const UPSTREAM_WIDTHS = [
  {
    style: { '--block-width': 'var(--narrow-container-width)' },
    name: 'narrow',
    label: 'Narrow',
  },
  {
    style: { '--block-width': 'var(--default-container-width)' },
    name: 'default',
    label: 'Default',
  },
  {
    style: { '--block-width': 'var(--layout-container-width)' },
    name: 'layout',
    label: 'Layout',
  },
  { style: { '--block-width': '100%' }, name: 'full', label: 'Full Width' },
];

export const UPSTREAM_BLOCKS = ['image', 'teaser', 'video', 'listing'];

// Registry objects are sealed; track installation without adding a flag.
const installed = new WeakSet<object>();

export function installUpstreamRegistry<T extends UpstreamConfig>(config: T): T {
  if (installed.has(config)) return config;

  installTheming(config as any);
  installPlate(config as any);
  installBlocks(config as any);
  installLayout(config as any);
  installCmsui(config as any);

  installed.add(config);
  return config;
}

export function choicesWidgetOf(config: UpstreamConfig): unknown {
  return (config as any).widgets?.choices;
}

export const BLICCA_ONLY_REGISTRATIONS = {
  widgetKeys: ['choices', 'textarea'],
  styleFieldDefinitions: ['backgroundColor'],
  substitutedWidgets: ['object_browser', 'image', 'boolean', 'querystring'],
} as const;
