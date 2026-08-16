const response = await fetch("http://localhost:3000/sitemap.xml", { redirect: "follow" });
const xml = await response.text();

const errors = [];
if (!response.ok) errors.push(`Unexpected HTTP status: ${response.status}`);
if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) errors.push("Missing XML declaration");
if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) errors.push("Missing sitemap namespace");
if (xml.includes("run.app")) errors.push("Internal proxy hostname found");
if ((xml.match(/https:\/\/neven\.bar\//g) || []).length < 100) errors.push("Too few canonical site URLs");
if ((xml.match(/\/(en|de|ar)\/blog\/[^<]+/g) || []).length !== 69) errors.push("Expected 69 multilingual Blog article URLs");
if (/(?:&(?!amp;|lt;|gt;|quot;|apos;))/.test(xml)) errors.push("Found unescaped XML ampersand");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Sitemap validation passed");
