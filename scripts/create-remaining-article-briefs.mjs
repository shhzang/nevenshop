import fs from 'node:fs/promises';

const manifest = JSON.parse(await fs.readFile('research/remaining-86-topic-manifest.json', 'utf8'));
const sources = {
  'fda-retail': {
    name: 'U.S. FDA — Selling Tobacco Products in Retail Stores',
    url: 'https://www.fda.gov/tobacco-products/retail-sales-tobacco-products/selling-tobacco-products-retail-stores',
    facts: ['FDA states US retailers may sell ENDS only to customers 21 or older.', 'FDA states retailers should check photo ID for those under 30 who attempt to purchase tobacco products.', 'State and local rules may be more restrictive.'],
    boundary: 'Write for US adult retail contexts only and state that local rules may differ.',
  },
  'fda-labeling': {
    name: 'U.S. FDA — Labeling and Warning Statements for Tobacco Products',
    url: 'https://www.fda.gov/tobacco-products/products-guidance-regulations/labeling-and-warning-statements-tobacco-products',
    facts: ['FDA maintains public information about tobacco-product labeling and warning statements.', 'Requirements vary by product type and jurisdiction.', 'A package alone does not establish authorization or compliance.'],
    boundary: 'Discuss public information only; do not make product-specific compliance determinations.',
  },
  'fda-authorized': {
    name: 'U.S. FDA — E-Cigarettes Authorized by FDA',
    url: 'https://www.fda.gov/tobacco-products/market-and-distribute-tobacco-product/e-cigarettes-vapes-and-other-electronic-nicotine-delivery-systems-ends-authorized-fda',
    facts: ['FDA maintains public information about tobacco products that may be legally marketed in the United States.', 'Public database research should be dated and product-specific.', 'Marketing claims should not replace official regulatory information.'],
    boundary: 'Explain research workflow only; do not state any particular product is authorized.',
  },
  'epa-collection': {
    name: 'U.S. EPA — Safely Collecting and Managing E-Cigarettes from Households',
    url: 'https://www.epa.gov/electronics-batteries-management/battery-collection-tip-sheet-safely-collecting-and-managing-e',
    facts: ['EPA published a 2026 tip sheet for businesses interested in collecting unwanted household e-cigarettes.', 'EPA recommends coordinating with a household hazardous waste facility or qualified transporter before collection.', 'State and local requirements differ.'],
    boundary: 'Use as US guidance only; never provide dismantling, shipping, or hazardous-waste handling instructions.',
  },
  'epa-disposal': {
    name: 'U.S. EPA — How to Safely Dispose of E-Cigarettes',
    url: 'https://www.epa.gov/hw/how-safely-dispose-e-cigarettes-information-individuals',
    facts: ['EPA states e-cigarettes contain nicotine and lithium batteries.', 'EPA directs people to household hazardous waste collection sites and local options.', 'Local collection rules differ.'],
    boundary: 'Use as US household information only and direct readers to local authorities.',
  },
  'faa-travel': {
    name: 'FAA PackSafe — E-Cigarettes and Vaping Devices',
    url: 'https://www.faa.gov/hazmat/packsafe/e-cigarettes-vaping',
    facts: ['FAA provides public passenger guidance for e-cigarettes and vaping devices.', 'Airline and destination requirements can change.', 'Passengers should confirm current rules before travel.'],
    boundary: 'Discuss planning only; do not present guidance as a substitute for current airline or destination rules.',
  },
  'uk-single-use': {
    name: 'GOV.UK — Single-use vapes ban',
    url: 'https://www.gov.uk/guidance/single-use-vapes-ban',
    facts: ['GOV.UK publishes guidance on the UK ban on single-use vapes.', 'The guidance distinguishes rechargeable, refillable, and replaceable product characteristics.', 'UK definitions should not be generalized to other markets.'],
    boundary: 'Limit regulatory discussion to the UK and avoid product-specific legal conclusions.',
  },
  'uk-takeback': {
    name: 'GOV.UK — Electrical waste retailer and distributor responsibilities',
    url: 'https://www.gov.uk/electricalwaste-producer-supplier-responsibilities/join-the-distributor-takeback-scheme',
    facts: ['GOV.UK says sellers of vapes must take back waste vapes in store or set up an alternative collection point.', 'Businesses should keep a record of customer WEEE information.', 'The guidance is UK-specific.'],
    boundary: 'Discuss UK information only; do not provide hazardous-waste operations advice.',
  },
  'fda-battery': {
    name: 'U.S. FDA — Tips to Help Avoid Vape Battery Fires or Explosions',
    url: 'https://www.fda.gov/tobacco-products/products-ingredients-components/tips-help-avoid-vape-battery-fires-or-explosions',
    facts: ['FDA provides public safety information on e-cigarette battery incidents.', 'Device-specific manuals and manufacturer instructions matter.', 'Abnormal or damaged devices require cautious, model-specific support rather than modification.'],
    boundary: 'Provide only high-level safety information and never teach device modification or repair.',
  },
  'general-device': {
    name: 'U.S. FDA — E-Cigarettes, Vapes and Other ENDS',
    url: 'https://www.fda.gov/tobacco-products/products-ingredients-components/e-cigarettes-vapes-and-other-electronic-nicotine-delivery-systems-ends',
    facts: ['ENDS refers to a range of electronic nicotine delivery products.', 'Product designs and manufacturer instructions vary.', 'General information should not replace model-specific documentation.'],
    boundary: 'Use factual device-literacy framing only; make no performance or health claims.',
  },
};

if (manifest.length !== 86) throw new Error(`Expected 86 topics, found ${manifest.length}`);
await fs.mkdir('research/remaining-briefs', { recursive: true });

for (let index = 0; index < manifest.length; index += 1) {
  const topic = manifest[index];
  const source = sources[topic.source];
  if (!source) throw new Error(`Unknown source key: ${topic.source}`);
  const id = 38 + index;
  const brief = {
    title: topic.title,
    primaryKeyword: topic.keyword,
    relatedKeywords: [topic.keyword, `${topic.keyword} 2026`, 'adult vape information', 'vape retail guidance', 'vape trend 2026'],
    searchIntent: `Provide an original, adult-focused informational explainer for the 2026 query “${topic.keyword}”, with concrete decision points and no sales claims.`,
    sourceName: source.name,
    sourceUrl: source.url,
    sourceFacts: source.facts,
    jurisdictionBoundary: source.boundary,
    prohibitedClaims: ['Do not make health, safety, authorization, compliance, performance, or suitability guarantees.', 'Do not market to minors, provide medical advice, or explain law evasion.', 'Do not invent studies, product facts, legal requirements, or URLs.'],
  };
  const filename = `research/remaining-briefs/article-${String(id).padStart(3, '0')}-${topic.slug}.json`;
  await fs.writeFile(filename, `${JSON.stringify(brief, null, 2)}\n`);
}

console.log(`Created ${manifest.length} sequential article briefs.`);
