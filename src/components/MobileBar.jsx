import Link from 'next/link';
import SiteIcon from './SiteIcon';
import { t, telHref, whatsappHref } from '@/i18n/translations';

export default function MobileBar({ locale = 'en', settings = {} }) {
  const callNumber = settings.call_number || '01711-647877';
  const waUrl = whatsappHref(settings);
  const isBn = locale === 'bn';

  return (
    <div id="mobile-bottom-bar" className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/95 px-3 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(27,46,42,0.06)] backdrop-blur-md md:hidden">
      <div className={`grid gap-2.5 items-center ${waUrl ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {callNumber && (
          <a
            href={telHref(callNumber)}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-teal px-2 text-xs sm:text-sm font-bold text-white shadow-xs active:scale-[0.98] transition-all hover:bg-teal-deep no-underline"
            data-testid="bar-call"
          >
            <SiteIcon name="phone" className="size-4 shrink-0" />
            <span className="truncate">{t(locale, 'buttons.call')}</span>
          </a>
        )}

        {waUrl && (
          <a
            href={waUrl}
            className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-2 text-xs sm:text-sm font-bold text-white shadow-xs active:scale-[0.98] transition-all hover:bg-[#1faa53] no-underline"
            rel="noopener noreferrer"
            target="_blank"
            data-whatsapp
          >
            <SiteIcon name="whatsapp" className="size-4 shrink-0" />
            <span className="truncate">{t(locale, 'buttons.whatsapp')}</span>
          </a>
        )}

        <Link
          href={`/${locale}/appointment`}
          prefetch={true}
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-accent-deep px-2 text-xs sm:text-sm font-bold text-white shadow-xs active:scale-[0.98] transition-all hover:bg-[#8f4518] no-underline"
        >
          <SiteIcon name="calendar" className="size-4 shrink-0" />
          <span className="truncate">
            {isBn ? 'অ্যাপয়েন্টমেন্ট' : 'Appointment'}
          </span>
        </Link>
      </div>
    </div>
  );
}

