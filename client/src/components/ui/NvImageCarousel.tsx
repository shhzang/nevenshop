import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageCarouselProps {
  images: string[];
  links?: string[];
  alt?: string;
  autoPlay?: boolean;
  interval?: number;
  showNav?: boolean;
  showDots?: boolean;
  columns?: number;
  aspectRatio?: string;
}

export default function NvImageCarousel({
  images,
  links = [],
  alt = '',
  autoPlay = true,
  interval = 4000,
  showNav = true,
  showDots = true,
  columns = 1,
  aspectRatio,
}: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [effColumns, setEffColumns] = useState(columns);
  const [containerW, setContainerW] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (columns <= 1) { setEffColumns(1); return; }
      const factor = w >= 1024 ? 1 : w >= 768 ? 0.66 : w >= 480 ? 0.5 : 1;
      setEffColumns(Math.max(1, Math.round(columns * factor)));
      // Measure container width for slide sizing
      if (containerRef.current) {
        setContainerW(containerRef.current.getBoundingClientRect().width);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [columns]);

  const safeColumns = Math.min(effColumns, images.length);
  const totalSlides = Math.ceil(images.length / safeColumns);
  const isHero = safeColumns === 1;

  // Banner images are 1920x640 (3:1), product images are ~1000x1000 (1:1)
  // On mobile, hero banners switch to 16/9 for better visibility
  const heroRatio = typeof window !== 'undefined' && window.innerWidth < 480 ? '16 / 9'
    : typeof window !== 'undefined' && window.innerWidth < 768 ? '2 / 1'
    : '3 / 1';
  const ratio = aspectRatio || (isHero ? heroRatio : '1 / 1');

  const goTo = useCallback((index: number) => {
    setCurrent((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || totalSlides <= 1) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, next, totalSlides]);

  // Mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a link
    if ((e.target as HTMLElement).tagName === 'A') return;
    setIsDragging(true);
    startX.current = e.pageX;
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dx = e.pageX - startX.current;
    if (Math.abs(dx) > 60) {
      dx > 0 ? prev() : next();
    }
  };

  if (!images.length) return null;

  const gap = isHero ? 0 : 12;
  // Hero (single-column): use % widths (no circular dependency with 1 image/slide)
  // Multi-column: use pixel widths to avoid CSS percentage circularity
  const slideW = containerW || 1200;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          gap,
          transform: isHero
            ? `translateX(-${current * 100}%)`
            : `translateX(calc(-${current * (slideW + gap)}px))`,
          transition: isDragging ? 'none' : 'transform 0.5s ease',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
      >
        {Array.from({ length: totalSlides }).map((_, slideIndex) => (
          <div
            key={slideIndex}
            style={{
              display: 'flex',
              gap,
              width: isHero ? '100%' : slideW,
              flexShrink: 0,
            }}
          >
            {images
              .slice(slideIndex * safeColumns, slideIndex * safeColumns + safeColumns)
              .map((src, i) => {
                const globalIndex = slideIndex * safeColumns + i;
                const link = links[globalIndex];
                const img = (
                  <img
                    src={src}
                    alt={alt ? `${alt} ${globalIndex + 1}` : ''}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                    }}
                    draggable={false}
                  />
                );
                return (
                  <div
                    key={i}
                    style={{
                      flex: isHero ? '0 0 100%' : `0 0 calc(${100 / safeColumns}% - ${gap * (safeColumns - 1) / safeColumns}px)`,
                      aspectRatio: ratio,
                      background: 'var(--color-awb-2)',
                      borderRadius: isHero ? 0 : 8,
                      overflow: 'hidden',
                    }}
                  >
                    {link ? (
                      <a href={link} style={{ display: 'block', width: '100%', height: '100%' }}>
                        {img}
                      </a>
                    ) : (
                      img
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showNav && totalSlides > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="carousel-arrow"
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 2,
              fontSize: 18,
              color: 'var(--color-awb-6)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            &#8249;
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="carousel-arrow"
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              zIndex: 2,
              fontSize: 18,
              color: 'var(--color-awb-6)',
              fontFamily: 'var(--font-ui)',
            }}
          >
            &#8250;
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && totalSlides > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: isHero ? 12 : 16,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === current ? 'var(--color-awb-4)' : 'var(--color-awb-3)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
