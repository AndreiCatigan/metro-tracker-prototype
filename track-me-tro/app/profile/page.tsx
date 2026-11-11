"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import BottomNavigation from "@/components/BottomNavigation";

export default function ProfilePage() {
  const router = useRouter();
  const { passengerName } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32">
      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[420px] w-full mx-auto px-4 pt-8 space-y-5">
        {/* ── User Avatar & Identity ── */}
        <div className="text-center space-y-2">
          {/* Circular Line Avatar Matching Image 8 */}
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
              {/* Minimal Line Illustration of Head / Hair */}
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

        {/* ── Pitch Demo Shortcut: Conductor Mode ── */}
        <div className="bg-gradient-to-r from-[#181C24] to-[#2D3133] rounded-3xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F95700] bg-[#F95700]/10 px-2 py-0.5 rounded-full">
                Pitch Demo Switcher
              </span>
              <h3 className="font-extrabold text-[15px] mt-1">Conductor App Mode</h3>
              <p className="text-[11px] text-slate-300">
                Inspect real-time passenger manifests &amp; QR scan validations.
              </p>
            </div>
            <Link
              href="/conductor"
              className="px-3.5 py-2 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-xs shadow-sm transition flex items-center gap-1"
            >
              <span>Open</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>

      {/* ── Floating Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
