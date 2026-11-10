"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/home", icon: "home" },
    { label: "Live Map", href: "/map", icon: "map" },
    { label: "Profile", href: "/profile", icon: "person" },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className="w-full max-w-[360px] bg-[#181C24] text-white rounded-full py-2 px-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)] flex items-center justify-around pointer-events-auto border border-white/10"
        aria-label="Main Navigation"
      >
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/home" && pathname === "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-4 rounded-full transition-all duration-200 ${
                isActive
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] leading-none mb-0.5 ${
                  isActive ? "text-[#F95700]" : "text-slate-400"
                }`}
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] tracking-tight ${
                  isActive ? "text-white font-bold" : "text-slate-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
