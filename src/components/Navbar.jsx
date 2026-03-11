import { useState, useEffect } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import { GoHomeFill } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { RiBillFill } from "react-icons/ri";
import { GrDocumentPdf } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

export default function Navbar() {  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isXlUp, setIsXlUp] = useState(false);
  const navigate = useNavigate();

  // tailwind 'xl' breakpoint = 1280px (larger desktops only)
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = (e) => setIsXlUp(e.matches);
    onChange(mq); // initial
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // add/remove body padding-left on desktop so content shifts (uses Tailwind utility)
  useEffect(() => {
    if (isXlUp) {
      document.body.classList.add("pl-64");
      // ensure sidebar visible on desktop without needing toggle
      setShowMenu(true);
    } else {
      document.body.classList.remove("pl-64");
      // don't keep sidebar open on small screens by default
      setShowMenu(false);
    }
    return () => document.body.classList.remove("pl-64");
  }, [isXlUp]);

  const toggleMenu = () => setShowMenu((s) => !s);
  const toggleProfile = () => setShowProfile((s) => !s);  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("doctorId");
    localStorage.removeItem("Id");
    navigate('/login', { replace: true });
  }
  return (
    <div className="navBar">
      {/* top navbar - Clean white with subtle border */}      <header className="bg-white flex items-center justify-between h-14 w-full border-b border-slate-200 px-4 fixed top-0 left-0 right-0 z-50">
        <button
          className="text-slate-600 text-xl focus:outline-none xl:hidden hover:text-slate-900 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <TfiAlignJustify />
        </button><div className="text-xl font-bold">
          <Link to="/home" className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all">
            HealSync360
          </Link>
        </div>

        <div className="relative">
          <button 
            className="text-xl text-slate-600 hover:text-slate-900 rounded-full p-1.5 hover:bg-slate-100 transition-all" 
            onClick={toggleProfile}
          >
            <FaUserDoctor />
          </button>
          {showProfile && (
            <div className="absolute top-12 right-0 bg-white border border-slate-200 rounded-lg shadow-lg w-44 z-50 overflow-hidden">
              <Link to="/profile" className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                Profile
              </Link>
              <button
                type="button"
                className="block w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors border-t border-slate-100"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>      {/* backdrop for mobile when sidebar open */}
      {!isXlUp && showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 bg-black/40 z-40"
          aria-hidden
        />
      )}      {/* sidebar: visible when showMenu OR on desktop (isXlUp) */}
      {(showMenu || isXlUp) && (
        <aside
          className={
            "bg-white shadow-sm border-r border-slate-200 transition-transform z-50 " +
            (isXlUp
              ? "fixed top-14 left-0 w-64 h-[calc(100vh-3.5rem)]" 
              : "fixed top-14 left-0 w-64 h-full")            
          }
          aria-hidden={!showMenu && !isXlUp}
        ><nav>
            <ul className="space-y-1 mt-4 px-3">
              <li>
                <Link to="/home" className="text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-base">
                  <GoHomeFill className="text-xl" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/billing-dashboard" className="text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-base">
                  <RiBillFill className="text-xl" />
                  <span>Billing Items</span>
                </Link>
              </li>
              <li>
                <Link to="/billing-info" className="text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-base">
                  <GrDocumentPdf className="text-xl" />
                  <span>Get Billing Info</span>
                </Link>
              </li>
              <li>
                <Link to="/management-dashboard" className="text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-base">
                  <MdManageAccounts className="text-xl" />
                  <span>Staff Management</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}