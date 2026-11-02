import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaSearch, FaBars, FaTimes, FaWhatsapp } from "react-icons/fa";
//import { GiLotus } from "react-icons/gi";
import logo from "../../assets/logo.png";


const SALON_NAME = "ArcAsa Unisex Salon";

const navLeft = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Events", to: "/events" },
];
const navRight = [
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Products", to:"/products"},
  { label: "Blogs", to: "/blogs" },
];

const linkClass = ({ isActive }) =>
  `text-sm transition-colors hover:text-[#7a1020] ${
    isActive ? "font-semibold text-[#7a1020]" : "text-[#2b2224]"
  }`;

const Header = () => {
  const [open, setOpen] = useState(false);
  const all = [...navLeft, ...navRight];

  return (
    <header className="bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        {/* Social */}
        <div className="flex items-center gap-4 text-[#2b2224]">
          <a href="https://www.facebook.com/profile.php?id=61590559291603#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-[#7a1020]">
            <FaFacebookF size={14} />
          </a>
          <a href="https://www.instagram.com/arcasa_unisex_salon" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#7a1020]">
            <FaInstagram size={16} />
          </a>
          <a href="https://wa.me/+918093077919" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-[#7a1020]">
            <FaWhatsapp size={16} />
          </a>
        </div>

        {/* Desktop nav: 3 links, logo, 3 links */}
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
        <Link to="/" aria-label={`${SALON_NAME} home`} className="text-[#7a1020]">        
            <img src={logo} alt={`${SALON_NAME} logo`} className="h-10 w-auto" />
          </Link>
          {navLeft.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {navRight.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-4 text-[#2b2224]">
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="md:hidden"
          >
            {open ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav aria-label="Mobile" className="flex flex-col items-center gap-4 border-t border-[#f3e3d9] pb-5 pt-4 md:hidden">
          {all.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;