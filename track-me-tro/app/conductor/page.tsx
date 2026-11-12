"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import Logo from "@/components/Logo";

export default function ConductorAuthPage() {
  const router = useRouter();
  const { busDetails, passengerHails } = useAppContext();

  const [employeeId, setEmployeeId] = useState("EMP-8842");
  const [pin, setPin] = useState("1234");
  const [showPin, setShowPin] = useState(false);
  const [direction, setDirection] = useState<"outbound" | "inbound">("outbound");
  const [isStarting, setIsStarting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStartTrip = () => {
    setIsStarting(true);
    showToast("GPS lock acquired. Dispatching Bus DMS-048...");
    setTimeout(() => {
      router.push("/conductor/matrix");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-12">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">wifi_tethering</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header ── */}
      <header className="pt-6 pb-4 px-4 text-center">
        <div className="inline-flex items-center gap-2">
          <Logo className="h-10 w-auto" />
          <span className="inline-flex items-center gap-1 bg-[#181C24] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] animate-pulse" />
            <span>CREW</span>
          </span>
        </div>
        <p className="text-[10px] font-black text-[#A53700] uppercase tracking-widest mt-1 flex items-center justify-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
          <span>BUS CREW TERMINAL • LEYTE ROUTE DISPATCH</span>
        </p>
      </header>

      <main className="max-w-[420px] w-full mx-auto px-4 space-y-4">
        {/* ── Active Advance Hails Notice ── */}
        {passengerHails && passengerHails.length > 0 && (
          <div className="bg-[#FFE8D6] border border-[#F95700] rounded-2xl p-3 flex items-center justify-between text-xs animate-fade-in shadow-2xs">
            <div className="flex items-center gap-2 text-[#A53700] font-black">
              <span className="material-symbols-outlined text-[18px]">cell_tower</span>
              <span>{passengerHails.length} Passenger(s) Hailing Ahead on Route!</span>
            </div>
            <button
              type="button"
              onClick={() => router.push("/conductor/matrix")}
              className="py-1 px-2.5 rounded-lg bg-[#F95700] text-white font-black text-[10px] hover:bg-[#E04E00] transition active:scale-95 cursor-pointer"
            >
              View Queue
            </button>
          </div>
        )}

        {/* ── Card 1: Conductor Authentication ── */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <h2 className="text-[16px] font-black text-[#191C1E] tracking-tight">
                Conductor Authentication
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Verify crew ID credentials
              </p>
            </div>
          </div>

          {/* Employee ID Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">EMPLOYEE ID</span>
              <span className="text-[#A53700] bg-[#FFE8D6] px-1.5 py-0.5 rounded text-[9px] font-black">
                REQ
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F2F4F6] border border-[#ECEEF0] rounded-2xl px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px] text-slate-500">assignment_ind</span>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="bg-transparent font-black text-[15px] text-[#191C1E] tracking-wide outline-none w-36"
                  placeholder="EMP-8842"
                />
              </div>
              <span className="w-5 h-5 rounded-full bg-[#A53700] text-white flex items-center justify-center text-[11px] font-black shadow-2xs">
                ✓
              </span>
            </div>
          </div>

          {/* 4-Digit PIN Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500 uppercase tracking-wider">4-DIGIT SECURITY PIN</span>
              <span className="text-slate-400 font-semibold tracking-wider text-[10px]">
                SHIFT PASSCODE
              </span>
            </div>
            <div className="flex items-center justify-between bg-[#F2F4F6] border border-[#ECEEF0] rounded-2xl px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[19px] text-slate-500">lock</span>
                {showPin ? (
                  <input
                    type="text"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="bg-transparent font-black text-[15px] text-[#191C1E] tracking-widest outline-none w-28"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#191C1E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#191C1E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#191C1E]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#191C1E]" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-slate-500 hover:text-slate-700 cursor-pointer"
                aria-label="Toggle PIN Visibility"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPin ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold px-1 pt-0.5">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">touch_app</span>
                <span>High-sensitivity keypad mode</span>
              </span>
              <button
                type="button"
                onClick={() => showToast("Security PIN reset code sent to terminal dispatcher.")}
                className="text-[#A53700] hover:underline cursor-pointer"
              >
                Reset PIN
              </button>
            </div>
          </div>
        </section>

        {/* ── Card 2: Assigned Bus & Corridor ── */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E0E8F0] text-slate-700 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">directions_bus</span>
              </div>
              <div>
                <h2 className="text-[16px] font-black text-[#191C1E] tracking-tight">
                  Assigned Bus &amp; Corridor
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Vehicle allocation for shift
                </p>
              </div>
            </div>
            <span className="bg-[#FFE8D6] text-[#A53700] px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">
              ROUTE 04
            </span>
          </div>

          {/* Assigned Bus Unit Box */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              ASSIGNED BUS UNIT
            </p>
            <div className="bg-[#F2F4F6] border border-[#ECEEF0] rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#181C24] text-white flex items-center justify-center font-black text-[14px]">
                  48
                </div>
                <div>
                  <h3 className="text-[15px] font-black text-[#191C1E]">
                    Bus {busDetails.id}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    AIRCON EXPRESS • 45 Seats
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-400 text-[20px]">
                unfold_more
              </span>
            </div>
          </div>

          {/* Route Direction Switcher */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                ROUTE DIRECTION (OUTBOUND/INBOUND)
              </span>
              <span className="text-slate-400 font-semibold text-[10px]">
                Tap to switch
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDirection("outbound")}
                className={`p-3 rounded-2xl text-center transition-all cursor-pointer ${
                  direction === "outbound"
                    ? "bg-[#812900] text-white shadow-sm"
                    : "bg-[#F2F4F6] text-slate-700 hover:bg-[#E6E8EA]"
                }`}
              >
                <p className="text-[13px] font-black">Sogod ➔ Ormoc</p>
                <p className="text-[10px] opacity-80 font-medium">Via Bato &amp; Baybay</p>
              </button>

              <button
                type="button"
                onClick={() => setDirection("inbound")}
                className={`p-3 rounded-2xl text-center transition-all cursor-pointer ${
                  direction === "inbound"
                    ? "bg-[#812900] text-white shadow-sm"
                    : "bg-[#F2F4F6] text-slate-700 hover:bg-[#E6E8EA]"
                }`}
              >
                <p className="text-[13px] font-black">Ormoc ➔ Sogod</p>
                <p className="text-[10px] opacity-80 font-medium">Return Trip</p>
              </button>
            </div>
          </div>
        </section>

        {/* ── Status Strip ── */}
        <div className="bg-white rounded-2xl px-4 py-2.5 shadow-2xs border border-[#ECEEF0] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="font-extrabold text-[#191C1E]">DISPATCH SYSTEM LIVE</p>
              <p className="text-[10px] text-slate-400 font-medium">
                GPS Lock: High Acc. • Fare Engine Sync: 100%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#F2F4F6] px-2 py-1 rounded-full text-slate-700 font-black text-[10px]">
            <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
            <span>4G LTE</span>
          </div>
        </div>

        {/* ── Action CTA ── */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isStarting}
            onClick={handleStartTrip}
            className="w-full py-4 px-4 rounded-full bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-black text-[15px] shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isStarting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synchronizing Manifest...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[17px]">near_me</span>
                </span>
                <span>START TRIP &amp; ENABLE GPS</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center font-medium px-4">
            Logs crew dispatch timestamp and broadcasts real-time GPS coordinates to commuter app
          </p>
        </div>

        {/* ── Pitch Demo Navigation Link ── */}
        <div className="pt-3 text-center">
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#A53700] font-bold transition py-1 px-3 rounded-full hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[15px]">phone_iphone</span>
            <span>Switch to Passenger App</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
