"use client";

import React, { useEffect } from "react";
import { useAppContext } from "@/lib/AppContext";
import CrownIcon from "@/components/CrownIcon";

interface MetroPlusModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureNotice?: string;
}

export default function MetroPlusModal({
  isOpen,
  onClose,
  featureNotice,
}: MetroPlusModalProps) {
  const { isPremium, setIsPremium, setIsModalOpen } = useAppContext();

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      return () => {
        setIsModalOpen(false);
      };
    }
  }, [isOpen, setIsModalOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-[420px] w-full p-6 shadow-2xl border border-[#ECEEF0] space-y-4 animate-scale-up relative overflow-hidden text-left">
        {/* Warm peach subtle radial glow */}
        <div className="absolute -top-14 -right-14 w-40 h-40 rounded-full bg-[#FFE8D6] blur-2xl pointer-events-none" />

        {/* Top Header: Badge & Close Button */}
        <div className="flex items-center justify-between relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-[#F95700] text-white px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs">
            <CrownIcon className="w-3.5 h-3.5 text-amber-100" />
            <span>MEtro+ PREMIUM</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs cursor-pointer transition active:scale-95"
            aria-label="Close MEtro+ Modal"
          >
            ✕
          </button>
        </div>

        {/* Headline & Optional Feature Context Notice */}
        <div className="space-y-1 relative z-10">
          <h3 className="text-[22px] font-black tracking-tight text-[#191C1E] leading-tight">
            MEtro+ Premium
          </h3>
          <p className="text-[12px] text-slate-500 font-medium leading-snug">
            {featureNotice || "Upgrade your transit experience with exclusive Leyte corridor privileges:"}
          </p>
        </div>

        {/* Current Tier Status Capsule */}
        <div className="p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center">
              {isPremium ? (
                <CrownIcon className="w-4 h-4 text-amber-600" />
              ) : (
                <span className="material-symbols-outlined text-[17px] text-slate-500">person</span>
              )}
            </span>
            <span className="font-extrabold text-amber-900">
              Current Status:{" "}
              <span className="underline decoration-amber-500">
                {isPremium ? "MEtro+ Member (Active)" : "Free Tier Commuter"}
              </span>
            </span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-amber-800 shadow-2xs">
            {isPremium ? "VIP Access" : "Standard"}
          </span>
        </div>

        {/* ── 4 Core Perks Breakdown: Free vs MEtro+ ── */}
        <div className="space-y-2.5 relative z-10 text-xs max-h-[300px] overflow-y-auto pr-1">
          {/* Perk 1: Full Bus Info */}
          <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#F95700] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[13px] text-[#191C1E] tracking-tight">
                  Full Bus Information
                </h4>
                <span className="text-[9px] font-black text-[#F95700] bg-[#FFE8D6] px-1.5 py-0.5 rounded">
                  MEtro+ Only
                </span>
              </div>
              <p className="text-slate-600 font-medium text-[11px] mt-0.5 leading-snug">
                View real-time unit numbers (e.g. <span className="font-bold text-slate-800">DMS-054</span>), airconditioned vs non-aircon class, and verified assigned driver details.
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Free Tier: Masked unit #</span>
                <span className="font-bold text-emerald-700">MEtro+: 100% Full Specs</span>
              </div>
            </div>
          </div>

          {/* Perk 2: Reserve a Seat */}
          <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">airline_seat_recline_extra</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[13px] text-[#191C1E] tracking-tight">
                  Seat Reservation
                </h4>
                <span className="text-[9px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                  MEtro+ Only
                </span>
              </div>
              <p className="text-slate-600 font-medium text-[11px] mt-0.5 leading-snug">
                Reserve your favorite window or aisle seat in advance before you arrive at Sogod or Ormoc terminal.
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Free Tier: Queue at gate</span>
                <span className="font-bold text-emerald-700">MEtro+: Guaranteed Seat</span>
              </div>
            </div>
          </div>

          {/* Perk 3: Live Passenger Count */}
          <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[13px] text-[#191C1E] tracking-tight">
                  Passengers On Board
                </h4>
                <span className="text-[9px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                  MEtro+ Only
                </span>
              </div>
              <p className="text-slate-600 font-medium text-[11px] mt-0.5 leading-snug">
                Live headcount telemetry showing exactly how many passengers are seated on incoming buses before they reach your stop.
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Free Tier: Capacity locked</span>
                <span className="font-bold text-emerald-700">MEtro+: Live Crowd Meter</span>
              </div>
            </div>
          </div>

          {/* Perk 4: No Ads */}
          <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">block</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-[13px] text-[#191C1E] tracking-tight">
                  No Ads
                </h4>
                <span className="text-[9px] font-black text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded">
                  MEtro+ Only
                </span>
              </div>
              <p className="text-slate-600 font-medium text-[11px] mt-0.5 leading-snug">
                Clean, distraction-free interface with all local cafe promotions, sponsored cards, and banners removed.
              </p>
              <div className="mt-1.5 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                <span>Free Tier: Shows local ads</span>
                <span className="font-bold text-emerald-700">MEtro+: 100% Ad-Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Actions: Toggle / Activate / Close ── */}
        <div className="space-y-2 pt-1 relative z-10">
          {!isPremium ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsPremium(true);
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#F95700] to-[#E04E00] hover:brightness-105 active:scale-[0.98] text-white rounded-full font-black text-[14px] tracking-tight shadow-[0_8px_20px_rgba(249,87,0,0.35)] transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Activate MEtro+ (Free 7-Day Trial)</span>
                <span className="material-symbols-outlined text-[17px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-slate-500 hover:text-slate-800 font-bold text-[12px] transition cursor-pointer text-center block"
              >
                Stay on Free Tier
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 bg-[#181C24] hover:bg-black text-white rounded-full font-black text-[13px] shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
                <span>Enjoy MEtro+ Privileges</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPremium(false);
                  onClose();
                }}
                className="w-full py-2 text-slate-400 hover:text-rose-600 font-bold text-[11px] transition cursor-pointer text-center block"
              >
                Switch back to Free Tier (Demo Toggle)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
