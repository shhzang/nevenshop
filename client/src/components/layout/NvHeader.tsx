import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { LANGUAGES, localizePath } from '../../lib/i18n';
import { useLanguage, useTranslations } from '../../hooks/useTranslations';
import type { Lang } from '../../../../shared/nevenshop-types';

const LOGO_BLACK = '/manus-storage/logo-black_f44d892e.png';
const FLAG_URLS: Record<Lang, string> = {
  en: '/manus-storage/en_ba0434c4.png',
  de: '/manus-storage/de_8f6f1e8e.png',
  ar: '/manus-storage/ar_3f88be52.png',
};

export default function NvHeader() {
  const { currentLang } = useLanguage();
  const { t } = useTranslations();
  const [location] = useLocation();

  const NAV_ITEMS = [
    { label: t('Home'), path: '/' },
    { label: t('Products'), path: '/products' },
    { label: t('Blog'), path: '/blog' },
    { label: t('FAQS'), path: '/page/faq' },
    { label: t('About Us'), path: '/page/about-us' },
    { label: t('Contact Us'), path: '/page/contact' },
  ];

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const isActive = (itemPath: string) => {
    if (itemPath === '/') return location === `/${currentLang}` || location === `/${currentLang}/`;
    return location.startsWith(`/${currentLang}${itemPath}`);
  };

  const switchLang = (code: Lang) => {
    const newPath = localizePath(location, code);
    window.location.href = newPath;
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20000,
        background: 'var(--header-bg)',
        padding: 'var(--header-padding) 0',
        transition: 'all var(--transition-normal)',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: 1248,
          margin: '0 auto',
          padding: '0 var(--content-padding)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ flex: '0 0 auto', maxWidth: 225 }}>
          <Link to={`/${currentLang}`} style={{ display: 'block' }}>
            <img
              src={LOGO_BLACK}
              alt="NevenShopper"
              style={{ width: 'var(--logo-width)', height: 'auto' }}
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 35,
            flex: '1 1 auto',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const href = `/${currentLang}${item.path === '/' ? '' : item.path}`;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={href}
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 15,
                  fontWeight: 400,
                  color: active ? 'var(--color-awb-4)' : 'var(--color-awb-6)',
                  textDecoration: 'none',
                  paddingBottom: 4,
                  borderBottom: active ? '2px solid var(--color-awb-4)' : '2px solid transparent',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to={`/${currentLang}/page/download`}
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
              fontWeight: 400,
              color: isActive('/page/download') ? 'var(--color-awb-4)' : 'var(--color-awb-6)',
              textDecoration: 'none',
              paddingBottom: 4,
              borderBottom: isActive('/page/download')
                ? '2px solid var(--color-awb-4)'
                : '2px solid transparent',
              transition: 'all var(--transition-fast)',
            }}
          >
            {t('Support')}
          </Link>
        </nav>

        {/* Language Switcher */}
        <div ref={langRef} className="desktop-lang" style={{ flex: '0 0 auto', position: 'relative' }}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'none',
              border: '1px solid var(--color-awb-3)',
              borderRadius: 4,
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              color: 'var(--color-awb-6)',
            }}
          >
            <img
              src={FLAG_URLS[currentLang]}
              alt={currentLang}
              style={{ width: 18, height: 12, objectFit: 'cover' }}
            />
            {currentLang.toUpperCase()}
            <span style={{ fontSize: 10 }}>▼</span>
          </button>
          {langOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                background: '#fff',
                borderRadius: 4,
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                minWidth: 140,
                overflow: 'hidden',
                zIndex: 100,
              }}
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    switchLang(l.code);
                    setLangOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    padding: '10px 16px',
                    background: l.code === currentLang ? 'var(--color-awb-2)' : '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 14,
                    color: l.code === currentLang ? 'var(--color-awb-4)' : 'var(--color-awb-6)',
                    textAlign: 'left',
                  }}
                >
                  <img
                    src={FLAG_URLS[l.code]}
                    alt={l.native}
                    style={{ width: 18, height: 12, objectFit: 'cover' }}
                  />
                  {l.native}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            fontSize: 20,
            cursor: 'pointer',
            padding: 8,
            color: 'var(--color-awb-6)',
            fontFamily: 'var(--font-ui)',
          }}
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="mobile-menu"
          style={{
            background: '#fff',
            borderTop: '1px solid var(--color-awb-3)',
            padding: '0 var(--content-padding) 12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          }}
        >
          {NAV_ITEMS.map((item) => {
            const href = `/${currentLang}${item.path === '/' ? '' : item.path}`;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '12px 0',
                  fontSize: 16,
                  fontFamily: 'var(--font-ui)',
                  color: active ? 'var(--color-awb-4)' : 'var(--color-awb-7)',
                  borderBottom: '1px solid rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            to={`/${currentLang}/page/download`}
            onClick={() => setMobileOpen(false)}
            style={{
              display: 'block',
              padding: '12px 0',
              fontSize: 16,
              fontFamily: 'var(--font-ui)',
              color: 'var(--color-awb-7)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
              textAlign: 'center',
            }}
          >
            {t('Support')}
          </Link>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', padding: '12px 0' }}>
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  switchLang(l.code);
                  setMobileOpen(false);
                }}
                style={{
                  background: l.code === currentLang ? 'var(--color-awb-4)' : 'var(--color-awb-1)',
                  border: 'none',
                  color: l.code === currentLang ? '#fff' : 'var(--color-awb-6)',
                  padding: '6px 14px',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile nav styles are in index.css */}
    </header>
  );
}
