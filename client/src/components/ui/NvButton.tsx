import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function NvButton({
  variant = 'primary',
  size = 'md',
  children,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    lineHeight: 1.2,
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    letterSpacing: '0.03em',
    ...(size === 'sm' ? { padding: '8px 18px', fontSize: 13 } :
        size === 'lg' ? { padding: '17px 40px', fontSize: 16 } :
        { padding: '13px 29px', fontSize: 14 }),
    ...(variant === 'primary'
      ? { background: 'var(--color-awb-4)', color: '#fff' }
      : { background: 'transparent', color: 'var(--color-awb-6)', border: '2px solid var(--color-awb-3)' }),
    ...style,
  };

  return (
    <button
      {...props}
      style={baseStyle}
      onMouseOver={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = 'var(--color-awb-5)';
        } else {
          e.currentTarget.style.borderColor = 'var(--color-awb-4)';
          e.currentTarget.style.color = 'var(--color-awb-4)';
        }
        props.onMouseOver?.(e);
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.background = 'var(--color-awb-4)';
        } else {
          e.currentTarget.style.borderColor = 'var(--color-awb-3)';
          e.currentTarget.style.color = 'var(--color-awb-6)';
        }
        props.onMouseOut?.(e);
      }}
    >
      {children}
    </button>
  );
}
