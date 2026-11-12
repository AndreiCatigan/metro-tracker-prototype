"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";
import { useAppContext } from "@/lib/AppContext";
import {
  TRAVEL_TIMES_FROM_SOGOD,
  TRAVEL_TIMES_FROM_ORMOC,
  getDepartedBuses,
  parseTimeToMinutes,
  calculateTripETA,
  SCHEDULE_INTERVALS,
} from "@/lib/data";

export default function HomePage() {
  const router = useRouter();
  const {
    passengerName,
    userLocation,
    simulatedTime,
    selectedDirection,
    origin,
    setOrigin,
    destination,
    setDestination,
    swapOriginDestination,
    isPremium,
  } = useAppContext();

  // Extract first name for personalized greeting
  const firstName = passengerName ? passengerName.split(" ")[0] : "Juana";

  const [showNotifications, setShowNotifications] = useState(false);

  // Bus the passenger picked in "Book A Ticket" (index into today's remaining trips)
  const [selectedTripIdx, setSelectedTripIdx] = useState<number>(0);

  const direction: "sogod-ormoc" | "ormoc-sogod" =
    selectedDirection === "sogod-to-ormoc" ? "sogod-ormoc" : "ormoc-sogod";

  const allDepartedBuses = getDepartedBuses(simulatedTime, direction);
  // Home only shows a summary of buses that are currently en route
  const enRouteBuses = allDepartedBuses.filter((b) => b.status === "en_route");
  const userTravelMins =
    direction === "sogod-ormoc"
      ? (TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 115)
      : (TRAVEL_TIMES_FROM_ORMOC[userLocation] ?? 45);

  // Upcoming same-day departures the passenger can choose from
  const currentMinutes = parseTimeToMinutes(simulatedTime);
  const availableTrips = SCHEDULE_INTERVALS.filter(
    (t) => parseTimeToMinutes(t.dep) >= currentMinutes
  ).map((t, idx) => ({
    dep: t.dep,
    bus: `DMS-0${t.num}`,
    aircon: t.aircon,
    seats: idx === 0 ? 7 : idx === 1 ? 21 : idx === 2 ? 34 : 45,
    tripId: `${direction}-trip-${idx + 1}`,
    status:
      parseTimeToMinutes(t.dep) === currentMinutes
        ? "Boarding Now"
        : parseTimeToMinutes(t.dep) - currentMinutes <= 30
          ? "In Queue"
          : "Scheduled",
  }));
  const visibleTrips = availableTrips.slice(0, 5);
  const selectedTrip = visibleTrips[selectedTripIdx] ?? visibleTrips[0];

  const handleSwap = () => {
    swapOriginDestination();
    setSelectedTripIdx(0);
  };

  const handleBookSelectedBus = () => {
    if (!selectedTrip) return;
    router.push(`/booking?direction=${direction}&trip=${selectedTrip.tripId}`);
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
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-emerald-800">Bus Arrival Confirmed</span>
                  <span className="text-[10px] text-slate-400">At {simulatedTime}</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {allDepartedBuses[1]?.busNumber} completed its trip and arrived at Ormoc City Port Terminal.
                </p>
              </div>

              <div className="p-3 bg-[#FFE8D6]/60 rounded-2xl border border-[#F5DECD] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#A53700]">Departed Bus Alert</span>
                  <span className="text-[10px] text-slate-400">15m ago</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {allDepartedBuses[0]?.busNumber} departed on schedule. Approaching Bato junction.
                </p>
              </div>

              <div className="p-3 bg-[#F7F9FB] rounded-2xl border border-[#ECEEF0] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#191C1E]">Route Advisory</span>
                  <span className="text-[10px] text-slate-400">Active</span>
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

      {/* ── Warm Peach Hero Section ── */}
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
      <main className="max-w-[440px] w-full mx-auto px-4 -mt-8 relative z-20 space-y-5">
        {/* ── Elevated Route Input Card ── */}
        <section className="bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ECEEF0] space-y-4">
          <div className="flex items-center gap-3">
            {/* Left Route Connector Graphics */}
            <div className="flex flex-col items-center justify-between h-24 py-1 flex-shrink-0">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-white" />
              <div className="w-[1.5px] h-12 bg-slate-200" />
              <span className="w-3.5 h-3.5 rounded-full bg-[#F95700] ring-2 ring-[#FFE8D6]" />
            </div>

            {/* Inputs: Origin & Destination */}
            <div className="flex-1 space-y-3">
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

          {/* Action Button: Live Buses with Swapped Direction Quick-Access */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                router.push(`/map?direction=${selectedDirection}`);
              }}
              className="w-full py-3.5 px-4 rounded-full bg-[#181C24] hover:bg-black active:scale-[0.98] text-white font-black text-[14px] tracking-tight shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#F95700]">near_me</span>
              <span>Live Buses</span>
            </button>
          </div>
        </section>

        {/* ── Departed Buses: En Route Summary ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-[18px] font-black tracking-tight text-[#191C1E]">
                Departed Buses
              </h2>
            </div>

            <span className="text-[10px] font-black text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {enRouteBuses.length} En Route
            </span>
          </div>

          {enRouteBuses.length === 0 ? (
            <div className="bg-white rounded-3xl p-4 border border-[#ECEEF0] text-center text-[12px] text-slate-500 font-medium">
              No buses are currently en route.
            </div>
          ) : (
            <div className="space-y-2.5">
              {enRouteBuses.map((bus) => {
                const eta = calculateTripETA(bus.departureTime, userTravelMins);
                return (
                  <button
                    key={bus.id}
                    type="button"
                    onClick={() => {
                      router.push(`/map?direction=${selectedDirection}`);
                    }}
                    className="w-full bg-white rounded-2xl p-3.5 shadow-2xs border border-emerald-100 text-left space-y-2.5 transition active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-[#101A2C] text-white flex flex-col items-center justify-center">
                          <span className="text-[8px] font-bold text-slate-400">BUS</span>
                          <span className="text-[13px] font-black leading-none">
                            {bus.busNumber.replace("DMS-", "")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[14px] font-black text-[#191C1E]">{bus.busNumber}</span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                                bus.isAircon
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              {bus.isAircon ? "Aircon" : "Non-Air"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">
                            Departed {bus.departureTime} • {bus.currentStop}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          ETA {userLocation}
                        </p>
                        <p className="text-[14px] font-black text-[#A53700] leading-tight">{eta}</p>
                      </div>
                    </div>

                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#F95700]"
                        style={{ width: `${bus.progressPercent}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Localized Sponsored Ad: Regional Commuter Spotlight (Hidden for Premium Users) ── */}
        {!isPremium && (
          <section className="bg-gradient-to-br from-[#FFF5EE] via-white to-[#FFF0E6] rounded-3xl p-4.5 border border-[#F5DECD] shadow-xs relative overflow-hidden space-y-3">
            <div className="absolute -right-5 -bottom-5 text-amber-900/5 pointer-events-none select-none">
              <span className="material-symbols-outlined text-[110px]">local_cafe</span>
            </div>

            <div className="relative z-10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 bg-[#FFE8D6] text-[#A53700] px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
                  <span>COMMUTER SPOTLIGHT • SPONSORED</span>
                </span>
                <span className="text-[11px] font-black text-amber-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-amber-600">star</span>
                  <span>4.9 (340+ reviews)</span>
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-900 to-amber-950 text-white flex flex-col items-center justify-center flex-shrink-0 shadow-sm border border-amber-800">
                  <span className="material-symbols-outlined text-[22px] text-amber-200">local_cafe</span>
                  <span className="text-[7px] font-black text-amber-200 tracking-wider">CAFE</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-black text-[#191C1E] tracking-tight">
                    Kape Isla Cafe &amp; Roastery
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-[#F95700]">location_on</span>
                    <span>Baybay Terminal Crossing • 2 mins walk</span>
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug">
                    Caffeine stop on your journey? Flash your <strong>track MEtro boarding pass</strong> for a <strong>10% commuter discount</strong> on all iced coffees and fresh ensaymada.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1.5 border-t border-[#F5DECD]/70">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Open Daily 6:00 AM – 9:00 PM</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    router.push(`/map?direction=${selectedDirection}`);
                  }}
                  className="py-1 px-3 rounded-full bg-[#181C24] hover:bg-black text-white font-black text-[11px] shadow-2xs transition active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>View on Map</span>
                  <span className="material-symbols-outlined text-[13px] text-[#F95700]">near_me</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Book A Ticket (same-day, choose your bus) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[18px] font-black tracking-tight text-[#191C1E] flex items-center gap-1.5">
              <span>Book A Ticket</span>
              <span className="text-amber-500 text-[16px]">👑</span>
            </h2>
            <span className="text-[10px] font-black text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Full Trip Fare
            </span>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#ECEEF0] space-y-3">
            <div className="flex items-center justify-between text-[11px]">
              <p className="font-extrabold text-slate-400 uppercase tracking-wider">
                Full Corridor Seat ({direction === "sogod-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"})
              </p>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                20% Student Disc.
              </span>
            </div>

            {visibleTrips.length === 0 ? (
              <p className="text-[12px] text-slate-500 font-medium text-center py-3">
                No more departures today.
              </p>
            ) : (
              <div className="space-y-1.5">
                {visibleTrips.map((trip, idx) => {
                  const isSelected = idx === selectedTripIdx;
                  return (
                    <button
                      key={trip.bus}
                      type="button"
                      onClick={() => setSelectedTripIdx(idx)}
                      className={`w-full p-2.5 rounded-2xl flex items-center justify-between text-left transition cursor-pointer ${
                        isSelected
                          ? "bg-[#FFE8D6]/60 border-2 border-[#F95700] ring-1 ring-[#F95700]/20"
                          : "bg-[#F7F9FB] border border-[#ECEEF0] hover:border-[#F95700]/30"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? "border-[#F95700]" : "border-slate-300"
                          }`}
                        >
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />}
                        </span>
                        <div>
                          <p className="text-[13px] font-black text-[#191C1E]">
                            {trip.dep} • {trip.bus}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {trip.aircon ? "Aircon Express" : "Non-Aircon"} • {trip.seats} seats left
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[13px] font-black text-[#A53700]">₱275.00</span>
                        <p className="text-[9px] text-emerald-700 font-extrabold uppercase">₱220 Student</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              disabled={!selectedTrip}
              onClick={handleBookSelectedBus}
              className="w-full py-3.5 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[13px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>
                {selectedTrip
                  ? `Book ${selectedTrip.dep} • ₱275 Full Ride`
                  : "Select a bus"}
              </span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={() => router.push(`/booking?direction=${direction}`)}
              className="w-full text-center text-[11px] font-bold text-[#A53700] hover:underline cursor-pointer"
            >
              See all departures &amp; discounts
            </button>
          </div>
        </section>
      </main>

      {/* ── Bottom Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}