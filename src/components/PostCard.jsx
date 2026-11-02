import Link from 'next/link';
import SiteIcon from './SiteIcon';
import { t, tr, formatDate } from '@/i18n/translations';

export default function PostCard({ post, locale = 'en', headingTag = 'h3' }) {
  const Heading = headingTag;
  const title = tr(post, 'title', locale);
  const excerpt = tr(post, 'excerpt', locale);
  const categoryName = post.category ? tr(post.category, 'name', locale) : '';

  return (
    <article className="card group flex h-full flex-col overflow-hidden p-0 sm:p-0 hover:-translate-y-1">
      {post.cover_image ? (
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={post.cover_image}
            alt=""
            width={640}
            height={360}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="relative flex aspect-video w-full flex-col justify-between overflow-hidden border-b border-line/60 bg-gradient-to-br from-teal/10 via-white to-teal/5 p-6" aria-hidden="true">
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-teal/10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-teal shadow-2xs">
              <SiteIcon name="book" className="size-3 text-accent" />
              {categoryName || 'Clinical Guide'}
            </span>
            <span className="text-xs font-semibold text-ink-soft">
              Dr. Sajib
            </span>
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-teal text-white shadow-sm">
              <SiteIcon name="book" className="size-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-accent-deep">Patient Education</p>
              <p className="text-xs text-ink-soft">Evidence-Based Guide</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          {categoryName && (
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 font-bold uppercase tracking-wider text-accent-deep">
              {categoryName}
            </span>
          )}
          <time dateTime={post.published_at}>{formatDate(post.published_at, locale)}</time>
        </div>

        <Heading className="mt-3 text-xl font-bold tracking-tight text-ink group-hover:text-teal transition-colors">
          <Link
            href={`/${locale}/patient-education/${post.slug}`}
            prefetch={true}
            className="text-ink no-underline group-hover:text-teal"
          >
            {title}
          </Link>
        </Heading>

        <p className="mt-3 text-sm sm:text-base text-ink-soft leading-relaxed line-clamp-3">{excerpt}</p>

        <Link
          href={`/${locale}/patient-education/${post.slug}`}
          prefetch={true}
          className="mt-auto inline-flex min-h-10 items-center gap-2 pt-6 text-sm font-bold text-teal transition-colors hover:text-teal-deep active:scale-[0.98]"
        >
          {t(locale, 'buttons.read_more')}
          <span className="sr-only">: {title}</span> <SiteIcon name="arrow" className="size-4" />
        </Link>
      </div>
    </article>
  );
}

