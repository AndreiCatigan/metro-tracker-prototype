"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";

export default function ConductorScanPage() {
  const router = useRouter();
  const { activeTicket, validateTicketBoarding, markNoShow, currentBusStop, busDetails } = useAppContext();

  const [torchOn, setTorchOn] = useState(false);
  const [boarded, setBoarded] = useState(activeTicket?.isBoarded || false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleConfirmBoarding = () => {
    setBoarded(true);
    validateTicketBoarding(activeTicket.pnr);
    showToast(`✓ Passenger ${activeTicket.passengerName} (Seat ${activeTicket.seatNumber}) Boarded! (+1 to Headcount)`);
    setTimeout(() => {
      router.push("/conductor");
    }, 1200);
  };

  const handleMarkNoShow = () => {
    markNoShow(activeTicket.seatNumber);
    showToast(`Seat ${activeTicket.seatNumber} marked as No-Show. Releasing to walk-in queue.`);
    setTimeout(() => {
      router.push("/conductor");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Camera Viewfinder Area (Top Section) ── */}
      <div className="relative h-[280px] w-full flex flex-col justify-between p-4 bg-radial from-slate-800 via-slate-900 to-black overflow-hidden">
        {/* Subtle camera view background representation */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none bg-cover bg-center"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, rgba(249,87,0,0.15) 0%, rgba(0,0,0,0.85) 100%)",
          }}
        />

        {/* Top Viewfinder Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/conductor")}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30 transition active:scale-95 cursor-pointer"
            aria-label="Back to Conductor Dashboard"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => showToast("Enter PNR dialog: ER902624726 matched.")}
              className="bg-white/20 backdrop-blur-md text-white px-3.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 hover:bg-white/30 transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">dialpad</span>
              <span>ENTER PNR MANUALLY</span>
            </button>
            <p className="text-[10px] text-white/70 font-medium mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] inline-block mr-1" />
              Bus DMS-048 • Baybay Terminal
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setTorchOn(!torchOn);
              showToast(torchOn ? "Camera torch disabled." : "Camera torch enabled.");
            }}
            className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition active:scale-95 cursor-pointer ${
              torchOn
                ? "bg-[#FFCC00] text-black shadow-lg"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
            aria-label="Toggle Torch"
          >
            <span className="material-symbols-outlined text-[19px]">
              {torchOn ? "flashlight_on" : "flashlight_off"}
            </span>
          </button>
        </div>

        {/* Scanner Reticle HUD */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          <div className="relative w-44 h-44 rounded-2xl flex items-center justify-center">
            {/* 4 Glowing Orange Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-3 border-l-3 border-[#F95700] rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-3 border-r-3 border-[#F95700] rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-3 border-l-3 border-[#F95700] rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-3 border-r-3 border-[#F95700] rounded-br-lg" />

            {/* Scanning Laser Beam */}
            <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#F95700] to-transparent animate-pulse" />

            <div className="text-center space-y-1">
              <span className="material-symbols-outlined text-white/80 text-[26px]">
                filter_center_focus
              </span>
              <p className="text-[10px] font-black uppercase tracking-wider text-white/90">
                ALIGN PASSENGER PASS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Ticket Verified Bottom Sheet Card ── */}
      <div className="relative z-20 flex-1 bg-white text-[#191C1E] rounded-t-3xl p-5 shadow-2xl -mt-6 space-y-4">
        {/* Verification Check Badge */}
        <div className="text-center pt-1">
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2 shadow-md">
            <span className="material-symbols-outlined text-[26px]">check</span>
          </div>
          <h2 className="text-[20px] font-black tracking-tight text-[#191C1E]">
            Ticket Verified
          </h2>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-0.5 rounded-full text-[11px] font-black tracking-wide mt-1">
            <span className="material-symbols-outlined text-[13px]">verified</span>
            <span>PNR #{activeTicket.pnr} • VALIDATED</span>
          </div>
        </div>

        {/* Passenger Profile Card */}
        <div className="bg-[#F7F9FB] rounded-2xl p-3.5 border border-[#ECEEF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#181C24] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
            <div>
              <h3 className="text-[15px] font-black text-[#191C1E] leading-tight">
                {activeTicket.passengerName || "Juana de la Cruz"}
              </h3>
              <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">verified_user</span>
                <span className="capitalize">{activeTicket.passengerType || "Regular"} Passenger</span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="bg-[#101A2C] text-white px-3 py-1 rounded-xl font-black text-[14px] shadow-xs inline-block">
              Seat {activeTicket.seatNumber}
            </span>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">
              APP RESERVED
            </p>
          </div>
        </div>

        {/* 3 Metrics Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#F7F9FB] rounded-2xl p-2.5 border border-[#ECEEF0]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              FARE PAID
            </p>
            <p className="text-[16px] font-black text-[#A53700] my-0.5">
              ₱{activeTicket.totalFare.toFixed(2)}
            </p>
            <p className="text-[9px] font-bold text-emerald-700 flex items-center justify-center gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{activeTicket.paymentMethod} Confirmed</span>
            </p>
          </div>

          <div className="bg-[#F7F9FB] rounded-2xl p-2.5 border border-[#ECEEF0]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              STATUS
            </p>
            <p className={`text-[13px] font-black my-1 ${boarded ? "text-emerald-700" : "text-amber-700"}`}>
              {boarded ? "Boarded ✓" : "Paid Pass"}
            </p>
            <p className="text-[9px] text-slate-500 font-medium">Verified E-Ticket</p>
          </div>

          <div className="bg-[#F7F9FB] rounded-2xl p-2.5 border border-[#ECEEF0]">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              BUS UNIT
            </p>
            <p className="text-[15px] font-black text-[#191C1E] my-0.5">
              {busDetails.id}
            </p>
            <p className="text-[9px] text-slate-500 font-medium">Aircon Express</p>
          </div>
        </div>

        {/* Route Corridor Card */}
        <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] flex items-center justify-between text-xs">
          <div>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              BOARDING AT
            </p>
            <p className="text-[13px] font-black text-[#191C1E] mt-0.5">
              {activeTicket.origin.split(",")[0] || currentBusStop}
            </p>
          </div>

          <div className="flex flex-col items-center px-2">
            <span className="text-[9px] font-bold text-slate-400">Direct Route</span>
            <div className="flex items-center gap-1 text-[#A53700]">
              <span className="w-6 h-[1.5px] bg-[#A53700]" />
              <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
              BOUND FOR
            </p>
            <p className="text-[13px] font-black text-[#191C1E] mt-0.5">
              {activeTicket.destination.split(",")[0] || "Ormoc City"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={boarded}
            onClick={handleConfirmBoarding}
            className="w-full py-4 rounded-full bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-black text-[15px] shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            <span>{boarded ? "Boarding Verified ✓" : "Confirm Boarding & Validate Ticket"}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleMarkNoShow}
              className="flex-1 py-3 px-3 rounded-2xl bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-rose-600">person_off</span>
              <span>Mark as No-Show</span>
            </button>

            <button
              type="button"
              onClick={() => showToast("Scanner refreshed. Point at next passenger pass.")}
              className="w-12 h-11 rounded-2xl bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 flex items-center justify-center transition cursor-pointer"
              aria-label="Refresh Scan"
              title="Scan Next Ticket"
            >
              <span className="material-symbols-outlined text-[18px]">autorenew</span>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-[10px] text-slate-400 text-center font-medium pt-1 flex items-center justify-center gap-1">
          <span className="material-symbols-outlined text-[13px] text-slate-400">shield</span>
          <span>Fare inspected by Conductor ID #8492</span>
        </p>
      </div>
    </div>
  );
}
