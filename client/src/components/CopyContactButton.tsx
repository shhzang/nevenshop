import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { copyText } from '@/lib/copy-to-clipboard';

interface CopyContactButtonProps {
  label: string;
  value: string;
  href: string;
  type: 'phone' | 'email';
}

export default function CopyContactButton({ label, value, href, type }: CopyContactButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const didCopy = await copyText(value);
    if (!didCopy) return;

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="footer-contact-item">
      <a className="footer-contact-link" href={href} aria-label={`${type === 'phone' ? 'Call' : 'Email'} ${value}`}>
        <span className="footer-contact-label">{label}</span>
        <span className="footer-contact-value">{value}</span>
      </a>
      <button
        type="button"
        className={`footer-copy-button${copied ? ' is-copied' : ''}`}
        onClick={handleCopy}
        aria-label={`Copy ${type}`}
        title={copied ? 'Copied' : `Copy ${type}`}
      >
        {copied ? <Check aria-hidden="true" size={15} /> : <Copy aria-hidden="true" size={15} />}
        <span className="footer-copy-status" role="status" aria-live="polite">
          {copied ? 'Copied' : 'Copy'}
        </span>
      </button>
    </div>
  );
}
