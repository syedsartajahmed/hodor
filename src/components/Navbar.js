import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const Navbar = ({ hideHeader = false }) => {
  const router = useRouter();

  // Helper function to determine active state
  const isActive = (path) => router.pathname === path;

  return (
    <div className="flex justify-between items-center w-full px-28 py-6 shadow-md bg-white">
      {/* Logo */}
      <Image
        src="https://optiblack.com/hubfs/Group%201234-1.png"
        alt="Optiblack Logo"
        width={150} // Increased width
        height={30} // Increased height
        className="cursor-pointer"
        onClick={() => router.push("/")}
      />

      {!hideHeader && (
       <div>
       {/* Right-end Navigation Links */}
       <div className="flex gap-8 text-2xl font-semibold">
         <button
           className={`hover:opacity-65 transition-opacity cursor-pointer px-4 py-2 rounded-lg ${
             isActive("/organizations")
               ? "bg-black text-white"
               : "bg-transparent text-black"
           }`}
           onClick={() => router.push("/organizations")}
         >
           Organizations
         </button>
         <button
           className={`hover:opacity-65 transition-opacity cursor-pointer px-4 py-2 rounded-lg ${
             isActive("/master-event")
               ? "bg-black text-white"
               : "bg-transparent text-black"
           }`}
           onClick={() => router.push("/master-event")}
         >
           Master Events
         </button>
       </div>
     </div>
      )}
    </div>
  );
};

export default Navbar;
