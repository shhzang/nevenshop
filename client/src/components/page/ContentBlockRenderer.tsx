import { useTranslations } from '../../hooks/useTranslations';
import NvImageCarousel from '../ui/NvImageCarousel';
import ProductInquiry from '../product/ProductInquiry';
import type { ContentBlock } from '../../../../shared/nevenshop-types';

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlock key={i} block={block} />
      ))}
    </>
  );
}

function blockText(block: ContentBlock, attrKey: string): string {
  const fromAttr = (block.attrs as any)?.[attrKey];
  if (fromAttr) return String(fromAttr);
  if (block.children) {
    return block.children
      .filter((c) => c.type === 'text')
      .map((c) => c.content || '')
      .join('');
  }
  return '';
}

function childrenToHtml(children: ContentBlock[]): string {
  return children
    .map((c) => {
      if (c.type === 'text') return c.content || '';
      return '';
    })
    .join('');
}

function fixUrl(url: string): string {
  if (!url) return '#';
  return url
    // Handle http://localhost/goods.nevenshop.com/products/... → /products/...
    .replace(/^https?:\/\/[^\/]+\/goods\.nevenshop\.com/, '')
    // Handle /wp-content/uploads/ → /uploads/
    .replace(/\/wp-content\/uploads\//, '/uploads/')
    // Handle /wp-content/manus-storage/ → /manus-storage/
    .replace(/\/wp-content\/manus-storage\//, '/manus-storage/');
}

function RenderBlock({ block }: { block: ContentBlock }) {
  const { t } = useTranslations();
  const { type, attrs, children, content } = block;

  switch (type) {
    case 'text':
      return content ? <span dangerouslySetInnerHTML={{ __html: content }} /> : null;

    case 'container':
    case 'fusion_builder_container': {
      const isFlex = attrs.type === 'flex';
      const isFullWidth = attrs.hundred_percent === 'yes';
      const bgColor = attrs.background_color || 'transparent';
      const rawBgImage: string = attrs.background_image || '';
      const bgImage = rawBgImage ? fixUrl(rawBgImage) : '';
      const padding = attrs.padding_top || attrs.padding_right
        ? `${attrs.padding_top || '0'} ${attrs.padding_right || '0'} ${attrs.padding_bottom || '0'} ${attrs.padding_left || '0'}`
        : undefined;
      const margin = attrs.margin_top || attrs.margin_bottom
        ? `${attrs.margin_top || '0'} 0 ${attrs.margin_bottom || '0'}`
        : undefined;
      const inner = children?.map((child, i) => (
        <RenderBlock key={i} block={child} />
      ));
      return (
        <div
          style={{
            background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bgColor,
            padding: padding || (isFlex ? undefined : '60px 0'),
            margin,
            ...(isFlex ? { display: 'flex', flexWrap: 'wrap' as const } : {}),
          }}
        >
          {isFullWidth ? inner : <div className="container-site">{inner}</div>}
        </div>
      );
    }

    case 'fusion_builder_row':
    case 'fusion_builder_row_inner':
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '0 -15px' }}>
          {children?.map((child, i) => (
            <RenderBlock key={i} block={child} />
          ))}
        </div>
      );

    case 'fusion_builder_column':
    case 'fusion_builder_column_inner': {
      const size = attrs.type || '1_1';
      const widthMap: Record<string, string> = {
        '1_1': '100%', '1_2': '50%', '1_3': '33.333%', '2_3': '66.667%',
        '1_4': '25%', '3_4': '75%', '1_5': '20%', '2_5': '40%',
        '3_5': '60%', '4_5': '80%', '1_6': '16.667%', '5_6': '83.333%',
      };
      const width = widthMap[size] || (/^\d+(\.\d+)?$/.test(size) ? `${parseFloat(size)}%` : '100%');
      return (
        <div style={{ width, padding: '0 15px', boxSizing: 'border-box' }}>
          {children?.map((child, i) => (
            <RenderBlock key={i} block={child} />
          ))}
        </div>
      );
    }

    case 'fusion_title': {
      const text = blockText(block, 'text_content');
      return (
        <RenderHeading
          size={attrs.size || 'h2'}
          content={text}
          color={attrs.text_color || 'var(--color-awb-7)'}
          align={(attrs.content_alignment as React.CSSProperties['textAlign']) || 'left'}
          marginTop={attrs.margin_top}
          marginBottom={attrs.margin_bottom}
        />
      );
    }

    case 'fusion_text': {
      const text = blockText(block, 'text_content') || childrenToHtml(children || []);
      return (
        <div
          style={{ marginBottom: 20 }}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }

    case 'fusion_button': {
      const text = blockText(block, 'text') || t('Learn More');
      const href = fixUrl(attrs.link || '#');
      return (
        <div style={{ textAlign: (attrs.alignment || 'left') as React.CSSProperties['textAlign'], margin: '16px 0' }}>
          <a
            href={href}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 32px',
              background: 'var(--color-awb-4)',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 6,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: 14,
              fontFamily: 'var(--font-ui)',
              transition: 'opacity 0.2s',
            }}
          >
            {text}
          </a>
        </div>
      );
    }

    case 'fusion_breadcrumbs':
      return (
        <nav
          style={{
            fontSize: 14,
            color: 'var(--color-awb-8)',
            marginTop: attrs.margin_top || '30px',
            marginBottom: attrs.margin_bottom || '15px',
          }}
          aria-label="Breadcrumb"
        >
          {attrs.prefix ? attrs.prefix + ' ' : ''}
          <a href="/" style={{ color: 'var(--color-awb-4)', textDecoration: 'none' }}>{t('Home')}</a>
          <span style={{ margin: '0 5px' }}>{attrs.separator || ' /'}</span>
          <span style={{ color: 'var(--color-awb-6)' }}>{t('Products')}</span>
        </nav>
      );

    case 'fusion_table':
      return (
        <div
          style={{ margin: '20px 0', overflowX: 'auto' }}
          dangerouslySetInnerHTML={{ __html: blockText(block, 'table_content') || childrenToHtml(children || []) }}
        />
      );

    case 'fusion_form':
      return (
        <div style={{ margin: '30px 0', padding: 30, background: 'var(--color-awb-2)', borderRadius: 8 }}>
          <ProductInquiry productTitle={attrs.product_title} />
        </div>
      );

    case 'fusion_imageframe':
    case 'fusion_image': {
      const src = attrs.src || fixUrl(attrs.element_content || '');
      if (!src) return null;
      const link = attrs.link ? fixUrl(attrs.link) : null;
      const img = (
        <img
          src={src}
          alt={attrs.alt || ''}
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: attrs.border_radius || 0,
            display: 'block',
            margin: attrs.alignment === 'center' ? '0 auto' : undefined,
          }}
        />
      );
      return (
        <div style={{ margin: '16px 0' }}>
          {link ? (
            <a href={link} target={attrs.link_target || '_self'} rel="noopener noreferrer">
              {img}
            </a>
          ) : img}
        </div>
      );
    }

    case 'fusion_images':
    case 'fusion_gallery': {
      const imageList: string[] = [];
      const linkList: string[] = [];
      if (attrs.images) {
        const pairs = attrs.images.split('|');
        for (const pair of pairs) {
          const [imgUrl, linkUrl] = pair.split(',');
          if (imgUrl) imageList.push(fixUrl(imgUrl.trim()));
          if (linkUrl) linkList.push(fixUrl(linkUrl.trim()));
        }
      }
      if (imageList.length === 0 && children) {
        for (const child of children) {
          const src = child.attrs?.src || fixUrl(child.attrs?.element_content || '');
          if (src) {
            imageList.push(src);
            // Extract link from child attrs (push empty string if no link to keep arrays aligned)
            const link = child.attrs?.link ? fixUrl(child.attrs.link) : '';
            linkList.push(link);
          }
        }
      }
      if (imageList.length === 0) return null;
      const cols = parseInt(attrs.columns || attrs.column_spacing || '1') || 1;
      if (cols === 1) {
        // Single column (hero/banner) - constrain width to 70% and center
        return (
          <div style={{ maxWidth: '70%', margin: '0 auto' }}>
            <NvImageCarousel
              images={imageList}
              links={linkList}
              autoPlay={attrs.autoplay === 'yes'}
              interval={parseInt(attrs.interval || '4000')}
              showNav={true}
              showDots={true}
            />
          </div>
        );
      }
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 10,
            margin: '20px 0',
          }}
        >
          {imageList.map((src, i) => {
            const link = linkList[i];
            const img = <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
            return (
              <div key={i} style={{ aspectRatio: '1', background: 'var(--color-awb-2)', borderRadius: 4, overflow: 'hidden' }}>
                {link ? (
                  <a href={link} style={{ display: 'block', width: '100%', height: '100%' }}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </div>
            );
          })}
        </div>
      );
    }

    case 'fusion_slider':
    case 'fusion_revolution_slider': {
      const slides: string[] = [];
      if (children) {
        for (const child of children) {
          const src = child.attrs?.src || fixUrl(child.attrs?.background || child.attrs?.image || '');
          if (src) slides.push(src);
        }
      }
      if (slides.length === 0) return null;
      return (
        <NvImageCarousel
          images={slides}
          autoPlay={true}
          interval={5000}
          showNav={true}
          showDots={true}
        />
      );
    }

    case 'fusion_woo_product_slider':
    case 'fusion_products_slider': {
      const images: string[] = [];
      const links: string[] = [];
      if (children) {
        for (const child of children) {
          const src = child.attrs?.src || fixUrl(child.attrs?.thumbnail || '');
          if (src) {
            images.push(src);
            if (child.attrs?.link) links.push(fixUrl(child.attrs.link));
          }
        }
      }
      if (images.length === 0) return null;
      return (
        <NvImageCarousel
          images={images}
          links={links}
          columns={parseInt(attrs.columns || '3')}
          autoPlay={false}
          showNav={true}
          showDots={true}
        />
      );
    }

    case 'fusion_separator': {
      const style = attrs.style || 'single';
      return (
        <div style={{ margin: `${attrs.top_margin || '20px'} 0 ${attrs.bottom_margin || '20px'}` }}>
          <hr style={{
            border: 'none',
            borderTop: style === 'double' ? '3px double var(--color-awb-3)' : '1px solid var(--color-awb-3)',
          }} />
        </div>
      );
    }

    case 'fusion_spacer':
      return <div style={{ height: attrs.height || '20px' }} />;

    case 'fusion_alert': {
      const colorMap: Record<string, string> = {
        success: '#d4edda',
        info: '#d1ecf1',
        warning: '#fff3cd',
        danger: '#f8d7da',
      };
      const bg = colorMap[attrs.type] || colorMap.info;
      return (
        <div style={{ background: bg, padding: '12px 20px', borderRadius: 6, margin: '16px 0', fontSize: 14 }}>
          {blockText(block, 'text_content') || childrenToHtml(children || [])}
        </div>
      );
    }

    case 'fusion_checklist': {
      const items = (attrs.items || '').split('|').filter(Boolean);
      return (
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
          {items.map((item: string, i: number) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 15 }}>
              <span style={{ color: 'var(--color-awb-4)', marginTop: 2 }}>✓</span>
              <span>{item.trim()}</span>
            </li>
          ))}
        </ul>
      );
    }

    case 'fusion_icon': {
      return (
        <div style={{ textAlign: (attrs.alignment as React.CSSProperties['textAlign']) || 'left', margin: '12px 0' }}>
          <span style={{ fontSize: parseInt(attrs.size || '24'), color: attrs.color || 'var(--color-awb-4)' }}>
            {attrs.icon || '●'}
          </span>
        </div>
      );
    }

    case 'fusion_imageframe_group':
    case 'fusion_image_before_after':
      if (children && children.length > 0) {
        return (
          <div style={{ margin: '20px 0' }}>
            {children.map((child, i) => <RenderBlock key={i} block={child} />)}
          </div>
        );
      }
      return null;

    case 'fusion_grid': {
      const cols = parseInt(attrs.columns || '3');
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: 10,
            margin: '20px 0',
          }}
        >
          {attrs.image_ids?.split(',').map((id: string) => (
            <div key={id} style={{ aspectRatio: '1', background: 'var(--color-awb-2)', borderRadius: 4, overflow: 'hidden' }}>
              <img src={`/uploads/${id}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      );
    }

    case 'fusion_tagline_box':
      return (
        <div
          style={{
            background: attrs.backgroundcolor || 'var(--color-awb-4)',
            color: attrs.textcolor || '#fff',
            padding: '40px',
            borderRadius: 8,
            margin: '30px 0',
            textAlign: (attrs.alignment as React.CSSProperties['textAlign']) || 'center',
          }}
        >
          <h3 style={{ color: 'inherit', marginBottom: 12 }}>{attrs.title || ''}</h3>
          <p style={{ marginBottom: 20, opacity: 0.9 }}>{attrs.description || ''}</p>
          {attrs.button && (
            <a
              href={attrs.link || '#'}
              style={{
                display: 'inline-block',
                padding: '10px 28px',
                border: '2px solid #fff',
                color: '#fff',
                borderRadius: 6,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              {attrs.button}
            </a>
          )}
        </div>
      );

    case 'fusion_tabs':
      return (
        <div style={{ margin: '30px 0' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-awb-3)', marginBottom: 20, overflowX: 'auto' }}>
            {(block as any).tabs?.map((tab: any, i: number) => (
              <div key={i} style={{ padding: '10px 20px', fontWeight: 600, fontSize: 14, borderBottom: '2px solid var(--color-awb-4)', whiteSpace: 'nowrap' }}>
                {tab.attrs.title || `${t('Tab')} ${i + 1}`}
              </div>
            ))}
          </div>
          {(block as any).tabs?.map((tab: any, i: number) => (
            <div key={i} style={{ display: i === 0 ? 'block' : 'none' }}>
              {tab.children?.map((child: ContentBlock, j: number) => (
                <RenderBlock key={j} block={child} />
              ))}
            </div>
          ))}
        </div>
      );

    case 'fusion_content_boxes':
    case 'fusion_flip_boxes':
      return (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
            gap: 20,
            margin: '30px 0',
          }}
        >
          {children?.map((child, i) => (
            <div key={i} style={{ padding: 30, background: 'var(--color-awb-2)', borderRadius: 8, textAlign: 'center' }}>
              {child.attrs.icon && <div style={{ fontSize: 36, marginBottom: 12 }}>{child.attrs.icon}</div>}
              <h4 style={{ marginBottom: 8, fontSize: 18 }}>{child.attrs.title || ''}</h4>
              <p style={{ fontSize: 14, color: 'var(--color-awb-6)' }}>{child.attrs.content || ''}</p>
            </div>
          ))}
        </div>
      );

    case 'fusion_code':
      return (
        <div
          style={{ margin: '20px 0' }}
          dangerouslySetInnerHTML={{ __html: attrs.code || '' }}
        />
      );

    default:
      if (children && children.length > 0) {
        return (
          <div style={{ margin: '16px 0' }}>
            {children.map((child, i) => (
              <RenderBlock key={i} block={child} />
            ))}
          </div>
        );
      }
      return null;
  }
}

function RenderHeading({ size, content, color, align, marginTop, marginBottom }: {
  size: string; content: string; color: string; align: string; marginTop?: string; marginBottom?: string;
}) {
  const style: React.CSSProperties = {
    color,
    textAlign: align as React.CSSProperties['textAlign'],
    marginTop: marginTop || undefined,
    marginBottom: marginBottom || '16px',
  };
  if (!content) return null;
  if (size === '1' || size === 'h1') return <h1 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  if (size === '3' || size === 'h3') return <h3 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  if (size === '4' || size === 'h4') return <h4 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  if (size === '5' || size === 'h5') return <h5 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  if (size === '6' || size === 'h6') return <h6 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
  return <h2 style={style} dangerouslySetInnerHTML={{ __html: content }} />;
}
