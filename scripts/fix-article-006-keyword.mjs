import fs from 'node:fs/promises';

const files = [
  'research/new-article-006.json',
  'server/data/blog.json',
];

for (const file of files) {
  const raw = await fs.readFile(file, 'utf8');
  const updated = raw.replace(
    'The phrase reusable vape can describe a product feature in everyday conversation, but in a regulated market it can also carry a specific legal meaning.',
    'The reusable vape definition may describe a product feature in everyday conversation, but in a regulated market it can also carry a specific legal meaning.',
  );

  if (updated === raw) {
    throw new Error(`Expected opening paragraph was not found in ${file}`);
  }

  await fs.writeFile(file, updated);
}

console.log('Updated the article 006 keyword placement in draft and Blog data.');
