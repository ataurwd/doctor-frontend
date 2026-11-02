import Link from 'next/link';
import SiteIcon from './SiteIcon';
import { t, telHref, whatsappHref } from '@/i18n/translations';

export default function MobileBar({ locale = 'en', settings = {} }) {
  const callNumber = settings.call_number || '01711-647877';
  const waUrl = whatsappHref(settings);

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className={`grid gap-2 px-3 py-2 ${waUrl ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {callNumber && (
          <a
            href={telHref(callNumber)}
            className="btn btn-primary px-2 text-base"
            data-testid="bar-call"
          >
            <SiteIcon name="phone" /> {t(locale, 'buttons.call')}
          </a>
        )}
        {waUrl && (
          <a
            href={waUrl}
            className="btn btn-whatsapp px-2 text-base"
            rel="noopener noreferrer"
            target="_blank"
            data-whatsapp
          >
            <SiteIcon name="whatsapp" /> {t(locale, 'buttons.whatsapp')}
          </a>
        )}
        <Link
          href={`/${locale}/appointment`}
          className="btn btn-accent px-2 text-center text-base leading-tight"
        >
          <SiteIcon name="calendar" className="size-5 shrink-0" />{' '}
          {t(locale, 'nav.request_appointment')}
        </Link>
      </div>
    </div>
  );
}

