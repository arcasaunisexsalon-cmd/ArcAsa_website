import { FaHome, FaServicestack } from "react-icons/fa";
import { IoReorderFourSharp } from "react-icons/io5";
import { CiCircleMore } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "Orders", path: "/orders", icon: IoReorderFourSharp },
  { label: "Services", path: "/services", icon: FaServicestack },
  { label: "More", path: "/more", icon: CiCircleMore },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="group fixed bottom-0 left-0 right-0 h-6 z-50">
      <nav
        className="absolute bottom-0 left-0 right-0 h-16 bg-[#FFFFE0] p-2 flex justify-around items-center gap-2
                   translate-y-full opacity-0 transition-all duration-300
                   group-hover:translate-y-0 group-hover:opacity-100"
      >
        {navItems.map(({ label, path, icon: Icon }) => {
          const active = path !== null && pathname === path;
          return (
            <button
              key={label}
              onClick={() => path && navigate(path)}
              className={`flex items-center justify-center w-[200px] h-full rounded-[20px] ${
                active ? "text-[#f5f5f5] bg-[#343434]" : "text-[#555]"
              }`}
            >
              <Icon className="mr-2" size={30} />
              <p>{label}</p>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;