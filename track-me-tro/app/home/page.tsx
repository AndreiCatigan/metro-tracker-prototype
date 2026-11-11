"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";
import ScheduleList from "@/components/ScheduleList";
import { useAppContext } from "@/lib/AppContext";

export default function HomePage() {
  const router = useRouter();
  const { passengerName } = useAppContext();

  // Extract first name for personalized greeting
  const firstName = passengerName ? passengerName.split(" ")[0] : "Juana";

  // State for swapping origin and destination
  const [origin, setOrigin] = useState("Sogod, Southern Leyte");
  const [destination, setDestination] = useState("Ormoc City, Leyte");

  // Calendar dates state
  const [selectedDate, setSelectedDate] = useState("03");
  const [showNotifications, setShowNotifications] = useState(false);

  const daysOfWeek = [
    { day: "S", date: "01" },
    { day: "M", date: "02" },
    { day: "T", date: "03" },
    { day: "W", date: "04" },
    { day: "T", date: "05" },
    { day: "F", date: "06" },
    { day: "S", date: "07" },
  ];

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32 select-none">
      {/* ── Notification Modal / Drawer ── */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4 border border-[#ECEEF0] animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#ECEEF0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#F95700]">notifications</span>
                <h3 className="font-black text-[16px] text-[#191C1E]">Notifications</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="w-7 h-7 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-[#FFE8D6]/60 rounded-2xl border border-[#F5DECD] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#A53700]">Boarding Alert</span>
                  <span className="text-[10px] text-slate-400">Just Now</span>
                </div>
                <p className="text-slate-700 font-medium">
                  Bus DMS-048 is currently boarding at Sogod Terminal (Bay 2). Scheduled departure: 5:00 AM.
                </p>
              </div>

              <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#191C1E]">Route Advisory</span>
                  <span className="text-[10px] text-slate-400">1h ago</span>
                </div>
                <p className="text-slate-600 font-medium">
                  Mahaplag to Baybay City highway is clear. All regional trips on schedule.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotifications(false)}
              className="w-full py-3 bg-[#181C24] text-white rounded-2xl font-black text-xs hover:bg-black transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Warm Peach Hero Section (Exact Aesthetic from Attached Image) ── */}
      <section className="relative w-full bg-[#FFDFC9] pt-8 pb-16 px-6 overflow-hidden">
        {/* Background Stylized Curvy Ribbon / Bus Track Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-44 pointer-events-none opacity-45 overflow-hidden">
          <svg
            className="w-full h-full text-[#F89C6B]"
            viewBox="0 0 160 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M130 -20 C130 50, 40 50, 40 100 C40 150, 130 150, 130 200 C130 250, 50 250, 50 300"
              stroke="currentColor"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="max-w-[440px] mx-auto relative z-10">
          {/* Header Row: Logo & Notification Bell */}
          <div className="flex items-center justify-between">
            <Logo className="h-11 w-auto" />

            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-slate-800 shadow-2xs hover:bg-white/60 transition active:scale-95 cursor-pointer relative"
              aria-label="Open Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F95700] ring-2 ring-white" />
            </button>
          </div>

          {/* Hero Headline */}
          <div className="mt-6 space-y-1">
            <h1 className="text-[34px] font-black tracking-tight text-[#191C1E] leading-[1.12]">
              Where to,<br />
              {firstName}?
            </h1>
            <p className="text-[11px] font-black text-[#A53700] uppercase tracking-wider pt-0.5">
              Eastern Visayas • Live Transit Network
            </p>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ── */}
      <main className="max-w-[440px] w-full mx-auto px-4 -mt-8 relative z-20 space-y-6">
        {/* ── Elevated Route Input Card (Exact Aesthetic from Attached Image) ── */}
        <section className="bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ECEEF0] space-y-4">
          <div className="flex items-center gap-3">
            {/* Left Route Connector Graphics: Circle, Line, Orange Filled Dot */}
            <div className="flex flex-col items-center justify-between h-24 py-1 flex-shrink-0">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-white" />
              <div className="w-[1.5px] h-12 bg-slate-200" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#F95700] ring-2 ring-[#FFE8D6]" />
            </div>

            {/* Inputs: Origin & Destination */}
            <div className="flex-1 space-y-3">
              {/* Origin Field */}
              <div className="border-b border-[#ECEEF0] pb-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  ORIGIN
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent font-extrabold text-[15px] text-[#191C1E] outline-none tracking-tight pt-0.5"
                  placeholder="Sogod, Southern Leyte"
                />
              </div>

              {/* Destination Field */}
              <div className="border-b border-[#ECEEF0] pb-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  DESTINATION
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent font-extrabold text-[15px] text-[#191C1E] outline-none tracking-tight pt-0.5"
                  placeholder="Ormoc City, Leyte"
                />
              </div>
            </div>

            {/* Circular Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-11 h-11 rounded-full bg-[#E0E8F0] hover:bg-[#D0DCE8] text-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-2xs flex-shrink-0"
              aria-label="Swap Origin and Destination"
              title="Swap Route Direction"
            >
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </button>
          </div>

          {/* Primary Action Button: Track Live Buses */}
          <button
            type="button"
            onClick={() => router.push("/map")}
            className="w-full py-4 px-6 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[16px] tracking-tight shadow-[0_8px_24px_rgba(249,87,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>Track Live Buses</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </section>

        {/* ── Book A Ticket Section & Date Selector (Matching Attached Image) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[18px] font-black tracking-tight text-[#191C1E] flex items-center gap-1.5">
              <span>Book A Ticket</span>
              <span className="text-amber-500 text-[16px]">👑</span>
            </h2>
            <span className="text-[11px] font-bold text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full">
              Express Booking
            </span>
          </div>

          {/* Mini-Calendar Card */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#ECEEF0] space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-extrabold text-[15px] text-[#191C1E]">
                November 2026
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#E0E8F0] text-slate-600 hover:bg-[#D0DCE8] flex items-center justify-center transition cursor-pointer"
                  aria-label="Previous week"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#E0E8F0] text-slate-600 hover:bg-[#D0DCE8] flex items-center justify-center transition cursor-pointer"
                  aria-label="Next week"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map((item) => {
                const isSelected = selectedDate === item.date;

                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? "bg-[#FFDBCA] text-[#191C1E] shadow-2xs font-black ring-2 ring-[#F95700]/30"
                        : "text-slate-600 hover:bg-slate-50 font-bold"
                    }`}
                  >
                    <span className="text-[11px] text-slate-400 font-semibold mb-0.5">
                      {item.day}
                    </span>
                    <span className="text-[14px] leading-tight">{item.date}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Metro Bus Schedule Section (Continuous 30-min intervals) ── */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-[18px] font-black tracking-tight text-[#191C1E]">
                Metro Bus Schedule
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold">
                Continuous 30–45 min passenger boarding cycle
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/schedule")}
              className="text-[12px] font-extrabold text-[#F95700] hover:underline cursor-pointer"
            >
              View Full ➔
            </button>
          </div>

          {/* Full Schedule List Component with Tabs & Details */}
          <ScheduleList initialDirection="sogod-ormoc" />
        </section>
      </main>

      {/* ── Bottom Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
