import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const indexHtml = await readFile(resolve('client/index.html'), 'utf8');

const requiredSnippets = [
  'var productionHosts = ["neven.bar", "www.neven.bar"]',
  'var knownBotUserAgent = /(?:bot|crawler|spider|slurp|archiver|facebookexternalhit|facebot|whatsapp|linkedinbot|telegrambot|discordbot)/i',
  'window.location.hostname.toLowerCase()',
  'knownBotUserAgent.test(navigator.userAgent)',
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

const knownBotUserAgent = /(?:bot|crawler|spider|slurp|archiver|facebookexternalhit|facebot|whatsapp|linkedinbot|telegrambot|discordbot)/i;
if (!knownBotUserAgent.test('searchbot')) {
  throw new Error('Known search bot user agents must not load analytics.');
}
if (knownBotUserAgent.test('Mozilla/5.0 Chrome/140.0.0.0 Safari/537.36')) {
  throw new Error('Common browser user agents must remain measurable.');
}

console.log('Analytics scope guard validated: only human visits to neven.bar and www.neven.bar load Umami.');
