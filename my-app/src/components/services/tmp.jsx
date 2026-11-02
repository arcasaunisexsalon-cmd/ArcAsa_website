import { useState } from "react";
import { Link } from "react-router-dom";
import { useBooking } from "../../context/BookingContext";
import { GiFingernail } from "react-icons/gi";
import {
  Plus,
  Minus,
  Check,
  ChevronRight,
  ArrowLeft,
  Clock3,
  Crown,
  Scissors,
  Droplet,
  Palette,
  Sparkles,
  Ear,
  SmileIcon,
} from "lucide-react";

/* Every icon uses the same stroke width (1.8) */
const I = ({ icon: Icon, size = 20, className }) => (
  <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />
);

// Icon shown on the small tag chip. Add more tags here.
const tagIcons = {
  "Hair Cut": Scissors,
  "Hair Wash": Droplet,
  "Hair Colour": Palette,
  Massage: Sparkles,
  Skin: SmileIcon,
  "Ear Piercing": Ear,
};

// Icon picked from the service name, so no `tag` is needed on every service.
// The first rule that matches wins. Add or reorder rules as you like.
const nameIcons = [
    { re: /colou?r|highlight|balayage|ombre/i, icon: Palette },
    { re: /shampoo|wash|conditioning/i, icon: Droplet },
    { re: /spa|massage|polish|waxing|treatment/i, icon: Sparkles },
    { re: /cut|trim|shave|beard|straighten|smoothen/i, icon: Scissors },
    { re: /D-Tan|threading|facial|treatment/i, icon: SmileIcon },
    { re: /ear/i, icon: Ear },
    { re: /nail/i, icon: GiFingernail },
];

// Order: 1) the service's own tag  2) its name  3) its parent group's name  4) the list's fallback
const pickIcon = (service, parentName, fallback) => {
  if (tagIcons[service.tag]) return tagIcons[service.tag];
  const byName = nameIcons.find(({ re }) => re.test(service.serviceName));
  if (byName) return byName.icon;
  const byParent = parentName && nameIcons.find(({ re }) => re.test(parentName));
  return byParent ? byParent.icon : fallback;
};

const formatPrice = (s) => {
  switch (s.priceType) {
    case "from":
      return `From ₹${s.price}`;
    case "range":
      return `₹${s.min} - ₹${s.max}`;
    case "custom":
      return "Ask at billing";
    default:
      return typeof s.price === "number" ? `₹${s.price}` : "";
  }
};

const allowsMultiple = (s) =>
  typeof s.multi === "boolean"
    ? s.multi
    : Boolean(s.pricingUnit) && !/^per service$/i.test(s.pricingUnit);

