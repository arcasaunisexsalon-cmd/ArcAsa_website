import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import makeup from "../assets/images/makeup.jpg";
import hairst from "../assets/images/hair_t.jpg";
import nailart from "../assets/images/mnail.jpg";
import skint from "../assets/images/skint.jpg";
import partyVideo from "../assets/images/adverts/party_makeup.webm";
import { ArrowUpFromDot } from "lucide-react";
import chanDan from "../assets/images/adverts/chandan.webm";
import Poster from "../assets/images/adverts/poster.png"
import Nailt from "../assets/images/adverts/nail_style.webm";
import Final from "../assets/images/adverts/final.webm";
import HeroSlider from "../components/shared/Heroslider";


/* ------------------------------------------------------------------ */
/* Content: edit these arrays, no need to touch the markup below      */
/* ------------------------------------------------------------------ */
const SALON_NAME = "ArcAsa Unisex Salon";

// Put the pictures in public/images/hero/ (about 1600 x 700 px, under 300 KB each)
const slides = [
  { type: "video", src: partyVideo, alt: "Party Look" },
  { type: "video", src: chanDan, alt: "Men's Fresh Look" },
  { type: "video", src: Nailt, alt: "Manicured nails" },
  { type: "video", src: Final, alt: "Final collab" },
  { type: "image", src: Poster, alt: "Styling at the salon" },  
];

// Put the pictures in public/images/home/ (about 500 x 650 px)
const categories = [
  { name: "Makeup", src: makeup , to: "/services" },
  { name: "Hair styling", src: hairst , to: "/services" },
  { name: "Nail care", src: nailart, to: "/services" },
  { name: "Skin care", src: skint, to: "/services" },
];

const testimonials = [
  {
    name: "Sushree Saswatee",
    text: "First time I went to this salon and I'm really happy with the experience. Staff was very professional, experienced and friendly. The service was fantastic and they were very attentive to my needs. I had a wonderful and relaxing experienced.",
  },
  {
    name: "Payal Sahoo",
    text: "Got a best affordable unisex salon in Bhubaneswar . Service was very good and staff members’ behaviour is very humble",
  },
  {
    name: "Abinash K P",
    text: "One of the best salon in bhubaneswar. Service is great, staff is well trained and well behaved. They care about client’s need and give their best in everything. Lovely and happening place in this city.",
  },
];

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */






/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fdf6f1] font-['Inter',sans-serif] text-[#2b2224]">
      <div className="mx-auto max-w-6xl bg-white shadow-sm">
        

        {/* Title */}
        <section className="py-10 text-center">
          <h1 className="font-['Great_Vibes','Playfair_Display',cursive] text-6xl text-[#7a1020] sm:text-7xl">
            {SALON_NAME}
          </h1>
        </section>

        {/* Auto-sliding hero */}
        <HeroSlider slides={slides}/>

        {/* Intro */}
        <section className="mx-auto max-w-2xl px-6 py-14 text-center">
          <h2 className="font-['Playfair_Display',serif] text-3xl font-semibold leading-snug text-[#7a1020] sm:text-4xl">
            Elegance comes from being as beautiful inside as outside
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-[#6f6468]">
            From a quick trim to a full bridal day, our stylists and therapists take the time to
            understand what you want and deliver it with care.
          </p>
        </section>

        {/* Categories */}
        <section className="grid grid-cols-2 gap-4 px-6 pb-16 md:grid-cols-4 md:px-12">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={c.to}
              className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#e9c7b5] to-[#b98a7a]"
            >
              <img
                src={c.src}
                alt=""
                onError={(e) => (e.currentTarget.style.display = "none")}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-12 font-['Playfair_Display',serif] text-lg text-white">
                {c.name}
              </span>
            </Link>
          ))}
        </section>

        {/* Testimonials */}
        <section className="bg-[#f6e7de] px-6 py-16 md:px-12">
          <h2 className="text-center font-['Playfair_Display',serif] text-3xl font-semibold text-[#7a1020]">
            Testimonials
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex h-full flex-col text-center">
                <blockquote className="flex-1 text-sm leading-relaxed text-[#4a3f43]">“{t.text}”</blockquote>
                <figcaption className="mt-4 font-['Playfair_Display',serif] text-[#7a1020]">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-8 text-center text-xs text-[#6f6468]">
          © {new Date().getFullYear()} {SALON_NAME}. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Home;