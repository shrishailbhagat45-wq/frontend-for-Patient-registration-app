import React, { useState } from 'react'
import { TfiAlignJustify } from "react-icons/tfi";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="bg-gray-100 flex justify-between items-center h-16 w-full shadow-md p-4 fixed top-0 left-0 right-0 z-40">
        <button
          className="text-black text-2xl focus:outline-none"
          onClick={() => setShowMenu(!showMenu)}
        >
          <TfiAlignJustify />
        </button>
        <div></div>
        <div>
          <button className='bg-black rounded-lg px-4 py-2 text-white'>Login</button>
        </div>
      </div>
      {/* Sidebar Menu */}
      {showMenu && (
        <div className="fixed top-16 left-0 w-64 h-full bg-white shadow-lg z-50 p-6 transition-all">
          <ul className="space-y-4">
            <li><a href="#" className="text-black hover:underline">Home</a></li>
            <li><a href="#" className="text-black hover:underline">Patients Lists</a></li>
            <li><a href="#" className="text-black hover:underline">Get Documents</a></li>
          </ul>
        </div>
      )}
    </>
  )
}