/*
  Optional fields on each service (all can be left out):
    image, description, duration ("30 mins"), tag ("Hair Cut"),
    popular (true), type ("Colour", used for the filter tabs),
    children (opens a sub-list), priceType / min / max
*/
// `scope` says which list this is (for example "Ladies-Hair"), so the same service name
// in two different lists is stored as two different selections.
const ServiceList = ({ title, subtitle, data, fallbackIcon = Scissors, scope = title }) => {
  const [stack, setStack] = useState([]); // opened groups: { name, items }
  const [filter, setFilter] = useState("All");
  const { isSelected, toggleService, updateQty, getQty, count, total } = useBooking();

  const current = stack.length ? stack[stack.length - 1] : null;
  const list = current ? current.items : data;

  const types = [...new Set(list.map((s) => s.type).filter(Boolean))];
  const visible =
    filter === "All" || !types.includes(filter)
      ? list
      : list.filter((s) => s.type === filter);

  const openGroup = (s) => {
    setStack([...stack, { name: s.serviceName, items: s.children }]);
    setFilter("All");
  };


  const makeId = (s) => `${scope}::${s.sid}::${s.serviceName}`;

  const toggleAdd = (s) =>({
      id: makeId(s),
      sid: s.sid,
      name: s.serviceName,
      price: typeof s.price === "number" ? s.price : null,
      priceLabel: formatPrice(s),
      scope,
      group: current?.name ?? "",
    });
  
    const handleIncrement = (s, currentQty) => {
      const id = makeId(s);
      if (updateQty) {
        updateQty(id, currentQty + 1, toggleAdd(s));
      } else {
        toggleService(toggleAdd(s));
      }
    };
  
    const handleDecrement = (s, currentQty) => {
      const id = makeId(s);
      if (updateQty) {
        updateQty(id, Math.max(0, currentQty - 1));
      } else {
        toggleService(toggleAdd(s));
      }
    };

  
  return (
    <div>
      {/* Heading + filter tabs */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {current && (
            <button
              type="button"
              onClick={() => setStack(stack.slice(0, -1))}
              aria-label="Back"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343] hover:bg-[#F9D9E0]"
            >
              <I icon={ArrowLeft} size={18} />
            </button>
          )}
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#171923]">
              {current ? current.name : title}
            </h2>
            {!current && subtitle && (
              <p className="mt-1 text-sm text-[#71717D]">{subtitle}</p>
            )}
          </div>
        </div>

        {types.length > 0 && (
          <div className="flex flex-wrap gap-1 rounded-full bg-[#F5F4F5] p-1">
            {["All", ...types].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  filter === t
                    ? "bg-[#FFD166] font-semibold text-[#171923]"
                    : "text-[#71717D] hover:bg-[#FBE7EA]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Cards */}
      <ul className="mt-5 space-y-3">
        {visible.map((s) => {
          const hasChildren = Boolean(s.children);
          const id = makeId(s);
          const isAdded = isSelected(id);
          const quantity = getQty ? getQty(id) : isAdded ? 1 : 0;
          const multi = allowsMultiple(s);
          const CardIcon = pickIcon(s, current?.name, fallbackIcon);
          const price = formatPrice(s);

          const content = (
            <>
              {s.image ? (
                <img
                  src={s.image}
                  alt=""
                  className="h-20 w-24 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-[#FBE7EA] text-[#9F2343]">
                  <I icon={CardIcon} size={24} />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#171923]">{s.serviceName}</h3>
                  {s.popular && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3DE] px-2 py-0.5 text-[11px] font-semibold text-[#A96100]">
                      <I icon={Crown} size={12} /> Most Popular
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="mt-0.5 text-sm text-[#71717D]">{s.description}</p>
                )}
                {(s.duration || s.tag) && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#71717D]">
                    {s.duration && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#F5F4F5] px-2 py-1">
                        <I icon={Clock3} size={14} /> {s.duration}
                      </span>
                    )}
                    {s.tag && (
                      <span className="inline-flex items-center gap-1 rounded-lg bg-[#F5F4F5] px-2 py-1">
                        <I icon={CardIcon} size={14} /> {s.tag}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {price && (
                <p className="shrink-0 text-xl font-bold text-[#C96A00]">{price}</p>
              )}

              {/* Action Buttons: Subgroup, Stepper, or Single Add/Remove */}
              {hasChildren ? (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF3DE] text-[#A96100]">
                  <I icon={ChevronRight} size={18} />
                </span>
              ) : multi ? (
                quantity > 0 ? (
                  /* Multi-quantity Stepper */
                  <div className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FBE7EA] p-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecrement(s, quantity);
                      }}
                      aria-label={`Decrease ${s.serviceName}`}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white text-[#9F2343] shadow-sm hover:bg-gray-50"
                    >
                      <I icon={Minus} size={16} />
                    </button>
                    <span className="min-w-[1.25rem] text-center text-sm font-bold text-[#9F2343]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIncrement(s, quantity);
                      }}
                      aria-label={`Increase ${s.serviceName}`}
                      className="grid h-8 w-8 place-items-center rounded-lg bg-[#9F2343] text-white shadow-sm hover:bg-[#851d37]"
                    >
                      <I icon={Plus} size={16} />
                    </button>
                  </div>
                ) : (
                  /* Initial Add button for stepper items */
                  <button
                    type="button"
                    onClick={() => handleIncrement(s, 0)}
                    aria-label={`Add ${s.serviceName}`}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF3DE] text-[#A96100] transition-colors hover:bg-[#FFE7BD]"
                  >
                    <I icon={Plus} size={18} />
                  </button>
                )
              ) : (
                /* Standard Single Toggle Button */
                <button
                  type="button"
                  onClick={() => toggleService(toggleAdd(s))}
                  aria-pressed={isAdded}
                  aria-label={`${isAdded ? "Remove" : "Add"} ${s.serviceName}`}
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                    isAdded
                      ? "bg-[#9F2343] text-white"
                      : "bg-[#FFF3DE] text-[#A96100] hover:bg-[#FFE7BD]"
                  }`}
                >
                  <I icon={isAdded ? Check : Plus} size={18} />
                </button>
              )}
            </>
          );

          const cardClass =
            "flex w-full items-center gap-4 rounded-2xl border border-[#F0E7E1] bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md";

          return (
            <li key={s.sid}>
              {hasChildren ? (
                <button type="button" onClick={() => openGroup(s)} className={cardClass}>
                  {content}
                </button>
              ) : (
                <div className={cardClass}>{content}</div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Selection summary */}
      {count > 0 && (
        <div className="sticky bottom-4 mt-4 flex items-center justify-between gap-3 rounded-2xl bg-[#79172F] px-5 py-3 text-white shadow-lg">
          <p className="text-sm">
            {count} selected · <b>₹{total}</b>
          </p>
          <Link
            to="/appointments"
            className="rounded-full bg-[#FFD166] px-4 py-2 text-sm font-semibold text-[#171923]"
          >
            Book Appointment
          </Link>
        </div>
      )}
    </div>
  );
};

export default ServiceList;