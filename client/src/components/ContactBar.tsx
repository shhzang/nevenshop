import { Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactBarProps {
  email?: string;
  phone?: string;
  variant?: 'inline' | 'block' | 'floating';
  className?: string;
}

export default function ContactBar({
  email = 'neven6000@gmail.com',
  phone,
  variant = 'inline',
  className = '',
}: ContactBarProps) {
  const handleEmailClick = () => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-6 right-6 z-40 flex flex-col gap-3 ${className}`}
      >
        <Button
          onClick={handleEmailClick}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title={`Email: ${email}`}
        >
          <Mail className="w-5 h-5 mr-2" />
          Email Us
        </Button>
        {phone && (
          <Button
            onClick={handlePhoneClick}
            size="lg"
            variant="outline"
            className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
            title={`Call: ${phone}`}
          >
            <Phone className="w-5 h-5 mr-2" />
            Call Us
          </Button>
        )}
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div
        className={`bg-gradient-to-r from-primary to-primary/80 text-white py-6 px-4 rounded-lg shadow-md ${className}`}
      >
        <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
        <div className="flex flex-col gap-3">
          <Button
            onClick={handleEmailClick}
            variant="secondary"
            className="w-full justify-start"
          >
            <Mail className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left">{email}</span>
          </Button>
          {phone && (
            <Button
              onClick={handlePhoneClick}
              variant="secondary"
              className="w-full justify-start"
            >
              <Phone className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">{phone}</span>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div
      className={`flex items-center gap-4 flex-wrap ${className}`}
    >
      <Button
        onClick={handleEmailClick}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Mail className="w-4 h-4" />
        {email}
      </Button>
      {phone && (
        <Button
          onClick={handlePhoneClick}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Phone className="w-4 h-4" />
          {phone}
        </Button>
      )}
    </div>
  );
}
