import { describe, expect, it } from 'vitest';
import { SITE_CONTACT, SOCIAL_SHARE_URLS } from '@shared/contact-info';

describe('site contact copy configuration', () => {
  it('keeps the published phone and email values current', () => {
    expect(SITE_CONTACT.phone).toBe('+1 (425) 520-729');
    expect(SITE_CONTACT.email).toBe('neven6000@gmail.com');
  });

  it('builds the supported social sharing links from the current page', () => {
    const pageUrl = 'https://www.neven.bar/en/page/contact';
    const title = 'Contact NevenShopper';

    expect(SOCIAL_SHARE_URLS.facebook(pageUrl)).toContain('facebook.com/sharer/sharer.php');
    expect(SOCIAL_SHARE_URLS.facebook(pageUrl)).toContain(encodeURIComponent(pageUrl));
    expect(SOCIAL_SHARE_URLS.twitter(pageUrl, title)).toContain('twitter.com/intent/tweet');
    expect(SOCIAL_SHARE_URLS.twitter(pageUrl, title)).toContain(encodeURIComponent(title));
    expect(SOCIAL_SHARE_URLS.linkedin(pageUrl)).toContain('linkedin.com/sharing/share-offsite');
  });
});
