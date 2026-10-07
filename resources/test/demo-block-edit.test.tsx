import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import Edit from '../src/demo-block/Edit';
import View from '../src/demo-block/View';

afterEach(cleanup);

describe('demo block editing', () => {
  it('shows non-editable notices for missing content', () => {
    const { container } = render(<Edit />);
    const notices = container.querySelectorAll('.demo-block-notice');
    expect([...notices].map((node) => node.textContent)).toEqual([
      'No title given for the demo block.',
      'No description given for the demo block.',
    ]);
    for (const notice of notices) expect(notice.getAttribute('contenteditable')).toBe('false');
    expect(container.querySelector('.demo-block')?.innerHTML).toBe('');
  });

  it('updates notices when content changes', () => {
    const { container, rerender } = render(<Edit data={{ title: 'Title' }} />);
    expect(container.querySelectorAll('.demo-block-notice')).toHaveLength(1);
    const data = { title: 'Title', description: 'Description' };
    rerender(<Edit data={data} />);
    expect(container.querySelector('.demo-block-notice')).toBeNull();
    expect(container.innerHTML).toBe(render(<View data={data} />).container.innerHTML);
  });

  it('keeps notices off the public view', () => {
    expect(render(<View />).container.querySelector('.demo-block-notice')).toBeNull();
  });
});
