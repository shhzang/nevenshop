import fs from 'node:fs/promises';

const sourceUrl = 'https://www.epa.gov/electronics-batteries-management/battery-collection-tip-sheet-safely-collecting-and-managing-e';
const prompt = `Create one original, professional, adult-market educational Blog article package for NEVEN. Topic: “How Retailers Can Plan a Vape Collection Program in 2026.”

Research basis: the U.S. EPA’s 2026 guidance says e-cigarettes can contain nicotine e-liquids and lithium batteries; local and state rules differ; a retailer considering a collection programme should first coordinate with a household hazardous waste facility or qualified transporter and must not encourage dismantling components not designed to be removed. Use this source as a cited “Further reading” URL: ${sourceUrl}

Requirements:
- Write for lawful adult-only retail and distribution audiences. Avoid youth appeal, sales language, health claims, legal advice, claims of product authorisation, universal compliance claims, and unsupported statistics.
- Create English first, then faithful professional German and Arabic versions. Each version must be 650–850 words in 6–9 varied paragraphs. No repetitive template phrasing. Natural editorial voice is required, but do not mention AI, detectors, or authorship scores.
- The English primary keyword is “vape collection program”. Use it naturally in the title, first 120 words, one subheading, and the conclusion; do not repeat it excessively. Include related terms naturally: e-cigarette recycling retailer, lithium battery vape disposal, household hazardous waste, vape take-back planning.
- Explain a practical planning sequence: scope, local authority/partner checks, separating business waste from publicly collected waste, safe storage, staff procedures, customer communication, and periodic review. State that requirements vary by location.
- Use HTML-free Markdown text with H2/H3 headings. End each language version with “Further reading:” and the EPA URL.
- Provide concise SEO titles (max 60 characters when practical), descriptions (120–155 characters), and 5–7 keywords for each language.
- Create a unique slug: vape-collection-program-retailer-guide-2026. Date: 2026-08-17.`;

const schema = {
  name: 'blog_article',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      slug: { type: 'string' },
      date: { type: 'string' },
      image_prompt: { type: 'string' },
      seo: {
        type: 'object',
        properties: {
          en: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, keywords: { type: 'string' } }, required: ['title', 'description', 'keywords'], additionalProperties: false },
          de: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, keywords: { type: 'string' } }, required: ['title', 'description', 'keywords'], additionalProperties: false },
          ar: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' }, keywords: { type: 'string' } }, required: ['title', 'description', 'keywords'], additionalProperties: false },
        },
        required: ['en', 'de', 'ar'],
        additionalProperties: false,
      },
      translations: {
        type: 'object',
        properties: {
          en: { type: 'object', properties: { title: { type: 'string' }, excerpt: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'excerpt', 'content'], additionalProperties: false },
          de: { type: 'object', properties: { title: { type: 'string' }, excerpt: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'excerpt', 'content'], additionalProperties: false },
          ar: { type: 'object', properties: { title: { type: 'string' }, excerpt: { type: 'string' }, content: { type: 'string' } }, required: ['title', 'excerpt', 'content'], additionalProperties: false },
        },
        required: ['en', 'de', 'ar'],
        additionalProperties: false,
      },
    },
    required: ['id', 'slug', 'date', 'image_prompt', 'seo', 'translations'],
    additionalProperties: false,
  },
};

const response = await fetch(`${process.env.OPENAI_API_BASE}/chat/completions`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-5',
    max_completion_tokens: 10000,
    reasoning: { effort: 'minimal' },
    messages: [
      { role: 'system', content: 'You are a meticulous multilingual editor. Return only schema-compliant JSON.' },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_schema', json_schema: schema },
  }),
});

if (!response.ok) throw new Error(`LLM request failed: ${response.status} ${await response.text()}`);
const payload = await response.json();
const text = payload.choices?.[0]?.message?.content;
if (!text) throw new Error('The model returned no content');
const article = JSON.parse(text);
article.id = 24;
article.featured_image = '';
await fs.writeFile('research/article-101-draft.json', `${JSON.stringify(article, null, 2)}\n`);
console.log('Wrote research/article-101-draft.json');
