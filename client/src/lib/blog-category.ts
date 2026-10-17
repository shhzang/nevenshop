export type BlogCategory =
  | "compliance"
  | "recycling"
  | "safety"
  | "travel"
  | "product"
  | "guidance";

const categoryPatterns: Array<[BlogCategory, RegExp]> = [
  ["recycling", /(recycl|waste|disposal|collection|environment|sustainab)/i],
  ["safety", /(battery|storage|temperature|safety|charging|device-care)/i],
  ["travel", /(travel|flying|airline|airport)/i],
  ["compliance", /(age|retailer|policy|compliance|document|record|verification|regulat|legal|source-library)/i],
  ["product", /(recharge|mesh|puff|flavor|feature|display|coil|nicotine|capacity|led)/i],
];

export function getBlogCategory(slug: string): BlogCategory {
  return categoryPatterns.find(([, pattern]) => pattern.test(slug))?.[0] ?? "guidance";
}

const labels: Record<BlogCategory, Record<string, string>> = {
  compliance: {
    en: "Adult Access & Compliance",
    de: "Alterszugang & Compliance",
    ar: "وصول البالغين والامتثال",
  },
  recycling: {
    en: "Recycling & Disposal",
    de: "Recycling & Entsorgung",
    ar: "إعادة التدوير والتخلص الآمن",
  },
  safety: {
    en: "Safety & Storage",
    de: "Sicherheit & Aufbewahrung",
    ar: "السلامة والتخزين",
  },
  travel: {
    en: "Travel & Transport",
    de: "Reisen & Transport",
    ar: "السفر والنقل",
  },
  product: {
    en: "Product Information",
    de: "Produktinformationen",
    ar: "معلومات المنتج",
  },
  guidance: {
    en: "Adult Guides",
    de: "Leitfäden für Erwachsene",
    ar: "أدلة للبالغين",
  },
};

export function getBlogCategoryLabel(category: BlogCategory, lang: string): string {
  return labels[category][lang] ?? labels[category].en;
}
