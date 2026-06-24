import { useState } from 'react';
import { useTranslations } from '../../hooks/useTranslations';
import NvButton from '../ui/NvButton';

interface ProductInquiryProps {
  productTitle?: string;
}

export default function ProductInquiry({ productTitle }: ProductInquiryProps) {
  const { t } = useTranslations();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          message: form.get('message'),
          product: productTitle,
        }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const data = await res.json();
        alert(data.error || t('Submission failed. Please try again.'));
      }
    } catch {
      alert(t('Submission failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ background: 'var(--color-awb-2)', borderRadius: 8, padding: 40, textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-awb-4)' }}>{t('Thank you for your inquiry!')}</h3>
        <p>{t('We will get back to you within 24 hours.')}</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-awb-2)', borderRadius: 8, padding: 40 }}>
      <h3 style={{ marginBottom: 8 }}>{t('SEND EMAIL TO US')}</h3>
      <p style={{ color: 'var(--color-awb-6)', marginBottom: 24, fontSize: 14 }}>
        {t('Interested in bulk orders or have questions? Send us a message.')}
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>{t('Name *')}</label>
            <input name="name" required style={inputStyle} placeholder={t('Your name')} />
          </div>
          <div>
            <label style={labelStyle}>{t('Email *')}</label>
            <input name="email" type="email" required style={inputStyle} placeholder="your@email.com" />
          </div>
        </div>
        <div>
          <label style={labelStyle}>{t('Phone')}</label>
          <input name="phone" style={inputStyle} placeholder="+1 (555) 000-0000" />
        </div>
        <div>
          <label style={labelStyle}>{t('Message *')}</label>
          <textarea name="message" required rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder={t('Tell us about your requirements...')} />
        </div>
        <NvButton type="submit" size="lg" disabled={loading}>
          {loading ? t('Sending...') : t('SEND INQUIRY')}
        </NvButton>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 14,
  fontWeight: 500,
  marginBottom: 4,
  color: 'var(--color-awb-6)',
  fontFamily: 'var(--font-ui)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--color-awb-3)',
  borderRadius: 6,
  fontSize: 14,
  fontFamily: 'var(--font-primary)',
  background: '#fff',
  boxSizing: 'border-box',
};
