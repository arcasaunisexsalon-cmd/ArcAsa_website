import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
  Shows the poster images it is given, one at a time.
  The page decides which ads are active (active: "on") and passes only those in.

    <AdSlider ads={activeAds} />
*/
const AdSlider = ({ ads = [], interval = 4000 }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = ads.length;
  // If an ad is switched off while it is showing, stay inside the list
  const current = count ? Math.min(index, count - 1) : 0;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reduce || count < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearInterval(timer);
  }, [paused, count, interval]);

  if (count === 0) return null;

  const prev = () => setIndex((current + count - 1) % count);
  const next = () => setIndex((current + 1) % count);

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[#1a1a1a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Offers and packages"
    >
      {ads.map((ad, i) => (
        <img
          key={`${ad.id}-${ad.name}`}
          src={ad.image}
          alt={ad.name ? `${ad.name} offer` : "Offer"}
          aria-hidden={i !== current}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous offer"
            className="absolute left-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next offer"
            className="absolute right-3 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
          >
            <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>

          <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
            {ads.map((ad, i) => (
              <button
                key={`dot-${ad.id}-${ad.name}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show ${ad.name ?? "offer"}`}
                aria-current={i === current}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-[#FFD166]" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdSlider;