'use client';

import SiteIcon from './SiteIcon';

export default function PrintButton({ label }) {
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={() => window.print()}
    >
      <SiteIcon name="print" /> {label}
    </button>
  );
}

