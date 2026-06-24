import { useLanguage } from '../../hooks/useTranslations';
import NvHeader from './NvHeader';
import NvFooter from './NvFooter';

interface NvLayoutProps {
  children: React.ReactNode;
}

export default function NvLayout({ children }: NvLayoutProps) {
  const { dir } = useLanguage();
  return (
    <div dir={dir} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NvHeader />
      <main style={{ flex: 1, paddingTop: 'var(--header-height)' }}>
        {children}
      </main>
      <NvFooter />
    </div>
  );
}
