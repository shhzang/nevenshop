import fs from 'node:fs/promises';

const [draftPath, language, requirement] = process.argv.slice(2);
if (!draftPath || !language || !requirement) {
  throw new Error('Usage: node scripts/revise-blog-language.mjs <draft.json> <en|de|ar> <requirement>');
}

const article = JSON.parse(await fs.readFile(draftPath, 'utf8'));
const existing = article.translations?.[language]?.content;
if (!existing) throw new Error(`Missing ${language} content in ${draftPath}`);

const schema = {
  name: 'revised_blog_language',
  strict: true,
  schema: {
    type: 'object',
    properties: { content: { type: 'string' } },
    required: ['content'],
    additionalProperties: false,
  },
};

const prompt = `Revise one ${language} Blog article to address a specific editorial quality requirement. Return only JSON that matches the schema.

Article title: ${article.translations[language].title}
Primary English SEO keyword: ${article.seo.en.keywords.split(',')[0].trim()}
Source URL that must remain at the end: ${article.source_url ?? article.translations.en.content.match(/https?:\/\/\S+/)?.[0] ?? ''}
Requirement: ${requirement}

Existing content:
${existing}

Rules:
- Preserve the factual source boundary and adult-only, non-promotional tone.
- Do not add health, safety, authorization, legal-compliance, performance, or suitability claims.
- Do not add invented facts, links, studies, products, dates or regulations.
- Keep Markdown H2 structure and keep the existing official source URL in a localized further-reading section at the end.
- Produce at least 2,050 characters of substantive, naturally written content in ${language}.
- When revising English for keyword placement, place the exact primary English keyword naturally in the opening 600 characters.
`;

const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: 'You are a careful multilingual editor. Return strict JSON only.' },
      { role: 'user', content: prompt },
    ],
    max_completion_tokens: 6000,
    response_format: { type: 'json_schema', json_schema: schema },
  }),
});

if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
const text = payload.choices?.[0]?.message?.content;
if (!text) throw new Error('LLM returned no content');
article.translations[language].content = JSON.parse(text).content;
await fs.writeFile(draftPath, `${JSON.stringify(article, null, 2)}\n`);
console.log(`Revised ${language} content in ${draftPath}`);
