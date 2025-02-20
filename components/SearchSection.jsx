"use client"
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const SearchSection = () => {

const [location, setLocation] = useState("choose a location");
const[isOpen, setIsOpen] = useState(false);

const locations = ["Chitwan","Ktm","Hetauda"];

  return (
    <>
    <div className="flex items-center  gap-6 p-4  py-4
    justify-center">
        <CiSearch className="relative left-14 text-xl"/>
     <input type="text" className="w-80 h-10 px-10 border rounded-full outline-none "/>
    </div>
    
    {/* Dropdown */}
    <div className="relative flex justify-between mx-20">  
        <p className="text-black font-semibold text-sm ">Suggestion</p>
        <button
        onClick={()=>setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1 text-sm bg-gray-200 text-black rounded-full border border-gray-400"
        ><ChevronDown size={16}/>
            {location}
        </button>

        {/* Dropdown option */}
        {isOpen && (
            <div className=" absolute mt-10  bg-white border border-gray-300 rounded-lg shadow-lg
            right-0">
                {locations.map((loc,index) => (
                    <button
                    key={index}
                    onClick={() => {
                        setLocation(loc);
                        setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >{loc}</button>
                ))}
            </div>
        )}
    </div>
    </>
  )
}

export default SearchSection
