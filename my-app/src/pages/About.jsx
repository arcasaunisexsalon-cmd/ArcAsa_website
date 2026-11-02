
import React from "react";

import { NavLink } from "react-router-dom";

const SALON_NAME = "ArcAsa Unisex Salon";

function Whypoints(){
    return(
         <ul className="list-inside list-disc">
            <li className="mt-5"><strong>Personalised Care:</strong> Services tailored to your style, preferences, and needs.</li>
            <li className="mt-2"><strong>Complete Beauty Destination:</strong> Hair, skin, makeup, nail care, and grooming services under one roof.</li>
            <li className="mt-2"><strong>Professional Attention:</strong> A focus on service quality, comfort, and the details that matter.</li>
            <li className="mt-2"><strong>For Everyone:</strong> A welcoming salon experience for men, women, and customers of different age groups.</li>
            <li className="mt-2"><strong>Your Style, Your Confidence:</strong> Helping you look good, feel good, and be yourself.</li>
            </ul>
                    
    )                    
};

const linkclass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";


const About = () => {

    return(
        <div className="min-h-screen bg-[#fdf6f1] font-['Inter',sans-serif] text-[#2b2224]">
            <div className="mx-auto max-w-6xl bg-white shadow-sm">
                {/* Title */}
                <section className="py-10 text-center">
                    <h1 className="font-['Great_Vibes','Playfair_Display',cursive] text-6xl text-[#7a1020] sm:text-7xl">
                        {SALON_NAME}
                    </h1>
                </section>
                {/* Intro */}
                <section className="mx-auto max-w-2xl px-6 py-14">
                    <h1 className="font-['Playfair_Display',serif] text-3xl font-semibold leading-snug text-[#7a1020] sm:text-4xl">
                    Welcome to ArcAsa Unisex Salon
                    </h1>
                    <h3 className="font-['Playfair_Display',serif] text-xl font-semibold text-[#171923]">
                    Adore Yourself With Confidence
                    </h3>
                    <p className="mt-5 text-base leading-relaxed text-[#6f6468]">
                        At <strong>ArcAsa Unisex Salon</strong>, we believe that beauty is more than just appearance — it is about confidence, self-expression, and feeling your absolute best. </p>
                        <p className="mt-2 text-base leading-relaxed text-[#6f6468]">
                        Located at <strong>Plot 316, District Centre, Chandrasekharpur, Bhubaneswar, near Reliance Fresh</strong>, ArcAsa is your destination for professional hair styling, beauty, skincare, makeup, and grooming services, thoughtfully designed for both men and women. </p>
                        <p className="mt-2 text-base leading-relaxed text-[#6f6468]">
                        Whether you are looking for a fresh haircut, a stunning hair transformation, a rejuvenating hair spa, glowing skin, flawless party makeup, or simply a little time to care for yourself, our goal is to make every visit a comfortable and rewarding experience. </p>
                        <p className="mt-2 text-base leading-relaxed text-[#6f6468]">
                        We believe every customer deserves individual attention. That is why we focus on understanding your preferences, recommending services suited to your needs, and helping you discover a look that reflects your personality and lifestyle. </p>
                        <p className="mt-2 text-base leading-relaxed text-[#6f6468]">
                        From everyday grooming to special occasions, our aim is to bring together quality service, a welcoming atmosphere, and attention to detail — so you leave feeling refreshed, looking your best, and carrying your confidence wherever you go.
                    </p>
                    <h3 className="mt-5 font-['Playfair_Display',serif] text-xl font-semibold text-[#7a1020]">
                    Why choose <strong>ArcAsa?</strong>
                    </h3>
                    <Whypoints/>
                    <p className="mt-5 text-sm leading-relaxed text-[#6f6468]">
                    <strong>Whether it is your first visit or you are returning for your favourite service, we look forward to welcoming you to ArcAsa. 😊 </strong></p>
                    <p className="mt-5 text-sm leading-relaxed text-[#6f6468]">
                        📍 Visit Us: Plot 316, District Centre, Chandrasekharpur, Bhubaneswar, Odisha — near Reliance Fresh. </p>
                    <NavLink to={"/contact"} className={linkclass}>
                        Contact
                    </NavLink>
                    </section>

            </div>
      </div>
    )
};

export default About;