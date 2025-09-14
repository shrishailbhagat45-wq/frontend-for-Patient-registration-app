import React from 'react'
import { TfiAlignJustify } from "react-icons/tfi";

export default function Navbar() {
  return (
    <div  className="bg-gray-100 flex justify-between items-center h-16 w-full shadow-md p-4 fixed top-0 left-0 right-0 z-40"> 
        <div className="text-black text-2xl"><TfiAlignJustify/></div>
        <div></div>
        <div>
            <button className='bg-black rounded-lg px-4 py-2'>Login</button>
        </div>
    </div>
  )
}
