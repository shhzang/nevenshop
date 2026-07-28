/**
 * Analytics Event Tracking Module
 * Integrates with Manus Umami analytics for custom event tracking
 */

/**
 * Track a custom event in Umami analytics
 * @param eventName - Name of the event (e.g., "product_click", "email_contact")
 * @param eventData - Optional event data object
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    const w = window as any;
    if (w.umami && typeof w.umami.track === 'function') {
      try {
        w.umami.track(eventName, eventData);
      } catch (error) {
        console.warn('Failed to track event:', eventName, error);
      }
    }
  }
}

/**
 * Product Events
 */
export const productEvents = {
  // Track when user views a product
  viewProduct: (productId: string, productName: string, category: string) => {
    trackEvent('product_view', {
      product_id: productId,
      product_name: productName,
      category: category,
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user clicks on a product
  clickProduct: (productId: string, productName: string, source: string) => {
    trackEvent('product_click', {
      product_id: productId,
      product_name: productName,
      source: source, // e.g., "home", "products_page", "blog"
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user adds product to cart (if applicable)
  addToCart: (productId: string, productName: string, quantity: number) => {
    trackEvent('add_to_cart', {
      product_id: productId,
      product_name: productName,
      quantity: quantity,
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user views product details
  viewProductDetails: (productId: string, productName: string) => {
    trackEvent('product_details_view', {
      product_id: productId,
      product_name: productName,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Contact Events
 */
export const contactEvents = {
  // Track when user clicks email contact button
  emailContactClick: (source: string) => {
    trackEvent('email_contact_click', {
      source: source, // e.g., "home", "products", "blog", "footer"
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user opens email client
  emailContactOpen: (source: string) => {
    trackEvent('email_contact_open', {
      source: source,
      email: 'neven6000@gmail.com',
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user submits contact form (if applicable)
  contactFormSubmit: (formData?: Record<string, any>) => {
    trackEvent('contact_form_submit', {
      ...formData,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Social Share Events
 */
export const socialEvents = {
  // Track when user clicks share button
  shareClick: (platform: string, source: string) => {
    trackEvent('social_share_click', {
      platform: platform, // e.g., "facebook", "twitter", "linkedin", "instagram"
      source: source, // e.g., "home", "products", "blog"
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user shares via native share (mobile)
  nativeShare: (platform: string, source: string) => {
    trackEvent('native_share', {
      platform: platform,
      source: source,
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user copies share link
  copyShareLink: (source: string) => {
    trackEvent('copy_share_link', {
      source: source,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Blog Events
 */
export const blogEvents = {
  // Track when user views blog article
  viewBlogArticle: (articleId: string, articleTitle: string, category: string) => {
    trackEvent('blog_view', {
      article_id: articleId,
      article_title: articleTitle,
      category: category,
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user scrolls through blog article
  scrollBlogArticle: (articleId: string, scrollPercentage: number) => {
    trackEvent('blog_scroll', {
      article_id: articleId,
      scroll_percentage: scrollPercentage,
      timestamp: new Date().toISOString(),
    });
  },

  // Track when user clicks blog article link
  clickBlogLink: (articleId: string, articleTitle: string, source: string) => {
    trackEvent('blog_click', {
      article_id: articleId,
      article_title: articleTitle,
      source: source,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Conversion Funnel Events
 */
export const conversionEvents = {
  // Stage 1: Product Discovery
  discoverProduct: (productId: string, productName: string, source: string) => {
    trackEvent('funnel_discover_product', {
      product_id: productId,
      product_name: productName,
      source: source,
      funnel_stage: 'discovery',
      timestamp: new Date().toISOString(),
    });
  },

  // Stage 2: Product Interest
  showProductInterest: (productId: string, productName: string, timeSpent: number) => {
    trackEvent('funnel_product_interest', {
      product_id: productId,
      product_name: productName,
      time_spent_seconds: timeSpent,
      funnel_stage: 'interest',
      timestamp: new Date().toISOString(),
    });
  },

  // Stage 3: Contact Intent
  showContactIntent: (productId: string, source: string) => {
    trackEvent('funnel_contact_intent', {
      product_id: productId,
      source: source,
      funnel_stage: 'contact_intent',
      timestamp: new Date().toISOString(),
    });
  },

  // Stage 4: Contact Action
  initiateContact: (method: string, productId?: string) => {
    trackEvent('funnel_contact_action', {
      contact_method: method, // e.g., "email", "form", "whatsapp"
      product_id: productId,
      funnel_stage: 'contact_action',
      timestamp: new Date().toISOString(),
    });
  },

  // Stage 5: Contact Completion (if applicable)
  completeContact: (method: string, productId?: string) => {
    trackEvent('funnel_contact_complete', {
      contact_method: method,
      product_id: productId,
      funnel_stage: 'contact_complete',
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Page View Events
 */
export const pageEvents = {
  // Track page view with custom data
  viewPage: (pageName: string, pageUrl: string, language: string) => {
    trackEvent('page_view', {
      page_name: pageName,
      page_url: pageUrl,
      language: language,
      timestamp: new Date().toISOString(),
    });
  },

  // Track user engagement time on page
  engagementTime: (pageName: string, timeSpent: number) => {
    trackEvent('engagement_time', {
      page_name: pageName,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * User Interaction Events
 */
export const interactionEvents = {
  // Track button clicks
  buttonClick: (buttonName: string, buttonType: string, source: string) => {
    trackEvent('button_click', {
      button_name: buttonName,
      button_type: buttonType,
      source: source,
      timestamp: new Date().toISOString(),
    });
  },

  // Track form interactions
  formInteraction: (formName: string, fieldName: string, action: string) => {
    trackEvent('form_interaction', {
      form_name: formName,
      field_name: fieldName,
      action: action, // e.g., "focus", "change", "blur"
      timestamp: new Date().toISOString(),
    });
  },

  // Track language change
  languageChange: (fromLanguage: string, toLanguage: string) => {
    trackEvent('language_change', {
      from_language: fromLanguage,
      to_language: toLanguage,
      timestamp: new Date().toISOString(),
    });
  },
};
