import React from "react";

import { Sparkles } from "lucide-react";

const I = ({ icon: Icon, size = 20, className }) => (
    <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
  );

const Events = () => {

    return(

        <section className="rounded-2xl border border-[#F0E7E1] bg-white p-5 shadow-sm">
            <div className="grid place-items-center gap-2 py-16 text-center text-[#71717D]">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                  <I icon={Sparkles} size={24} />
                </span>
                <p className="font-semibold text-[#171923]">Coming soon</p>
                <p className="text-sm">This Product list has not been added yet.</p>
              </div>
          </section>
    )
}

export default Events;