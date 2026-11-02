import SiteIcon from './SiteIcon';

export default function FallbackNotice({ show = false }) {
  if (!show) return null;
  return (
    <p
      className="mb-6 inline-flex items-center gap-2 rounded-full bg-paper-alt px-4 py-2 text-base text-ink-soft"
      lang="bn"
      data-fallback-notice
    >
      <SiteIcon name="info" /> বাংলা অনুবাদ শীঘ্রই আসছে
    </p>
  );
}

