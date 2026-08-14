import { Facebook, Instagram, Twitter, Linkedin, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { socialEvents } from '@/lib/analytics';
import { SITE_CONTACT, SOCIAL_SHARE_URLS } from '@shared/contact-info';

interface SocialShareBarProps {
  url?: string;
  title?: string;
  description?: string;
  variant?: 'inline' | 'block' | 'floating' | 'vertical';
  className?: string;
  showLabels?: boolean;
}

export default function SocialShareBar({
  url = typeof window !== 'undefined' ? window.location.href : '',
  title = 'Check out NEVEN Premium Disposable Vapes',
  description = 'Premium NEVEN disposable vapes with exceptional flavor and quality',
  variant = 'inline',
  className = '',
  showLabels = false,
}: SocialShareBarProps) {
  const socialLinks = {
    facebook: SOCIAL_SHARE_URLS.facebook(url),
    twitter: SOCIAL_SHARE_URLS.twitter(url, title),
    linkedin: SOCIAL_SHARE_URLS.linkedin(url),
    instagram: SITE_CONTACT.social.instagram,
  };

  const handleShare = (platform: string, link: string) => {
    socialEvents.shareClick(platform, variant);
    if (platform === 'instagram') {
      window.open(link, '_blank', 'width=600,height=600');
    } else {
      window.open(link, '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        socialEvents.nativeShare('native', variant);
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const shareButtons = [
    {
      icon: Facebook,
      label: 'Facebook',
      onClick: () => handleShare('facebook', socialLinks.facebook),
      color: 'hover:text-blue-600',
      platform: 'facebook',
    },
    {
      icon: Twitter,
      label: 'Twitter',
      onClick: () => handleShare('twitter', socialLinks.twitter),
      color: 'hover:text-blue-400',
      platform: 'twitter',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      onClick: () => handleShare('linkedin', socialLinks.linkedin),
      color: 'hover:text-blue-700',
      platform: 'linkedin',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      onClick: () => handleShare('instagram', socialLinks.instagram),
      color: 'hover:text-pink-600',
      platform: 'instagram',
    },
  ];

  if (variant === 'floating') {
    return (
      <div
        className={`fixed bottom-6 left-6 z-40 flex flex-col gap-2 ${className}`}
      >
        <div className="bg-white rounded-full shadow-lg p-2 flex flex-col gap-2">
          {shareButtons.map((btn) => (
            <Tooltip key={btn.label}>
              <TooltipTrigger asChild>
                <Button
                  onClick={btn.onClick}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full ${btn.color} transition-colors`}
                  title={btn.label}
                >
                  <btn.icon className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{btn.label}</TooltipContent>
            </Tooltip>
          ))}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleNativeShare}
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:text-primary transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Share</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div
        className={`flex flex-col gap-2 ${className}`}
      >
        <span className="text-sm font-semibold text-gray-600">Share:</span>
        <div className="flex flex-col gap-2">
          {shareButtons.map((btn) => (
            <Button
              key={btn.label}
              onClick={btn.onClick}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'block') {
    return (
      <div
        className={`bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border border-primary/20 ${className}`}
      >
        <h3 className="text-lg font-semibold mb-4">Share This</h3>
        <div className="flex flex-wrap gap-3">
          {shareButtons.map((btn) => (
            <Tooltip key={btn.label}>
              <TooltipTrigger asChild>
                <Button
                  onClick={btn.onClick}
                  variant="outline"
                  size="sm"
                  className={`gap-2 ${btn.color}`}
                >
                  <btn.icon className="w-4 h-4" />
                  {showLabels && btn.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{btn.label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  // Default inline variant
  return (
    <div
      className={`flex items-center gap-2 flex-wrap ${className}`}
    >
      <span className="text-sm font-semibold text-gray-600">Share:</span>
      {shareButtons.map((btn) => (
        <Tooltip key={btn.label}>
          <TooltipTrigger asChild>
            <Button
              onClick={btn.onClick}
              variant="ghost"
              size="icon"
              className={`${btn.color} transition-colors`}
              title={btn.label}
            >
              <btn.icon className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{btn.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
