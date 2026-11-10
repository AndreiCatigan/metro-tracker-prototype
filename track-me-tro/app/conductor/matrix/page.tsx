"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";

interface SeatData {
  id: string;
  type: "on_board" | "app_reserved" | "available";
  label: string; // e.g. "J.D.", "#APP02", "VACANT"
  col: "A" | "B" | "C" | "D";
  row: string;
  isWindow?: boolean;
}

export default function ConductorMatrixPage() {
  const router = useRouter();
  const { busDetails, activeTicket } = useAppContext();

  // Seat state representation matching Image 4
  const [selectedSeatId, setSelectedSeatId] = useState<string>("15");

  // Cabin layout matching Image 4 with live sync to activeTicket
  const seatsState = useMemo<SeatData[]>(() => {
    const base: SeatData[] = [
      // Row 1
      { id: "01", type: "on_board", label: "J.D.", col: "A", row: "R1", isWindow: true },
      { id: "02", type: "on_board", label: "M.A.", col: "B", row: "R1" },
      { id: "03", type: "app_reserved", label: "#APP02", col: "C", row: "R1" },
      { id: "04", type: "app_reserved", label: "#APP03", col: "D", row: "R1", isWindow: true },

      // Row 2
      { id: "05", type: "on_board", label: "R.P.", col: "A", row: "R2", isWindow: true },
      { id: "06", type: "on_board", label: "L.V.", col: "B", row: "R2" },
      { id: "07", type: "available", label: "VACANT", col: "C", row: "R2" },
      { id: "08", type: "app_reserved", label: "#APP14", col: "D", row: "R2", isWindow: true },

      // Row 3
      { id: "09", type: "available", label: "VACANT", col: "A", row: "R3", isWindow: true },
      { id: "10", type: "available", label: "VACANT", col: "B", row: "R3" },
      { id: "11", type: "on_board", label: "C.O.", col: "C", row: "R3" },
      { id: "12", type: "on_board", label: "S.T.", col: "D", row: "R3", isWindow: true },

      // Row 4
      { id: "13", type: "app_reserved", label: "#APP90", col: "A", row: "R4", isWindow: true },
      { id: "14", type: "app_reserved", label: "#APP91", col: "B", row: "R4" },
      { id: "15", type: "available", label: "WIN", col: "C", row: "R4" },
      { id: "16", type: "available", label: "VACANT", col: "D", row: "R4", isWindow: true },

      // Row 5
      { id: "17", type: "on_board", label: "G.L.", col: "A", row: "R5", isWindow: true },
      { id: "18", type: "on_board", label: "A.N.", col: "B", row: "R5" },
      { id: "19", type: "app_reserved", label: "#APP45", col: "C", row: "R5" },
      { id: "20", type: "available", label: "VACANT", col: "D", row: "R5", isWindow: true },

      // Row 6
      { id: "21", type: "available", label: "VACANT", col: "A", row: "R6", isWindow: true },
      { id: "22", type: "available", label: "VACANT", col: "B", row: "R6" },
      { id: "23", type: "on_board", label: "W.E.", col: "C", row: "R6" },
      { id: "24", type: "on_board", label: "K.L.", col: "D", row: "R6", isWindow: true },

      // Row 7
      { id: "25", type: "app_reserved", label: "#APP02", col: "A", row: "R7", isWindow: true },
      { id: "26", type: "app_reserved", label: "#APP03", col: "B", row: "R7" },
      { id: "27", type: "available", label: "VACANT", col: "C", row: "R7" },
      { id: "28", type: "available", label: "VACANT", col: "D", row: "R7", isWindow: true },
    ];

    if (activeTicket?.seatNumber) {
      const padded = activeTicket.seatNumber.padStart(2, "0");
      return base.map((s) =>
        s.id === padded ? { ...s, type: "app_reserved" as const, label: "#APP" } : s
      );
    }
    return base;
  }, [activeTicket]);

  // Rear 5 bench seats
  const rearBench: SeatData[] = [
    { id: "41", type: "on_board", label: "P.M.", col: "A", row: "REAR" },
    { id: "42", type: "on_board", label: "T.Y.", col: "B", row: "REAR" },
    { id: "43", type: "app_reserved", label: "#APP", col: "C", row: "REAR" },
    { id: "44", type: "app_reserved", label: "#APP", col: "D", row: "REAR" },
    { id: "45", type: "available", label: "VAC", col: "D", row: "REAR" },
  ];

  const rows = ["R1", "R2", "R3", "R4", "R5", "R6", "R7"];

  const selectedSeat =
    seatsState.find((s) => s.id === selectedSeatId) ||
    rearBench.find((s) => s.id === selectedSeatId);

  const handleSeatClick = (seat: SeatData) => {
    setSelectedSeatId(seat.id);
  };

  const handleSellWalkIn = () => {
    router.push(`/conductor/pos?seat=${selectedSeatId}`);
  };

  return (
    <div className="min-h-screen bg-[#F0F3F7] text-[#191C1E] flex flex-col font-sans pb-36">
      {/* ── Top Dark Navy Telemetry Header ── */}
      <header className="bg-[#101A2C] text-white p-4 pb-5 rounded-b-3xl shadow-lg space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F95700]" />
              BUS {busDetails.id}
            </span>
            <span className="text-[11px] text-slate-300 font-semibold">
              Express • Aircon
            </span>
          </div>

          <div className="flex items-center gap-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>GPS Live</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              ASSIGNED ROUTE
            </p>
            <h1 className="text-[18px] font-black tracking-tight text-white mt-0.5">
              Sogod <span className="text-slate-400">➔</span> Ormoc
            </h1>
          </div>

          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              NEXT STATION
            </p>
            <div className="inline-flex items-center gap-1 bg-[#FFCC00]/20 text-[#FFD633] px-2.5 py-0.5 rounded-full text-[11px] font-extrabold mt-0.5 border border-[#FFCC00]/30">
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              <span>Baybay Terminal</span>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-baseline gap-1">
              <span className="text-[16px] font-black text-white">32</span>
              <span className="text-slate-400 font-semibold text-[11px]">/ 45 Seats Filled</span>
              <span className="text-[#FF8C00] font-black text-[11px] ml-1">(71%)</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              13 Available
            </span>
          </div>

          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
            {/* On-board segment (navy/blue) */}
            <div className="h-full bg-[#1D6AE5]" style={{ width: "31%" }} />
            {/* App segment (orange) */}
            <div className="h-full bg-[#F95700]" style={{ width: "40%" }} />
            {/* Vacant segment */}
            <div className="h-full bg-slate-700" style={{ width: "29%" }} />
          </div>
        </div>
      </header>

      <main className="max-w-[420px] w-full mx-auto px-4 -mt-2 space-y-3.5">
        {/* ── Big Scan Passenger CTA Banner ── */}
        <button
          type="button"
          onClick={() => router.push("/conductor/scan")}
          className="w-full bg-gradient-to-r from-[#F95700] to-[#E04E00] text-white rounded-2xl p-4 shadow-md flex items-center justify-between transition-transform active:scale-[0.98] cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-black tracking-tight">
                  Scan Passenger E-Ticket
                </span>
                <span className="text-[14px]">🌟</span>
              </div>
              <p className="text-[11px] text-white/80 font-medium">
                Tap to validate QR or transit card
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] bg-black/20 rounded-full p-1.5">
            arrow_forward
          </span>
        </button>

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-around py-1.5 px-3 bg-white rounded-2xl shadow-2xs border border-[#ECEEF0] text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 bg-emerald-50" />
            <span className="text-slate-600">Available</span>
            <span className="text-slate-400 font-medium">13</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#F95700]" />
            <span className="text-slate-600">App</span>
            <span className="text-[#F95700] font-black">18</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#1F2937]" />
            <span className="text-slate-600">On-Board</span>
            <span className="text-slate-900 font-black">14</span>
          </div>
        </div>

        {/* ── Bus Cabin Matrix Card ── */}
        <section className="bg-white rounded-3xl p-4 shadow-sm border border-[#ECEEF0] space-y-3.5">
          {/* Cabin Header */}
          <div className="bg-[#101A2C] text-white rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[15px]">airline_seat_recline_extra</span>
              </div>
              <div>
                <p className="text-[11px] font-black">CONDUCTOR UNIT</p>
                <p className="text-[9px] text-slate-300">Kuya Rolly B. • FRONT CABIN DMS-048</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-400 font-black text-[10px] uppercase tracking-wider bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-lg">
              <span>PASSENGER DOOR</span>
              <span className="material-symbols-outlined text-[14px]">door_front</span>
            </div>
          </div>

          {/* Rows R1 through R7 */}
          <div className="space-y-2.5">
            {rows.map((rowId) => {
              const rowSeats = seatsState.filter((s) => s.row === rowId);
              const seatA = rowSeats.find((s) => s.col === "A");
              const seatB = rowSeats.find((s) => s.col === "B");
              const seatC = rowSeats.find((s) => s.col === "C");
              const seatD = rowSeats.find((s) => s.col === "D");

              const renderSeat = (seat?: SeatData) => {
                if (!seat) return <div className="w-12 h-10" />;

                const isSelected = selectedSeatId === seat.id;

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#1D6AE5] text-white flex flex-col items-center justify-center shadow-md ring-2 ring-emerald-400 transition transform scale-105 cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[12px] font-black">{seat.id}</span>
                        <span className="text-[9px] bg-white/20 px-1 rounded">WIN</span>
                      </div>
                      <span className="text-[9px] font-black text-emerald-300">
                        SELECTED ✓
                      </span>
                    </button>
                  );
                }

                if (seat.type === "on_board") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#283548] text-white flex flex-col items-center justify-center hover:bg-[#33445C] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] font-bold">{seat.id}</span>
                        <span className="material-symbols-outlined text-[11px] text-slate-400">person</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-300">
                        {seat.label}
                      </span>
                    </button>
                  );
                }

                if (seat.type === "app_reserved") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="w-full py-2 px-1 rounded-xl bg-[#F95700] text-white flex flex-col items-center justify-center shadow-2xs hover:bg-[#E04E00] transition cursor-pointer"
                    >
                      <div className="flex items-center gap-0.5">
                        <span className="text-[11px] font-black">{seat.id}</span>
                        <span className="material-symbols-outlined text-[10px]">confirmation_number</span>
                      </div>
                      <span className="text-[8.5px] font-black uppercase tracking-tight opacity-95">
                        {seat.label}
                      </span>
                    </button>
                  );
                }

                // Available / Vacant
                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className="w-full py-2 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center hover:border-[#1D6AE5] hover:bg-blue-50/50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] font-bold">{seat.id}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-[8.5px] font-semibold text-slate-400 uppercase tracking-tight">
                      VACANT
                    </span>
                  </button>
                );
              };

              return (
                <div key={rowId} className="grid grid-cols-5 items-center gap-2">
                  <div className="col-span-1">{renderSeat(seatA)}</div>
                  <div className="col-span-1">{renderSeat(seatB)}</div>

                  {/* Aisle Row Tag */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="w-7 h-5 rounded bg-[#F2F4F6] text-slate-400 font-bold text-[10px] flex items-center justify-center select-none">
                      {rowId}
                    </span>
                  </div>

                  <div className="col-span-1">{renderSeat(seatC)}</div>
                  <div className="col-span-1">{renderSeat(seatD)}</div>
                </div>
              );
            })}
          </div>

          {/* Rear 5-Seat Bench */}
          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="w-12 h-[1px] bg-slate-200" />
              <span>REAR 5-SEAT BENCH</span>
              <span className="w-12 h-[1px] bg-slate-200" />
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {rearBench.map((seat) => {
                const isSelected = selectedSeatId === seat.id;

                if (isSelected) {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#1D6AE5] text-white flex flex-col items-center justify-center ring-2 ring-emerald-400 text-center"
                    >
                      <span className="text-[10px] font-black">{seat.id}</span>
                      <span className="text-[8px] font-black">SEL</span>
                    </button>
                  );
                }

                if (seat.type === "on_board") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#283548] text-white flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-[10px] font-bold">{seat.id}</span>
                      <span className="text-[8px] font-semibold text-slate-300">{seat.label}</span>
                    </button>
                  );
                }

                if (seat.type === "app_reserved") {
                  return (
                    <button
                      key={seat.id}
                      type="button"
                      onClick={() => handleSeatClick(seat)}
                      className="py-2 px-1 rounded-xl bg-[#F95700] text-white flex flex-col items-center justify-center text-center"
                    >
                      <span className="text-[10px] font-black">{seat.id}</span>
                      <span className="text-[8px] font-black uppercase">{seat.label}</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={seat.id}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    className="py-2 px-1 rounded-xl bg-white border border-slate-200 text-slate-700 flex flex-col items-center justify-center text-center"
                  >
                    <span className="text-[10px] font-bold">{seat.id}</span>
                    <span className="text-[8px] font-semibold text-slate-400">{seat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matrix Card Footer */}
          <div className="pt-2 border-t border-[#ECEEF0] flex items-center justify-between text-[10px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              <span>LTFRB Tariff Compliant</span>
            </span>
            <span className="flex items-center gap-1 text-[#F95700]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F95700] animate-pulse" />
              <span>Live matrix sync</span>
            </span>
          </div>
        </section>
      </main>

      {/* ── Fixed Bottom Floating Action Card (for Selected Seat) ── */}
      {selectedSeat && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.08)] px-4 py-3">
          <div className="max-w-[420px] mx-auto space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1D6AE5] text-white font-black text-[14px] flex items-center justify-center shadow-xs">
                  {selectedSeat.id}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-black text-[#191C1E]">
                      Seat {selectedSeat.id}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full text-[10px] font-black uppercase">
                      {selectedSeat.type === "available" ? "AVAILABLE" : selectedSeat.type === "app_reserved" ? "APP RESERVED" : "ON BOARD"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Right Window • Standard Fare{" "}
                    <span className="font-extrabold text-[#191C1E]">₱95.00</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSeatId("")}
                className="w-7 h-7 rounded-full bg-[#F2F4F6] text-slate-400 hover:text-slate-700 flex items-center justify-center text-xs"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="bg-[#F2F4F6] rounded-xl px-3 py-2 text-[10px] font-bold text-slate-600">
                <p className="text-[9px] text-slate-400 uppercase">FARE CLASS</p>
                <p className="text-[#191C1E] font-black text-[11px]">
                  Regular (₱95) <span className="text-emerald-600 font-medium">↗ 20% Disc</span>
                </p>
              </div>

              <button
                type="button"
                onClick={handleSellWalkIn}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[13px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">receipt_long</span>
                <span>Sell Walk-In Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
