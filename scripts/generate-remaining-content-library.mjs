import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';

const manifest = JSON.parse(await fs.readFile('research/remaining-86-topic-manifest.json', 'utf8'));
const startAt = Number(process.env.START_AT ?? 0);
const stopAfter = Number(process.env.STOP_AFTER ?? manifest.length);

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', env: process.env });
    child.on('error', reject);
    child.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`${command} exited with ${code}`)));
  });
}

for (let index = startAt; index < Math.min(manifest.length, startAt + stopAfter); index += 1) {
  const item = manifest[index];
  const id = 38 + index;
  const brief = `research/remaining-briefs/article-${String(id).padStart(3, '0')}-${item.slug}.json`;
  const output = `research/new-article-${String(id).padStart(3, '0')}.json`;

  try {
    await fs.access(output);
    console.log(`[${id}] Draft already exists, skipping: ${item.slug}`);
    continue;
  } catch {
    // Draft is not present; generate it below.
  }

  let attempt = 0;
  while (attempt < 2) {
    try {
      attempt += 1;
      console.log(`\n[${id}] Generating ${item.slug} (attempt ${attempt}/2)`);
      await run('node', ['scripts/generate-sequential-blog.mjs', String(id), item.slug, brief, output]);
      console.log(`[${id}] Completed draft: ${item.slug}`);
      break;
    } catch (error) {
      if (attempt >= 2) throw error;
      console.warn(`[${id}] Retrying after generation error: ${error.message}`);
    }
  }
}

console.log('Sequential draft generation finished for requested range.');
