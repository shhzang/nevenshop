import { Link } from 'wouter';
import { useLanguage, useTranslations } from '../../hooks/useTranslations';

const LOGO_BLACK = '/manus-storage/logo-black_f44d892e.png';

const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/nevenshopper',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nevenshopper/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@nevenshopper',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@nevenshopper',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/lisa-goldschmidt-19482435a/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:neven2000@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 010 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
];

export default function NvFooter() {
  const { currentLang } = useLanguage();
  const { t } = useTranslations();

  const QUICK_LINKS = [
    { label: t('Home'), path: '/' },
    { label: t('Products'), path: '/products' },
    { label: t('News'), path: '/page/news' },
    { label: t('About Us'), path: '/page/about-us' },
    { label: t('FAQS'), path: '/page/faq' },
    { label: t('Contact Us'), path: '/page/contact' },
    { label: t('Download'), path: '/page/download' },
    { label: t('Privacy Policy'), path: '/page/privacy-policy' },
  ];

  return (
    <footer style={{ background: '#e9e9e9', marginTop: 0 }}>
      <div
        style={{
          maxWidth: 'calc(1200px + 60px)',
          margin: '0 auto',
          padding: '50px 30px 10px',
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {/* Left Column: Logo + Social Icons */}
        <div
          style={{
            flex: '0 0 40%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: 20,
          }}
        >
          <div style={{ marginBottom: 36 }}>
            <img
              src={LOGO_BLACK}
              alt="NevenShopper"
              style={{ width: 200, height: 'auto' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  color: '#333',
                  background: 'transparent',
                  transition: 'all var(--transition-fast)',
                  fontSize: 18,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#65bc7b';
                  e.currentTarget.style.background = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#333';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Links */}
        <div style={{ flex: '0 0 60%', paddingTop: 20 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '8px 20px',
            }}
          >
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path === '/' ? `/${currentLang}` : `/${currentLang}${link.path}`}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 15,
                  color: 'var(--color-awb-6)',
                  padding: '6px 0',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div
        style={{
          borderTop: '1px solid rgba(0,0,0,0.08)',
          padding: '16px 30px',
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--color-awb-6)',
        }}
      >
        &copy; {new Date().getFullYear()} NevenShopper. {t('All rights reserved.')}
      </div>
    </footer>
  );
}
