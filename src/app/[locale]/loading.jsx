export default function LocaleLoading() {
  return (
    <div className="container-site py-12 md:py-18 animate-pulse space-y-8 min-h-[60vh]">
      {/* Skeleton Eyebrow & Title */}
      <div className="space-y-4 max-w-2xl">
        <div className="h-4 w-28 rounded-full bg-line/80" />
        <div className="h-10 sm:h-12 w-3/4 rounded-2xl bg-line/70" />
        <div className="h-4 w-full rounded-lg bg-line/50" />
        <div className="h-4 w-2/3 rounded-lg bg-line/40" />
      </div>

      {/* Skeleton Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-60 rounded-3xl border border-line/60 bg-paper-alt/40 p-6 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="h-8 w-12 rounded-xl bg-line/60" />
              <div className="h-6 w-3/4 rounded-lg bg-line/60" />
              <div className="h-4 w-full rounded-md bg-line/40" />
              <div className="h-4 w-5/6 rounded-md bg-line/30" />
            </div>
            <div className="h-4 w-24 rounded-full bg-line/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
