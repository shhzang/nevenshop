import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const indexHtml = await readFile(resolve('client/index.html'), 'utf8');

const requiredSnippets = [
  'var productionHosts = ["neven.bar", "www.neven.bar"]',
  'window.location.hostname.toLowerCase()',
  'productionHosts.indexOf(window.location.hostname.toLowerCase()) === -1',
  'analyticsScript.src = "%VITE_ANALYTICS_ENDPOINT%/umami"',
  'analyticsScript.dataset.websiteId = "%VITE_ANALYTICS_WEBSITE_ID%"',
];

for (const snippet of requiredSnippets) {
  if (!indexHtml.includes(snippet)) {
    throw new Error(`Analytics scope guard is missing: ${snippet}`);
  }
}

if (/<script\s+defer\s+src="%VITE_ANALYTICS_ENDPOINT%\/umami"/.test(indexHtml)) {
  throw new Error('Analytics tracker must not load unconditionally from static HTML.');
}

console.log('Analytics scope guard validated: only neven.bar and www.neven.bar load Umami.');
