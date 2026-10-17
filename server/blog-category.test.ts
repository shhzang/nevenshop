import { describe, expect, it } from "vitest";
import { getBlogCategory, getBlogCategoryLabel } from "../client/src/lib/blog-category";

describe("blog topic library", () => {
  it("sorts regulatory, recycling, safety and travel articles into stable topic groups", () => {
    expect(getBlogCategory("vape-age-policy-page-review-2026")).toBe("compliance");
    expect(getBlogCategory("vape-recycling-faq-for-adults-2026")).toBe("recycling");
    expect(getBlogCategory("vape-battery-storage-questions-retailers-2026")).toBe("safety");
    expect(getBlogCategory("flying-with-vape-policy-check-2026")).toBe("travel");
  });

  it("provides a readable category label in every existing Blog language", () => {
    expect(getBlogCategoryLabel("compliance", "en")).toBe("Adult Access & Compliance");
    expect(getBlogCategoryLabel("compliance", "de")).toBe("Alterszugang & Compliance");
    expect(getBlogCategoryLabel("compliance", "ar")).toBe("وصول البالغين والامتثال");
  });
});
