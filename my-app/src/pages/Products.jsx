import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { brAnds } from "../constants/services/brands";
/* ------------------------------------------------------------------ */
/* Content: edit this list, no need to touch the markup below         */
/* ------------------------------------------------------------------ */

/*
  One object per brand.
  logo: put the picture in my-app/public/images/brands/ and write its path, for example
        "/images/brands/skp.png". Leave it "" to show the brand name as text instead.
  tagline: optional small line under the logo.
  The three below come from the spa names in your service lists. Replace them with the
  brands you really stock.
*/
const brands = brAnds.map((b) => ({
  id: b.id,
  name: b.name,
  logo: b.image,
  tagline: b.subtitle,
}));

const SLIDE_EVERY_MS = 3000;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const I = ({ icon: Icon, size = 20, className }) => (
  <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
);

// How far one slide moves: one tile plus the gap between tiles
const stepOf = (track) => {
  const first = track.firstElementChild;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  return first ? first.getBoundingClientRect().width + gap : track.clientWidth;
};

const BrandTile = ({ brand }) => {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = brand.logo && !logoFailed;

  return (
    <li className="w-[200px] shrink-0 snap-start sm:w-[230px]">
      <div className="flex h-full min-h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-[#F0E7E1] bg-white p-5 text-center shadow-sm">
        <div className="grid h-16 w-full place-items-center">
          {showLogo ? (
            <img
              src={brand.logo}
              alt={brand.name}
              loading="lazy"
              onError={() => setLogoFailed(true)}
              className="max-h-16 w-full object-contain"
            />
          ) : (
            <span className="font-display text-2xl font-bold tracking-wide text-[#9F2343]">
              {brand.name}
            </span>
          )}
        </div>
        {brand.tagline && <p className="text-xs text-[#71717D]">{brand.tagline}</p>}
      </div>
    </li>
  );
};

/* ------------------------------------------------------------------ */
/* Brand slider                                                        */
/* ------------------------------------------------------------------ */

const BrandSlider = ({ items }) => {
  const trackRef = useRef(null);

  const [reduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [playing, setPlaying] = useState(!reduce); // the Pause / Play button
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [overflowing, setOverflowing] = useState(false); // are there more brands than fit?

  // Move one tile. At the end it wraps to the start, and the other way round.
  const move = useCallback(
    (dir) => {
      const el = trackRef.current;
      if (!el) return;
      const behavior = reduce ? "auto" : "smooth";
      const atStart = el.scrollLeft <= 4;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;

      if (dir > 0 && atEnd) el.scrollTo({ left: 0, behavior });
      else if (dir < 0 && atStart) el.scrollTo({ left: el.scrollWidth, behavior });
      else el.scrollBy({ left: dir * stepOf(el), behavior });
    },
    [reduce]
  );

  // Controls and autoplay are only needed when the brands do not all fit on screen
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setOverflowing(el.scrollWidth > el.clientWidth + 1));
    observer.observe(el);
    return () => observer.disconnect();
  }, [items.length]);

  // Autoplay: stops while the pointer is over the slider, while it has keyboard focus,
  // or after the visitor presses Pause
  useEffect(() => {
    if (!playing || hovered || focused || !overflowing) return;
    const timer = setInterval(() => move(1), SLIDE_EVERY_MS);
    return () => clearInterval(timer);
  }, [playing, hovered, focused, overflowing, move]);

  if (items.length === 0) return null;

  const roundButton =
    "grid h-10 w-10 place-items-center rounded-full border border-[#F0E7E1] bg-white text-[#171923] transition-colors hover:bg-[#FBE7EA]";

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-labelledby="brands-heading"
      className="rounded-2xl border border-[#F0E7E1] bg-[#FFFCF9] p-5 shadow-sm"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="brands-heading" className="font-display text-2xl font-semibold text-[#79172F]">
            Our brands
          </h2>
          <p className="mt-1 text-sm text-[#71717D]">The professional brands we work with.</p>
        </div>

        {overflowing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause automatic sliding" : "Start automatic sliding"}
              className={roundButton}
            >
              <I icon={playing ? Pause : Play} size={18} />
            </button>
            <button type="button" onClick={() => move(-1)} aria-label="Previous brands" className={roundButton}>
              <I icon={ChevronLeft} size={18} />
            </button>
            <button type="button" onClick={() => move(1)} aria-label="Next brands" className={roundButton}>
              <I icon={ChevronRight} size={18} />
            </button>
          </div>
        )}
      </div>

      <div
        className="mt-5"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <ul
          ref={trackRef}
          tabIndex={overflowing ? 0 : undefined}
          aria-label="Brands, scrolls sideways"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9F2343] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((brand) => (
            <BrandTile key={brand.id} brand={brand} />
          ))}
        </ul>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Products = () => {
  return (
    <main className="min-h-screen bg-[#FFFCF9] font-sans text-[#171923]">
      <div className="mx-auto max-w-[1200px] space-y-6 p-4 lg:p-6">
        <header>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Our{" "}
            <span className="font-['Great_Vibes',cursive] text-5xl font-normal text-[#9F2343]">
              products
            </span>
          </h1>
          <p className="mt-2 text-sm text-[#71717D]">
            Salon-quality care you can take home, from brands we trust.
          </p>
        </header>

        <BrandSlider items={brands} />

        <section className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm">
          <div className="grid place-items-center gap-2 py-16 text-center text-[#71717D]">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
              <I icon={Sparkles} size={24} />
            </span>
            <p className="font-semibold text-[#171923]">Coming soon</p>
            <p className="text-sm">This Product list has not been added yet.</p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Products;