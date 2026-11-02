import Link from 'next/link';

export function LogoMark({ className = 'size-10', theme = 'light' }) {
  const isDark = theme === 'dark';

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} shrink-0 select-none transition-transform duration-200`}
      aria-label="Dr. Sajib Rheumatology Logo Mark"
      role="img"
    >
      {/* Background Squircle */}
      {isDark ? (
        <rect
          width="64"
          height="64"
          rx="18"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ) : (
        <rect
          width="64"
          height="64"
          rx="18"
          fill="#133430"
          className="shadow-sm"
        />
      )}

      {/* Upper Joint Condyle & S-Curve (Bone 1 / Flexion) in Cyan-Mint */}
      <path
        d="M21 25.5C21 19.1 26 14 32.5 14H34.5C41.4 14 47 19.6 47 26.5C47 31.8 43.4 35.8 37.5 37.5L26.5 40.8"
        stroke="#2DD4BF"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lower Joint Condyle & S-Curve (Bone 2 / Extension) in Emerald-Mint */}
      <path
        d="M43 38.5C43 44.9 38 50 31.5 50H29.5C22.6 50 17 44.4 17 37.5C17 32.2 20.6 28.2 26.5 26.5L37.5 23.2"
        stroke="#34D399"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Central Medical Cross (+) in Warm Terracotta Accent */}
      <path
        d="M32 26.5V37.5M26.5 32H37.5"
        stroke={isDark ? '#E28A52' : '#C1652F'}
        strokeWidth="3.6"
        strokeLinecap="round"
      />

      {/* Central Synovial Vitality Pearl / Pivot Point */}
      <circle cx="32" cy="32" r="2.2" fill="#FBF8F2" />
    </svg>
  );
}

export default function Logo({
  locale = 'en',
  doctorName = 'Dr. Md. Kamrul Hasan Sajib',
  specialtyLine = 'Rheumatology, arthritis & joint pain specialist',
  theme = 'light',
  variant = 'full', // 'mark' | 'full' | 'compact'
  size = 'md', // 'sm' | 'md' | 'lg'
  href,
  className = '',
}) {
  const isDark = theme === 'dark';

  const markSizes = {
    sm: 'size-8',
    md: 'size-11',
    lg: 'size-14',
  };

  const markClass = markSizes[size] || markSizes.md;

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={markClass} theme={theme} />
      {variant !== 'mark' && (
        <div className="flex flex-col">
          <span
            className={`font-display font-bold leading-tight tracking-tight sm:text-xl ${
              isDark ? 'text-white' : 'text-ink'
            } ${size === 'sm' ? 'text-base' : 'text-lg'}`}
          >
            {doctorName}
          </span>
          {variant === 'full' && specialtyLine && (
            <span
              className={`hidden text-xs font-medium sm:block ${
                isDark ? 'text-white/70' : 'text-ink-soft'
              }`}
            >
              {specialtyLine}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="no-underline shrink-0 active:scale-[0.98] transition-transform"
      >
        {content}
      </Link>
    );
  }

  return content;
}

