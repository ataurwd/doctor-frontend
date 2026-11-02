'use client';

import SiteIcon from '@/components/SiteIcon';

export default function PDFViewerModal({ url, title, onClose }) {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-5xl rounded-3xl bg-white border border-line shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-line bg-paper-alt/50">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-xs shadow-xs">
              PDF
            </div>
            <div>
              <h3 className="font-bold text-ink text-base line-clamp-1">{title || 'Document Preview'}</h3>
              <p className="text-xs text-ink-soft font-mono line-clamp-1">{url}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line bg-white px-3 py-1.5 text-xs font-bold text-teal hover:bg-teal hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <SiteIcon name="download" className="size-3.5" />
              <span>Download</span>
            </a>
            <button
              type="button"
              onClick={() => {
                const w = window.open(url, '_blank');
                if (w) w.focus();
              }}
              className="rounded-xl bg-teal px-3.5 py-1.5 text-xs font-bold text-white hover:bg-teal-deep transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <SiteIcon name="print" className="size-3.5" />
              <span>Open & Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-xl border border-line bg-white text-ink-soft hover:bg-paper-alt cursor-pointer ml-1"
            >
              <SiteIcon name="close" className="size-4" />
            </button>
          </div>
        </div>

        {/* PDF Embedded View */}
        <div className="flex-1 p-4 bg-paper/40 min-h-[500px]">
          <iframe
            src={`${url}#toolbar=1&view=FitH`}
            title={title || 'PDF Document'}
            className="w-full h-full min-h-[550px] rounded-2xl border border-line/80 bg-white shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
