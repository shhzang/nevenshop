import { Link } from 'wouter';
import { useLanguage, useTranslations } from '../hooks/useTranslations';

export default function NvNotFoundPage() {
  const { currentLang } = useLanguage();
  const { t } = useTranslations();

  return (
    <div style={{ textAlign: 'center', padding: '120px 30px' }}>
      <h1 style={{ fontSize: 72, color: 'var(--color-awb-3)', marginBottom: 16 }}>404</h1>
      <p style={{ fontSize: 18, marginBottom: 32, color: 'var(--color-awb-6)' }}>
        {t("The page you're looking for doesn't exist.")}
      </p>
      <Link
        to={`/${currentLang}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '13px 29px',
          background: 'var(--color-awb-4)',
          color: '#fff',
          fontWeight: 600,
          borderRadius: 4,
          textDecoration: 'none',
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
        }}
      >
        {t('Back to Home')}
      </Link>
    </div>
  );
}
