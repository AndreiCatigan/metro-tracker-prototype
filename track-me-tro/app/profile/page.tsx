"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext, SimulatedTime } from "@/lib/AppContext";
import { CORRIDOR_STOPS, TRAVEL_TIMES_FROM_SOGOD } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";

export default function ProfilePage() {
  const router = useRouter();
  const {
    passengerName,
    userLocation,
    setUserLocation,
    simulatedTime,
    setSimulatedTime,
  } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLocationChange = (stop: string) => {
    setUserLocation(stop);
    const mins = TRAVEL_TIMES_FROM_SOGOD[stop] ?? 0;
    const timeStr = mins === 0 ? "At Origin" : `+${Math.floor(mins / 60)}h ${mins % 60}m from Sogod`;
    showToast(`Location set to ${stop} (${timeStr}). Bus ETAs updated!`);
  };

  const handleTimeChange = (time: SimulatedTime) => {
    setSimulatedTime(time);
    showToast(`Simulated time set to ${time}. Bus schedule updated!`);
  };

  const currentMins = TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 115;

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-36">
      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[420px] w-full mx-auto px-4 pt-8 space-y-4">
        {/* ── User Avatar & Identity ── */}
        <div className="text-center space-y-2">
          {/* Circular Line Avatar */}
          <div className="w-24 h-24 rounded-full border border-slate-300 mx-auto flex items-center justify-center p-2 bg-white shadow-2xs">
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16 text-slate-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M50 18 C38 18 32 30 32 45 C32 58 40 68 50 68 C60 68 68 58 68 45 C68 30 62 18 50 18 Z" />
              <path d="M42 24 C44 32 46 44 46 54" />
              <path d="M58 24 C56 32 54 44 54 54" />
              <path d="M50 20 L50 48" />
              <path d="M36 40 C34 50 28 68 22 78" />
              <path d="M64 40 C66 50 72 68 78 78" />
              <path d="M44 60 L50 68 L56 60" />
            </svg>
          </div>

          <div>
            <h1 className="text-[20px] font-black tracking-tight text-[#191C1E]">
              {passengerName}
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              juana.delacruz@gmail.com • 09123456781
            </p>
          </div>
        </div>

        {/* ── Explore Premium CTA ── */}
        <button
          type="button"
          onClick={() =>
            showToast("track MEtro VIP: Unlimited seat reservations with zero convenience fee!")
          }
          className="w-full py-3.5 px-4 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[14px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Explore Premium</span>
          <span className="text-[16px]">👑</span>
        </button>

        {/* ── Menu Card 1: Settings & About ── */}
        <div className="bg-white rounded-3xl p-2 shadow-xs border border-[#ECEEF0] divide-y divide-[#ECEEF0]">
          {/* App Settings */}
          <button
            type="button"
            onClick={() => showToast("Push notifications & vibration alerts enabled.")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0E8F0] text-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">settings</span>
              </div>
              <span className="text-[14px] font-bold text-[#191C1E]">App Settings</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>

          {/* About */}
          <button
            type="button"
            onClick={() =>
              showToast("track MEtro v1.0.0 — Leyte Regional Transit Network")
            }
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0E8F0] text-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">info</span>
              </div>
              <span className="text-[14px] font-bold text-[#191C1E]">About</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>

          {/* Share the App */}
          <button
            type="button"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText("https://track-metro.leyte.ph");
                showToast("App invite link copied to clipboard!");
              }
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0E8F0] text-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">share</span>
              </div>
              <span className="text-[14px] font-bold text-[#191C1E]">Share the app</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-slate-400">chevron_right</span>
          </button>
        </div>

        {/* ── Menu Card 2: Support ── */}
        <div className="bg-white rounded-3xl p-2 shadow-xs border border-[#ECEEF0]">
          <button
            type="button"
            onClick={() => showToast("Calling Leyte Transit Hotline: (053) 563-8899")}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50/80 rounded-2xl transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#E0E8F0] text-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[19px]">headphones</span>
              </div>
              <span className="text-[14px] font-bold text-[#191C1E]">Customer Service</span>
            </div>
          </button>
        </div>

        {/* ── Log Out Button ── */}
        <div className="bg-white rounded-3xl p-2 shadow-xs border border-[#ECEEF0]">
          <button
            type="button"
            onClick={() => {
              showToast("Logging out of track MEtro...");
              setTimeout(() => {
                router.push("/");
              }, 700);
            }}
            className="w-full p-3.5 flex items-center justify-between hover:bg-rose-50/60 rounded-2xl transition cursor-pointer text-left text-rose-600 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition">
                <span className="material-symbols-outlined text-[19px]">logout</span>
              </div>
              <span className="text-[14px] font-bold text-rose-600">Log Out</span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-rose-400">arrow_forward</span>
          </button>
        </div>

        {/* ── CONSOLIDATED DISCREET DEMO SIMULATION CONTROLS (Tucked at Bottom) ── */}
        <section className="bg-slate-100/90 rounded-3xl p-4 border border-slate-200/80 space-y-3.5 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
              <span>Demo Simulation Controls</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Pitch Controls</span>
          </div>

          {/* 1. Conductor App Mode Switcher (Merged inside Demo Controls) */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#101A2C] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div>
                <p className="text-[13px] font-black text-[#191C1E]">Conductor App Mode</p>
                <p className="text-[10px] text-slate-400 font-medium">Manifests &amp; POS ticketing</p>
              </div>
            </div>

            <Link
              href="/conductor"
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[11px] shadow-2xs transition flex items-center gap-1"
            >
              <span>Switch</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* 2. Simulated Clock: 9 AM, 2 PM, 4 PM */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Set Simulated Time:</span>
              <span className="font-black text-[#A53700]">{simulatedTime}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
              {(["9:00 AM", "2:00 PM", "4:00 PM"] as SimulatedTime[]).map((timeOption) => {
                const isActive = simulatedTime === timeOption;
                return (
                  <button
                    key={timeOption}
                    type="button"
                    onClick={() => handleTimeChange(timeOption)}
                    className={`py-2 px-1 rounded-xl text-[12px] font-black transition cursor-pointer text-center ${
                      isActive
                        ? "bg-[#181C24] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {timeOption}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Simulated Location (Corridor Stop) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Set Commuter Location (GPS):</span>
              <span className="text-[10px] font-bold text-slate-400">
                {currentMins === 0 ? "Origin" : `+${Math.floor(currentMins / 60)}h ${currentMins % 60}m`}
              </span>
            </div>

            <select
              value={userLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-800 outline-none cursor-pointer"
            >
              {CORRIDOR_STOPS.map((stop) => {
                const mins = TRAVEL_TIMES_FROM_SOGOD[stop] ?? 0;
                const timeLabel = mins === 0 ? "0m • Origin" : `+${Math.floor(mins / 60)}h ${mins % 60}m`;
                return (
                  <option key={stop} value={stop}>
                    {stop} ({timeLabel})
                  </option>
                );
              })}
            </select>
          </div>
        </section>
      </main>

      {/* ── Floating Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
