export default function SiteIcon({ name, className = 'size-5', ...props }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {name === 'phone' && (
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
      )}
      {name === 'whatsapp' && (
        <>
          <path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.4L3 21Z" />
          <path d="M9 10c0 3 2 5 5 5l1.2-1.2-2-1-1 .7a4 4 0 0 1-1.7-1.7l.7-1-1-2L9 10Z" />
        </>
      )}
      {name === 'calendar' && (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      )}
      {name === 'clock' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </>
      )}
      {name === 'map' && (
        <>
          <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </>
      )}
      {name === 'mail' && (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 6-10 7L2 6" />
        </>
      )}
      {name === 'globe' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
        </>
      )}
      {name === 'menu' && <path d="M3 6h18M3 12h18M3 18h18" />}
      {name === 'close' && <path d="M18 6 6 18M6 6l12 12" />}
      {name === 'arrow' && <path d="M5 12h14M13 6l6 6-6 6" />}
      {name === 'check' && <path d="M20 6 9 17l-5-5" />}
      {name === 'alert' && (
        <>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          <path d="M12 9v4M12 17h.01" />
        </>
      )}
      {name === 'info' && (
        <>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </>
      )}
      {name === 'search' && (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </>
      )}
      {name === 'print' && (
        <>
          <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </>
      )}
      {name === 'download' && (
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
      )}
      {name === 'facebook' && (
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z" />
      )}
      {name === 'user' && (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
      {name === 'shield' && (
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      )}
      {name === 'activity' && (
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      )}
      {name === 'joint' && (
        <>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v6M12 15v6M5 7l4.5 3M14.5 14l4.5 3M19 7l-4.5 3M9.5 14L5 17" />
        </>
      )}
      {name === 'spark' && (
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
      )}
      {name === 'arrow-up-right' && (
        <path d="M7 17 17 7M7 7h10v10" />
      )}
    </svg>
  );
}

