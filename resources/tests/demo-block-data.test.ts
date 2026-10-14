import { describe, expect, it } from 'vitest';
import { text, warnings } from '../src/demo-block/data';

describe('text', () => {
  it.each([undefined, null, 0, 42, false, true, [], {}])('ignores non-string %j', (value) => {
    expect(text(value)).toBe('');
  });
  it('trims only surrounding whitespace', () => {
    expect(text('  First\nSecond  ')).toBe('First\nSecond');
    expect(text(' \t\n')).toBe('');
  });
});

describe('warnings', () => {
  it('reports each missing field', () => {
    expect(warnings({})).toEqual([
      'No title given for the demo block.',
      'No description given for the demo block.',
    ]);
    expect(warnings({ title: 'Title' })).toEqual(['No description given for the demo block.']);
    expect(warnings({ description: 'Description' })).toEqual(['No title given for the demo block.']);
  });
  it('treats blank and malformed values as missing', () => {
    expect(warnings({ title: '  ', description: 42 })).toEqual(warnings({}));
  });
  it('accepts complete content', () => {
    expect(warnings({ title: 'Title', description: 'Description' })).toEqual([]);
  });
});
