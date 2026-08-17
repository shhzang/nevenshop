import fs from 'node:fs/promises';

const [id, slug, topicFile, outputFile] = process.argv.slice(2);
if (!id || !slug || !topicFile || !outputFile) {
  throw new Error('Usage: node scripts/generate-sequential-blog.mjs <id> <slug> <topic-json> <output-json>');
}

const topic = JSON.parse(await fs.readFile(topicFile, 'utf8'));
const seoSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    description: { type: 'string' },
    keywords: { type: 'string' },
  },
  required: ['title', 'description', 'keywords'],
  additionalProperties: false,
};
const translationSchema = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    excerpt: { type: 'string' },
    content: { type: 'string' },
  },
  required: ['title', 'excerpt', 'content'],
  additionalProperties: false,
};
const schema = {
  name: 'sequential_blog_article',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      id: { type: 'integer' },
      slug: { type: 'string' },
      date: { type: 'string' },
      featured_image: { type: 'string' },
      seo: {
        type: 'object',
        properties: {
          en: seoSchema,
          de: seoSchema,
          ar: seoSchema,
        },
        required: ['en', 'de', 'ar'],
        additionalProperties: false,
      },
      translations: {
        type: 'object',
        properties: {
          en: translationSchema,
          de: translationSchema,
          ar: translationSchema,
        },
        required: ['en', 'de', 'ar'],
        additionalProperties: false,
      },
    },
    required: ['id', 'slug', 'date', 'featured_image', 'seo', 'translations'],
    additionalProperties: false,
  },
};

const prompt = `Write one original, professional, adult-only informational Blog article from the supplied brief. Return only a JSON object matching the schema.

Article identity:
- id: ${id}
- slug: ${slug}
- date: 2026-08-17
- featured_image: leave as an empty string; a reviewed cover will be added separately.

Research brief:
${JSON.stringify(topic, null, 2)}

Editorial requirements:
- Create separate native-quality English, German and Arabic articles. Do not mechanically translate phrase by phrase.
- Each content field must be 2,100 to 3,600 characters, use clear Markdown H2 headings, and finish with a "Further reading" / localized equivalent containing the exact official source URL from the brief.
- Use the primary keyword naturally in the localized title and in the first 900 characters of the English article. Use related keywords sparingly and only where they clarify the topic.
- Make the tone evidence-led, specific and naturally edited: vary sentence length, offer concrete checklists or decision points, and avoid generic sales language, inflated claims, keyword stuffing or repeated conclusions.
- Never claim a product is safe, approved, risk-free, healthier, guaranteed, or suitable for anyone. Never market to people under legal age, give medical advice, teach law evasion, or tell users to modify or dismantle devices.
- Clearly describe jurisdiction limits and state that the source is not legal advice where the topic is regulatory.
- SEO title: 45-65 characters when practical. SEO description: 70-155 characters. Keywords: comma-separated, include the primary keyword first.
- Do not mention NEVEN unless the brief specifically requires it. Do not invent studies, statistics, legal requirements, manufacturer facts, dates, product compatibility, or URLs.
`;

const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5-mini',
    messages: [
      { role: 'system', content: 'You are a careful multilingual editorial writer. Follow supplied facts exactly and return strict JSON only.' },
      { role: 'user', content: prompt },
    ],
    max_completion_tokens: 12000,
    response_format: { type: 'json_schema', json_schema: schema },
  }),
});

if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
const content = payload.choices?.[0]?.message?.content;
if (!content) throw new Error('LLM returned no content');
const article = JSON.parse(content);
if (article.id !== Number(id) || article.slug !== slug) throw new Error('Generated article identity does not match request');
await fs.writeFile(outputFile, `${JSON.stringify(article, null, 2)}\n`);
console.log(`Generated ${slug} at ${outputFile}`);
