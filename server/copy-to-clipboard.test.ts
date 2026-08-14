import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyText } from '../client/src/lib/copy-to-clipboard';

describe('copyText', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('writes the requested value to the browser clipboard', async () => {
    let copiedValue = '';
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: {
        clipboard: {
          writeText: vi.fn(async (value: string) => {
            copiedValue = value;
          }),
        },
      },
    });

    await expect(copyText('+1 (425) 520-729')).resolves.toBe(true);
    expect(copiedValue).toBe('+1 (425) 520-729');
  });
});
