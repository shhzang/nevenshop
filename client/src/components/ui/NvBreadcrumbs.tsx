import { Link } from 'wouter';
import { useLanguage } from '../../hooks/useTranslations';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function NvBreadcrumbs({ items }: BreadcrumbsProps) {
  const { currentLang } = useLanguage();
  return (
    <nav
      style={{
        fontSize: 14,
        color: 'var(--color-awb-6)',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 4,
      }}
      aria-label="Breadcrumb"
    >
      {items.map((item, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {i > 0 && <span style={{ color: 'var(--color-awb-3)', margin: '0 2px' }}>/</span>}
          {item.path ? (
            <Link
              to={item.path === '/' ? `/${currentLang}` : `/${currentLang}${item.path}`}
              style={{ color: 'var(--color-awb-4)', textDecoration: 'none' }}
            >
              {item.label}
            </Link>
          ) : (
            <span style={{ color: 'var(--color-awb-6)' }}>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
