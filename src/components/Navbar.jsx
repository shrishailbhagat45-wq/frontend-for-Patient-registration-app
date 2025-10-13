import React, { useState, useEffect } from "react";
import { TfiAlignJustify } from "react-icons/tfi";
import { GoHomeFill } from "react-icons/go";
import { Link } from "react-router-dom";
import { RiBillFill } from "react-icons/ri";
import { GrDocumentPdf } from "react-icons/gr";
import { MdManageAccounts } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isMdUp, setIsMdUp] = useState(false);

  // tailwind 'md' breakpoint = 768px
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024Px)");
    const onChange = (e) => setIsMdUp(e.matches);
    onChange(mq); // initial
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // add/remove body padding-left on desktop so content shifts (uses Tailwind utility)
  useEffect(() => {
    if (isMdUp) {
      document.body.classList.add("pl-64");
      // ensure sidebar visible on desktop without needing toggle
      setShowMenu(true);
    } else {
      document.body.classList.remove("pl-64");
      // don't keep sidebar open on small screens by default
      setShowMenu(false);
    }
    return () => document.body.classList.remove("pl-64");
  }, [isMdUp]);

  const toggleMenu = () => setShowMenu((s) => !s);
  const toggleProfile = () => setShowProfile((s) => !s);
  const logout = () => {
    localStorage.removeItem("token");
  }

  return (
    <div className="navBar">
      {/* top navbar */}
      <header className=" bg-gray-100 flex items-center justify-between h-16 w-full shadow-md p-4 fixed top-0 left-0 right-0 z-50">
        <button
          className="text-black text-2xl focus:outline-none lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <TfiAlignJustify />
        </button>

        <div className="text-lg font-semibold text-fuchsia-800"><Link to="/home">HealSync360</Link></div>

        <div>
          <button className="text-3xl bg-gray-300 rounded-full p-2" onClick={toggleProfile}>
            <FaUserDoctor />
          </button>
          {showProfile && (
            <div className="absolute top-16 right-4 bg-white border border-gray-300 rounded shadow-lg w-48 z-50">
              <Link to="/profile" className="block px-4 py-2 text-black hover:bg-gray-100">
                Profile
              </Link>
              <Link to="/login" className="block px-4 py-2 text-black hover:bg-gray-100" onClick={logout}>
                Logout
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* backdrop for mobile when sidebar open */}
      {!isMdUp && showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className="fixed inset-0 bg-black/40 z-40"
          aria-hidden
        />
      )}

      {/* sidebar: visible when showMenu OR on desktop (isMdUp) */}
      {(showMenu || isMdUp) && (
        <aside
          className={
            "bg-white shadow-lg  transition-transform z-50 " +
            (isMdUp
              ? "fixed top-16 left-0 w-64 h-[calc(100vh-4rem)]" 
              : "fixed top-16 left-0 w-64 h-full")            
          }
          aria-hidden={!showMenu && !isMdUp}
        >
          <nav>
            <ul className="space-y-4 mt-6">
              <li>
                
                <Link to="/home" className="text-black hover:bg-fuchsia-100 flex items-center px-4 py-2 rounded ">
                <GoHomeFill />
                <div className="pl-2">Home</div>
                  
                </Link>
              </li>
              <li className="bg-gray-100 block">
                <Link to="/billing-dashboard" className="text-black hover:bg-fuchsia-100 flex items-center px-4 py-2 rounded">
                <RiBillFill />
                <div className="pl-2">Billing Dashboard</div>
                  
                </Link>
              </li>
              <li >
                <Link to="/" className="text-black hover:bg-fuchsia-100 flex items-center px-4 py-2 rounded">
                <GrDocumentPdf />
                <div className="pl-2"> Get Documents</div>
                </Link>
              </li>
              <li className="bg-gray-100 block">
                <Link to="" className="text-black hover:bg-fuchsia-100 flex items-center px-4 py-2 rounded">
                <MdManageAccounts />
                <div className="pl-2">Management Dashboard</div>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
      )}
    </div>
  );
}