import { describe, expect, it } from 'vitest';
import { transformCss } from '../build-plugins/scope-wrap';

const options = {
  scopeRoots: ['.aurora-editor', '.aurora-editor-portal', '.aurora-blocks-view'],
  scopeLimit: '.aurora-pattern-island',
};

describe('transformCss', () => {
  it('wraps rules in the donut scope the contract fixes', () => {
    const out = transformCss('.demo-block { color: red; }', options);
    expect(out).toContain(
      '@scope (.aurora-editor, .aurora-editor-portal, .aurora-blocks-view) to (.aurora-pattern-island)',
    );
    expect(out).toContain('.demo-block');
  });

  it('flattens @layer, which would otherwise lose to unlayered Barceloneta', () => {
    const out = transformCss('@layer cmsui { .demo-block { color: red; } }', options);
    expect(out).not.toContain('@layer');
    expect(out).toContain('.demo-block');
  });

  it('rewrites :root to :where(:scope) so seam tokens survive the wrap', () => {
    const out = transformCss(':root { --demo-block-x: 1px; }', options);
    expect(out).toContain(':where(:scope)');
    expect(out).not.toMatch(/(^|[\s>+~,(]):root/);
  });

  it('hoists @font-face out of the scope, where names are global', () => {
    const out = transformCss(
      '@font-face { font-family: X; } .demo-block { color: red; }',
      options,
    );
    expect(out.indexOf('@font-face')).toBeLessThan(out.indexOf('@scope'));
  });
});
