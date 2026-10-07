import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import View from '../src/demo-block/View';
import type { Data } from '../src/demo-block/data';

afterEach(cleanup);
const cases: { name: string; data: Data; html: string }[] = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, '../../tests/anatomy-cases.json'), 'utf8'),
).cases;

describe('demo block anatomy shared with the public template', () => {
  it.each(cases)('renders $name', ({ data, html }) => {
    expect(render(<View data={data} />).container.innerHTML).toBe(html);
    expect(render(<View data={data} isEditMode />).container.innerHTML).toBe(html);
  });

  it('accepts an omitted data prop', () => {
    expect(render(<View />).container.innerHTML).toBe('<div class="demo-block"></div>');
  });

  it('uses a heading and paragraph inside its own root and copy container', () => {
    const { container } = render(<View data={{ title: 'Title', description: 'Description' }} />);
    expect(container.querySelector('.demo-block > .demo-block-copy > h2')?.textContent).toBe('Title');
    expect(container.querySelector('.demo-block-copy > p')?.textContent).toBe('Description');
    expect(container.querySelectorAll('[class]')).toHaveLength(4);
  });
});
