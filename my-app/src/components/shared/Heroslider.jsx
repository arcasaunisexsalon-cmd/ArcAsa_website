import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";

/*
  Slides look like this (type is "image" or "video"):
    { type: "image", src: "/images/hero/slide1.jpg", alt: "..." }
    { type: "video", src: partyVideo, alt: "...", poster: optionalPreviewImage }

  Images stay for `interval` ms. A video plays to the end, then the slider moves on.
  Videos start muted (browsers require that). The round button turns sound on or off.
*/
const HeroSlider = ({ slides = [], interval = 5000 }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [reduce] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const videoRef = useRef(null);

  const count = slides.length;
  const current = count ? Math.min(index, count - 1) : 0;
  const isVideo = slides[current]?.type === "video";

  // Images move on by themselves. Videos move on when they end (see onEnded below).
  useEffect(() => {
    if (paused || reduce || count < 2 || isVideo) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearTimeout(timer);
  }, [current, paused, reduce, count, isVideo, interval]);

  // Apply the sound setting to the playing video.
  // (React does not reliably update the `muted` attribute, so it is set on the element.)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (!muted) {
      // If the browser refuses to play with sound, fall back to muted
      video.play()?.catch(() => setMuted(true));
    }
  }, [muted, current]);

  if (count === 0) return null;

  const advance = () => setIndex((i) => (i + 1) % count);

  return (
    <div
      className="relative h-[260px] w-full overflow-hidden bg-gradient-to-br from-[#e9c7b5] to-[#f3e3d9] sm:h-[360px] md:h-[440px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured images and videos"
    >
      {slides.map((s, i) =>
        s.type === "video" ? (
          // Only the active video is on the page, so hidden ones never play
          i === current && (
            <video
              key={s.src}
              ref={videoRef}
              src={s.src}
              poster={s.poster}
              aria-label={s.alt}
              autoPlay={!reduce}
              controls={reduce}
              muted
              loop={count === 1}
              playsInline
              onEnded={advance}
              onError={advance}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )
        ) : (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            aria-hidden={i !== current}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              i === current ? "opacity-100" : "opacity-0"
            }`}
          />
        )
      )}

      {/* Mute / unmute: only while a video is showing */}
      {isVideo && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute video" : "Mute video"}
          className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/75 focus-visible:outline-2 focus-visible:outline-white"
        >
          {muted ? (
            <VolumeX size={20} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Volume2 size={20} strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-white" : "w-2 bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroSlider;