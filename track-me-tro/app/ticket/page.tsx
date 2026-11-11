"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";

export default function TicketPage() {
  const router = useRouter();
  const { activeTicket, busDetails, passengerName } = useAppContext();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`track MEtro Ticket: ${activeTicket.pnr} - Seat ${activeTicket.seatNumber}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/home" className="flex items-center">
            <Logo className="h-7 w-auto" />
          </Link>
          <span className="text-slate-300">•</span>
          <Link
            href="/map"
            className="text-[12px] font-bold text-slate-600 hover:text-[#F95700] transition"
          >
            Live Map
          </Link>
        </div>

        <Link
          href="/profile"
          className="w-8 h-8 rounded-full bg-[#A53700] text-white flex items-center justify-center shadow-xs"
          aria-label="Profile"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
        </Link>
      </header>

      {/* ── Sub Navigation Controls ── */}
      <div className="max-w-[420px] w-full mx-auto px-4 pt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-white border border-[#ECEEF0] text-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95 shadow-2xs cursor-pointer"
          aria-label="Back to Home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white border border-[#ECEEF0] text-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95 shadow-2xs cursor-pointer relative"
            aria-label="Share Ticket"
            title="Share Ticket"
          >
            <span className="material-symbols-outlined text-[19px]">share</span>
            {copied && (
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#181C24] text-white text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                Copied!
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => router.push("/schedule")}
            className="w-10 h-10 rounded-full bg-white border border-[#ECEEF0] text-slate-700 flex items-center justify-center hover:bg-slate-50 transition active:scale-95 shadow-2xs cursor-pointer"
            aria-label="Options"
          >
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
        </div>
      </div>

      <main className="max-w-[420px] w-full mx-auto px-4 pt-2 space-y-4">
        {/* ── Status Header ── */}
        <div className="text-center pt-1 pb-1">
          <div className="w-12 h-12 rounded-full bg-[#A53700] text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="material-symbols-outlined text-[26px]">check</span>
          </div>
          <h1 className="text-[24px] font-black tracking-tight text-[#191C1E]">
            Your Ticket
          </h1>
          <p className="text-[12px] font-extrabold text-[#A53700] uppercase tracking-wider mt-0.5">
            BOOKING CONFIRMED
          </p>
        </div>

        {/* ── Boarding Pass Card with Ticket Cutouts ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#ECEEF0] relative overflow-hidden">
          {/* Top PNR Capsule */}
          <div className="pt-5 pb-3 text-center">
            <div className="inline-flex items-center gap-1.5 bg-[#F5DECD]/70 text-[#812900] px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
              <span>PNR: {activeTicket.pnr}</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="p-4 flex flex-col items-center">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-center relative">
              {/* High-fidelity SVG QR Code representation */}
              <svg
                viewBox="0 0 160 160"
                className="w-48 h-48 select-none"
                fill="#191C1E"
              >
                {/* Top-Left Corner Marker */}
                <rect x="10" y="10" width="36" height="36" rx="6" />
                <rect x="16" y="16" width="24" height="24" rx="3" fill="#FFFFFF" />
                <rect x="22" y="22" width="12" height="12" rx="2" />

                {/* Top-Right Corner Marker */}
                <rect x="114" y="10" width="36" height="36" rx="6" />
                <rect x="120" y="16" width="24" height="24" rx="3" fill="#FFFFFF" />
                <rect x="126" y="22" width="12" height="12" rx="2" />

                {/* Bottom-Left Corner Marker */}
                <rect x="10" y="114" width="36" height="36" rx="6" />
                <rect x="16" y="120" width="24" height="24" rx="3" fill="#FFFFFF" />
                <rect x="22" y="126" width="12" height="12" rx="2" />

                {/* High Density Data Matrix Dots */}
                <rect x="52" y="12" width="8" height="16" rx="2" />
                <rect x="68" y="14" width="12" height="8" rx="2" />
                <rect x="88" y="12" width="16" height="12" rx="2" />
                <rect x="54" y="34" width="12" height="8" rx="2" />
                <rect x="74" y="28" width="18" height="16" rx="2" />
                <rect x="98" y="32" width="8" height="12" rx="2" />

                <rect x="12" y="54" width="8" height="14" rx="2" />
                <rect x="26" y="52" width="14" height="8" rx="2" />
                <rect x="14" y="74" width="18" height="14" rx="2" />
                <rect x="26" y="94" width="14" height="10" rx="2" />

                <rect x="114" y="54" width="8" height="12" rx="2" />
                <rect x="130" y="52" width="18" height="14" rx="2" />
                <rect x="116" y="72" width="16" height="16" rx="2" />
                <rect x="138" y="74" width="12" height="12" rx="2" />
                <rect x="116" y="94" width="22" height="10" rx="2" />

                <rect x="52" y="54" width="16" height="14" rx="2" />
                <rect x="92" y="54" width="14" height="14" rx="2" />
                <rect x="52" y="92" width="14" height="14" rx="2" />
                <rect x="92" y="92" width="14" height="14" rx="2" />

                <rect x="54" y="116" width="14" height="12" rx="2" />
                <rect x="74" y="114" width="18" height="16" rx="2" />
                <rect x="98" y="120" width="8" height="12" rx="2" />
                <rect x="54" y="136" width="22" height="12" rx="2" />
                <rect x="84" y="136" width="20" height="12" rx="2" />

                {/* Center Orange Brand Dot with "mE" */}
                <circle cx="80" cy="80" r="16" fill="#F95700" />
                <text
                  x="80"
                  y="85"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="12"
                  fontWeight="900"
                  fontFamily="sans-serif"
                >
                  mE
                </text>
              </svg>
            </div>

            <p className="text-[11px] font-semibold text-slate-500 mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">qr_code_scanner</span>
              <span>Show this code at the station barrier</span>
            </p>
          </div>

          {/* Authentic Notched Ticket Separator */}
          <div className="relative py-2">
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F9FB] border-r border-[#ECEEF0]" />
            <div className="border-t border-dashed border-[#ECEEF0] mx-4" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F9FB] border-l border-[#ECEEF0]" />
          </div>

          {/* Schedule Row */}
          <div className="p-5 pt-3">
            <div className="grid grid-cols-3 items-center text-center">
              {/* Origin */}
              <div className="text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  SOGOD, SO
                </p>
                <p className="text-[20px] font-black text-[#191C1E] tracking-tight leading-none my-1">
                  08:00
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {activeTicket.date}
                </p>
              </div>

              {/* Transit Details */}
              <div className="flex flex-col items-center">
                <span className="text-[12px] font-extrabold text-[#A53700]">
                  {busDetails.id}
                </span>
                <span className="text-[10px] text-slate-400 font-medium my-0.5">
                  2 h 23 min
                </span>
                <div className="flex items-center gap-1 text-[#A53700]">
                  <span className="w-4 h-[1.5px] bg-[#A53700]" />
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </div>

              {/* Destination */}
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  ORMOC CITY, LEYTE
                </p>
                <p className="text-[20px] font-black text-[#191C1E] tracking-tight leading-none my-1">
                  10:23
                </p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {activeTicket.date}
                </p>
              </div>
            </div>

            {/* Passenger & Fare Info */}
            <div className="grid grid-cols-3 items-center pt-4 mt-4 border-t border-[#ECEEF0]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  PASSENGER
                </p>
                <p className="text-[13px] font-bold text-[#191C1E] truncate">
                  {passengerName}
                </p>
              </div>

              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  SEAT
                </p>
                <div className="inline-flex w-7 h-7 rounded-full bg-[#FFE8D6] text-[#A53700] items-center justify-center font-black text-[13px]">
                  {activeTicket.seatNumber}
                </div>
              </div>

              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                  PAID
                </p>
                <p className="text-[15px] font-black text-[#A53700]">
                  ₱{activeTicket.totalFare.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              alert("Digital boarding pass saved to Apple Wallet / Google Wallet!");
            }}
            className="py-3 px-4 rounded-2xl bg-white border border-[#ECEEF0] text-[#191C1E] font-bold text-[13px] shadow-2xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px] text-[#A53700]">account_balance_wallet</span>
            <span>Save to Wallet</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/map")}
            className="py-3 px-4 rounded-2xl bg-[#A53700] hover:bg-[#812900] text-white font-extrabold text-[13px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
          >
            <span className="material-symbols-outlined text-[17px]">near_me</span>
            <span>Track Bus</span>
          </button>
        </div>
      </main>

      {/* ── Floating Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
