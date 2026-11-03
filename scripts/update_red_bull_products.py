import json
import subprocess
from pathlib import Path

path = Path('/home/ubuntu/nevenshop/server/data/products.json')
raw = subprocess.check_output(['git', 'show', 'HEAD:server/data/products.json']).decode('utf-8')
data = json.loads(raw)
images = {
    6165: '/manus-storage/red-bull-energy-vape-product_31b2d51e.webp',
    6166: '/manus-storage/red-bull-white-vape-product_3fcae653.webp',
}
products = {
    6165: {
        'title': 'NEVEN Red Bull 18000 Disposable Vape — Peach, Winter & Tropical Image-Verified Edition',
        'slug': 'neven-red-bull-18000-peach-winter-tropical-disposable-vape',
        'excerpt': 'Product-information page for the search phrase NEVEN Red Bull 18000. The supplied image visibly shows Red Bull-marked Peach, Winter and Tropical editions with an 1800-puff label; the 18000 specification, authorization and full technical data require manufacturer verification.',
        'de_title': 'NEVEN Red Bull 18000 Einweg-Vape — Peach, Winter & Tropical, bildgeprüfte Edition',
        'ar_title': 'NEVEN Red Bull 18000 — إصدارات الخوخ والشتاء والاستوائية موثقة بالصور',
        'flavor': 'Peach, Winter and Tropical editions',
        'visible': 'Peach, Winter and Tropical edition packaging, Red Bull marks, an “1800 puffs” label, energy-drink wording and French nicotine warnings.',
    },
    6166: {
        'title': 'NEVEN Red Bull 18000 Disposable Vape — White Edition Coconut Acai Image-Verified',
        'slug': 'neven-red-bull-18000-white-edition-coconut-acai-disposable-vape',
        'excerpt': 'Product-information page for the search phrase NEVEN Red Bull 18000. The supplied image visibly shows a White Edition device labelled coconut-acai and an 1800-puff claim; the 18000 specification, authorization and full technical data require manufacturer verification.',
        'de_title': 'NEVEN Red Bull 18000 Einweg-Vape — White Edition Kokosnuss-Açaí, bildgeprüft',
        'ar_title': 'NEVEN Red Bull 18000 — إصدار White Edition بنكهة جوز الهند وآساي موثق بالصورة',
        'flavor': 'White Edition; coconut-acai wording visible',
        'visible': 'a White Edition device, Red Bull marks, coconut-acai wording, energy-drink wording and a French nicotine warning.',
    },
}


def make_blocks(product, image):
    title = product['title']
    intro = (
        '<p><strong>Image-verified product information — not a manufacturer specification sheet or sales authorization.</strong></p>'
        f'<p>This page uses the search phrase <strong>NEVEN Red Bull 18000</strong> to identify the requested product record. The supplied photograph visibly shows {product["visible"]}</p>'
        '<p><strong>Important specification check:</strong> the supplied photograph visibly reads “1800 puffs”, not “18000 puffs”. A third-party listing for another 18,000-puff Red Bull-flavour device may mention features such as a rechargeable battery, LED display, Type-C charging or mesh coils, but those details must not be transferred to this NEVEN image without a matching manufacturer datasheet.</p>'
    )
    details = (
        '<p><strong>What is visible</strong></p><ul>'
        f'<li>Edition / flavour reference: {product["flavor"]}.</li>'
        '<li>Branding visible in the supplied image: Red Bull marks.</li>'
        '<li>Visible puff wording: 1800 puffs.</li>'
        '<li>Visible warning context: French nicotine warning text.</li>'
        '</ul>'
        '<p><strong>What still needs verification</strong></p><ul>'
        '<li>Manufacturer identity, batch number and written Red Bull trademark authorization.</li>'
        '<li>Actual nicotine strength, e-liquid volume, ingredients, caffeine or taurine content.</li>'
        '<li>Battery capacity, charging port, coil type, puff count and whether the device is rechargeable.</li>'
        '<li>Product notification, conformity, import and online-sales requirements in the destination country.</li>'
        '</ul>'
    )
    safety = (
        '<p><strong>Adult information and compliance note</strong></p>'
        '<p>Nicotine is addictive. Do not use an unverified device if the package, ingredients or nicotine concentration cannot be confirmed. Do not treat “Energy Drink” wording or a familiar logo as evidence of caffeine, taurine, energy, wellness or safety. The FDA has warned about unproven wellness claims for inhaled products and has raised specific concerns about inhaled caffeine products. Red Bull’s official website describes its energy-drink range; it does not verify this pictured vape.</p>'
        '<p>Before any commercial listing, obtain the original manufacturer file and check the local rules for the United States, each EU member state and the specific Middle East destination. This page is product information, not legal, medical or authenticity advice.</p>'
        '<p><a href="https://www.redbull.com/us-en/energydrink/products/red-bull-editions-energy-drinks" rel="nofollow">Red Bull official Editions information</a> · <a href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/eagle-energy-usa-inc-617712-12012021" rel="nofollow">FDA caffeine inhalation warning record</a> · <a href="https://corsearch.com/report-a-fake/red-bull" rel="nofollow">Red Bull fake-item reporting channel</a></p>'
    )

    def text_block(html):
        return {'type': 'fusion_text', 'attrs': {'text_content': html}, 'children': []}

    children = [
        {'type': 'fusion_breadcrumbs', 'attrs': {'separator': ' /', 'prefix': ''}},
        {'type': 'fusion_title', 'attrs': {'size': 'h1', 'text_content': title, 'margin_bottom': '16px'}, 'children': []},
        {'type': 'fusion_imageframe', 'attrs': {'src': image, 'alt': title}, 'children': []},
        text_block(intro),
        text_block(details),
        text_block(safety),
    ]
    return [{
        'type': 'container',
        'attrs': {'type': 'flex', 'hundred_percent': 'no', 'padding_top': '36px', 'padding_bottom': '36px', 'background_color': '#ffffff'},
        'children': [{
            'type': 'fusion_builder_row', 'attrs': {}, 'children': [{
                'type': 'fusion_builder_column', 'attrs': {'type': '1_1'}, 'children': children,
            }],
        }],
    }]

for product in data:
    if product['id'] not in products:
        continue
    info = products[product['id']]
    product['title'] = info['title']
    product['slug'] = info['slug']
    product['excerpt'] = info['excerpt']
    product['thumbnail'] = images[product['id']]
    product['images'] = [images[product['id']]]
    product['content_blocks'] = make_blocks(info, images[product['id']])
    product['translations'] = {
        'de': {info['title']: info['de_title']},
        'ar': {info['title']: info['ar_title']},
    }

start = raw.find('{\n  "id": 6165')
assert start >= 0
prefix = raw[:start].rstrip()
serialized = ',\n'.join(
    json.dumps(product, ensure_ascii=False, indent=2)
    for product in data[-2:]
)
path.write_text(prefix + '\n' + serialized + '\n]\n', encoding='utf-8')
print('updated:', [(p['id'], p['title'], p['slug']) for p in data[-2:]])
