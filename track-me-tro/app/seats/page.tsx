"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { PASSENGER_SEAT_ROWS, DEFAULT_OCCUPIED_SEAT_IDS } from "@/lib/data";

export default function SelectSeatPage() {
  const router = useRouter();
  const {
    busDetails,
    selectedSeatNumber,
    setSelectedSeatNumber,
    passengerName,
  } = useAppContext();

  // Preset mock occupancy matching Image 4
  const occupiedSeatIds = new Set(DEFAULT_OCCUPIED_SEAT_IDS);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSeatClick = (seatNum: string) => {
    if (occupiedSeatIds.has(seatNum)) {
      showToast(`Seat ${seatNum} is already occupied.`);
      return;
    }
    setSelectedSeatNumber(seatNum);
  };

  const isWindowSeat = (seatNum: string) => {
    const num = parseInt(seatNum, 10);
    return num % 4 === 1 || num % 4 === 0;
  };

  // 6 rows of 4 seats (24 seats total matching Image 4)
  const seatRows = PASSENGER_SEAT_ROWS;

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-36">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#191C1E]">
            Select Your Seat
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
            Bus {busDetails.id} • Aircon Express
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast("Seat selection is live-synced with conductor dispatch.")}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Seat Info"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>
      </header>

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[420px] w-full mx-auto px-4 pt-4 space-y-3.5">
        {/* ── Route Indicator Card ── */}
        <div className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#ECEEF0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-[#A53700] flex-shrink-0" />
            <span className="text-[14px] font-extrabold text-[#191C1E] tracking-tight">
              Sogod <span className="text-slate-400 font-normal">➔</span> Ormoc City
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#F5DECD]/60 text-[#812900] px-2.5 py-1 rounded-full text-[11px] font-bold">
            <span className="material-symbols-outlined text-[14px]">ac_unit</span>
            <span>Aircon</span>
          </div>
        </div>

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-center gap-6 py-1 text-[12px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-white border border-[#E4BEB2]/80 shadow-2xs inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-[#ECEEF0] border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
              ✕
            </span>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-[#A53700] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
              ✓
            </span>
            <span className="text-[#A53700] font-bold">Selected</span>
          </div>
        </div>

        {/* ── Bus Cabin Schematic ── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ECEEF0] relative">
          {/* Top handle pill */}
          <div className="w-12 h-1 bg-[#ECEEF0] rounded-full mx-auto mb-4" />

          {/* Entrance & Driver indicators */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-[#ECEEF0] text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5 bg-[#F2F4F6] px-3 py-1 rounded-full border border-slate-200/60">
              <span className="material-symbols-outlined text-[15px] text-slate-500">door_front</span>
              <span className="tracking-wider">ENTRANCE</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F2F4F6] px-3 py-1 rounded-full border border-slate-200/60">
              <span className="material-symbols-outlined text-[15px] text-slate-500">person</span>
              <span className="tracking-wider">DRIVER</span>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-5 text-center text-[11px] font-bold text-slate-400 mb-3 select-none">
            <div>A (Win)</div>
            <div>B</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">AISLE</div>
            <div>C</div>
            <div>D (Win)</div>
          </div>

          {/* Seat Grid Rows */}
          <div className="space-y-3">
            {seatRows.map((row) => {
              const seatA = row.seats[0];
              const seatB = row.seats[1];
              const seatC = row.seats[2];
              const seatD = row.seats[3];

              const renderSeat = (seatId: string) => {
                const isOccupied = occupiedSeatIds.has(seatId);
                const isSelected = selectedSeatNumber === seatId;

                if (isSelected) {
                  return (
                    <button
                      key={seatId}
                      type="button"
                      onClick={() => handleSeatClick(seatId)}
                      className="w-12 h-12 rounded-full bg-[#A53700] text-white flex items-center justify-center font-black text-[13px] shadow-md ring-4 ring-[#FFE8D6] transition-all transform scale-105 cursor-pointer mx-auto"
                      aria-label={`Seat ${seatId} Selected`}
                    >
                      <span className="flex items-center gap-0.5">
                        {seatId} <span className="text-[11px]">✓</span>
                      </span>
                    </button>
                  );
                }

                if (isOccupied) {
                  return (
                    <button
                      key={seatId}
                      type="button"
                      onClick={() => handleSeatClick(seatId)}
                      className="w-12 h-12 rounded-full bg-[#ECEEF0] text-slate-400 flex items-center justify-center font-bold text-[12px] cursor-not-allowed opacity-80 mx-auto"
                      aria-label={`Seat ${seatId} Occupied`}
                    >
                      {seatId}
                    </button>
                  );
                }

                return (
                  <button
                    key={seatId}
                    type="button"
                    onClick={() => handleSeatClick(seatId)}
                    className="w-12 h-12 rounded-full bg-white border border-[#E4BEB2]/90 text-[#191C1E] flex items-center justify-center font-bold text-[13px] shadow-2xs hover:border-[#F95700] hover:bg-[#FFE8D6]/30 transition active:scale-95 cursor-pointer mx-auto"
                    aria-label={`Select Seat ${seatId}`}
                  >
                    {seatId}
                  </button>
                );
              };

              return (
                <div key={row.rowNum} className="grid grid-cols-5 items-center">
                  <div>{renderSeat(seatA)}</div>
                  <div>{renderSeat(seatB)}</div>
                  <div className="text-center text-slate-300 font-bold text-sm select-none">
                    {row.arrow}
                  </div>
                  <div>{renderSeat(seatC)}</div>
                  <div>{renderSeat(seatD)}</div>
                </div>
              );
            })}
          </div>

          {/* Cabin Restroom Notice */}
          <div className="mt-5 pt-4 border-t border-[#ECEEF0] flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[16px] text-slate-400">wc</span>
            <span>Rear Cabin Restroom Available</span>
          </div>
        </div>
      </main>

      {/* ── Fixed Bottom Floating Action Card ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="max-w-[420px] mx-auto space-y-3">
          {/* Passenger & Fare Info Row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black text-[#191C1E]">
                  Seat {selectedSeatNumber}
                </span>
                <span className="bg-[#FFE8D6] text-[#A53700] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isWindowSeat(selectedSeatNumber) ? "Window" : "Aisle"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {passengerName} • Regular
              </p>
            </div>

            <div className="text-right">
              <div className="text-[20px] font-black text-[#A53700] tracking-tight leading-none">
                ₱80.00
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                Total Base Fare
              </p>
            </div>
          </div>

          {/* Amenities Row */}
          <div className="flex items-center justify-around py-1.5 px-3 bg-[#F7F9FB] rounded-xl border border-[#ECEEF0] text-[11px] font-semibold text-slate-600">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">wifi</span>
              <span>Free Wi-Fi</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">power</span>
              <span>USB Power</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">luggage</span>
              <span>15kg Bag</span>
            </div>
          </div>

          {/* Continue CTA */}
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="w-full py-3.5 rounded-full bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
