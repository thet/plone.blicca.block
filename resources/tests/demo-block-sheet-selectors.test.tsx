import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import postcss from 'postcss';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Edit from '../src/demo-block/Edit';
import View from '../src/demo-block/View';

afterEach(cleanup);
const sheet = postcss.parse(readFileSync(path.resolve(import.meta.dirname, '../src/demo-block/styles.css'), 'utf8'));

describe('demo block stylesheet', () => {
  it('has no selector that cannot reach the view or edit markup', () => {
    const { container } = render(<>
      <View data={{ title: 'Title', description: 'Description' }} />
      <Edit />
    </>);
    const selectors: string[] = [];
    sheet.walkRules((rule) => {
      // Resolve the scaffold's nested rules against their parent selector.
      const parent = rule.parent;
      for (const selector of rule.selectors) {
        if (parent?.type === 'rule') {
          for (const root of parent.selectors) {
            selectors.push(selector.includes('&') ? selector.replaceAll('&', root) : `${root} ${selector}`);
          }
        } else selectors.push(selector);
      }
    });
    expect(selectors).toContain('.demo-block');
    expect(selectors).toContain('.demo-block-notice');
    for (const selector of selectors) expect(container.querySelector(selector), selector).not.toBeNull();
  });
});
