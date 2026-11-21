import json
from pathlib import Path

root = Path('/home/ubuntu/nevenshop')
blog_path = root / 'server/data/blog.json'
old = json.loads(blog_path.read_text())
new = []
# Reuse already stored, validated website cover assets so every new article has a working image.
images = []
for post in old:
    image = post.get('featured_image')
    if image and image not in images:
        images.append(image)
if not images:
    raise SystemExit('No existing featured images available')

for idx in range(1, 21):
    draft_path = root / f'.generated-blog-{idx:02d}.json'
    draft = json.loads(draft_path.read_text())
    post_id = 204 + idx
    seo = {}
    for lang, entry in draft['seo'].items():
        keywords = entry.get('keywords', '')
        if isinstance(keywords, list):
            keywords = ', '.join(str(x) for x in keywords)
        seo[lang] = {
            'title': str(entry['title']).strip(),
            'description': str(entry['description']).strip(),
            'keywords': str(keywords).strip(),
        }
    translations = {}
    for lang, entry in draft['translations'].items():
        translations[lang] = {
            'title': str(entry['title']).strip(),
            'excerpt': str(entry['excerpt']).strip(),
            'content': str(entry['content']).strip(),
        }
    new.append({
        'id': post_id,
        'slug': str(draft['slug']).strip(),
        'date': '2026-11-21',
        # One transparent editorial batch timestamp; not fabricated staggered times.
        'published_at': '2026-11-21T09:55:00Z',
        'featured_image': images[(idx - 1) % len(images)],
        'seo': seo,
        'translations': translations,
    })

if len({x['slug'] for x in old}) != len(old):
    raise SystemExit('Existing blog slugs are not unique')
if len({x['slug'] for x in new}) != len(new):
    raise SystemExit('New blog slugs are not unique')
if set(x['slug'] for x in old) & set(x['slug'] for x in new):
    raise SystemExit('New blog slug collides with existing content')

combined = old + new
combined.sort(key=lambda x: (x.get('date', ''), x.get('published_at', ''), f"{int(x['id']):012d}"), reverse=True)
blog_path.write_text(json.dumps(combined, ensure_ascii=False, indent=2) + '\n')
print(f'added={len(new)} total={len(combined)} first_ids={[x["id"] for x in combined[:5]]}')
print('new_ids', [x['id'] for x in new])
print('images_used', len(set(x['featured_image'] for x in new)))
