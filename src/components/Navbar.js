import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";

const NavbarDrawer = ({ hideHeader = false }) => {
  const router = useRouter();
  const isActive = (path) => router.pathname === path;

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 h-full w-64 bg-[#211f26] shadow-lg p-6 text-[#faf9fb]"
    >
      {/* Logo */}
      <div className="p-4 bg-white rounded-full flex justify-center items-center" style={{ width: 150, height: 30,marginBottom:10 }}>
        <Image
          src="https://optiblack.com/hubfs/Group%201234-1.png"
          alt="Optiblack Logo"
          width={150}
          height={30}
          className="cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      <div className="w-full h-[1px] bg-white my-4"></div>


      {/* Navigation Links */}
      {!hideHeader && (
        <nav className="flex flex-col gap-6 text-lg font-semibold">
          <button
            className={`text-left hover:opacity-65 transition-opacity cursor-pointer ${
              isActive("/organizations") ? "text-[rgb(255,14,180)]" : "text-[#faf9fb]"
            }`}
            onClick={() => router.push("/organizations")}
          >
            Organizations
          </button>
          <button
            className={`text-left hover:opacity-65 transition-opacity cursor-pointer ${
              isActive("/master-event") ? "text-[rgb(255,14,180)]" : "text-[#faf9fb]"
            }`}
            onClick={() => router.push("/master-event")}
          >
            Master Events
          </button>
        </nav>
      )}
    </motion.div>
  );
};

export default NavbarDrawer;
