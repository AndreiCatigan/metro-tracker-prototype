"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import ScheduleList from "@/components/ScheduleList";

export default function SchedulePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back to Home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">
            Bus Schedule
          </h1>
          <p className="text-[11px] font-semibold text-slate-500">
            Daily Corridor Timetable
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#FFE8D6] text-[#A53700] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A53700] animate-pulse" />
          <span>LIVE SYNC</span>
        </div>
      </header>

      {/* ── Main Schedule Content ── */}
      <main className="max-w-[440px] w-full mx-auto px-4 pt-4 space-y-4">
        {/* Real-time Dispatch Active Notice */}
        <div className="bg-[#FFE8D6]/60 border border-[#F5DECD] rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F95700] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[20px]">directions_bus</span>
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-[#191C1E]">
              Continuous Terminal Dispatch
            </p>
            <p className="text-slate-600 text-[11px] mt-0.5">
              Buses take passengers for 30–45 mins before scheduled departure. Active units are GPS-tracked in real-time.
            </p>
          </div>
        </div>

        {/* ── Schedule List with Tabs ── */}
        <ScheduleList initialDirection="sogod-ormoc" />

        {/* ── Quick Live Map Banner ── */}
        <div className="pt-2">
          <Link
            href="/map"
            className="w-full bg-[#181C24] hover:bg-black text-white p-3.5 rounded-2xl flex items-center justify-between shadow-md transition active:scale-98"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F95700] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">near_me</span>
              </div>
              <div className="text-left">
                <p className="text-xs font-black">Track Buses on Live Map</p>
                <p className="text-[10px] text-slate-400">See real-time GPS locations &amp; distance away</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#F95700]">chevron_right</span>
          </Link>
        </div>
      </main>

      {/* ── Bottom Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
