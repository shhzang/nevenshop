import fs from 'node:fs/promises';

const files = ['research/new-article-002.json', 'server/data/blog.json'];
const oldOpening = 'Battery technology is part of everyday vape use, but it should never become an invitation to experiment with the device.';
const newOpening = 'Vape battery safety begins with ordinary device care, not with experimenting with the device.';

for (const path of files) {
  const data = JSON.parse(await fs.readFile(path, 'utf8'));
  const article = Array.isArray(data)
    ? data.find((item) => item.slug === 'vape-battery-safety-checklist-2026')
    : data;
  if (!article?.translations?.en?.content?.includes(oldOpening)) {
    throw new Error(`Expected opening not found in ${path}`);
  }
  article.translations.en.content = article.translations.en.content.replace(oldOpening, newOpening);
  await fs.writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}
console.log('Updated Article 002 English keyword placement.');
