import React from 'react'
import Image from 'next/image'
import { FaSearch } from "react-icons/fa";
import { MdMenu } from "react-icons/md";

const Navbar = () => {
  return (
    <nav className='flex px-8 py-2 mx-10  
     h-12 justify-between items-center'>
        <div>
        <img className='h-6 w 8 '
        src="tourMe.png" alt="logo"/>
        </div>
      <div className='flex gap-4 items-center'>
      <div><FaSearch /></div>
      <div className='text-lg'><MdMenu /></div>

      <div className="flex items-center space-x-2
       p-1 border border-gray-400 rounded-full">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            A
          </div>
          <span className="text-gray-700 text-sm">Anmol Poudel</span>
        </div>
        
      </div>
    </nav>
  )
}

export default Navbar

