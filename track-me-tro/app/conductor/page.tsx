"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext, PassengerHail, BusDispatchStatus } from "@/lib/AppContext";
import Logo from "@/components/Logo";
import SwipeableHailCard from "@/components/SwipeableHailCard";
import CrownIcon from "@/components/CrownIcon";

export default function ConductorHomePage() {
  const router = useRouter();
  const {
    busDetails,
    conductorName,
    busStatus,
    setBusStatus,
    registerConductorShift,
    passengersOnBoard,
    incrementPassengersOnBoard,
    decrementPassengersOnBoard,
    bookings,
    requestSeatReservation,
    passengerHails,
    hailBus,
    acknowledgeHail,
    pickupHail,
    removeHail,
    currentBusStop,
    advanceToNextStop,
    selectedDirection,
    setSelectedDirection,
  } = useAppContext();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState<boolean>(false);
  const [dropdownTab, setDropdownTab] = useState<"all" | "reservations" | "pings">("all");
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  // Form states for conductor registration
  const [formName, setFormName] = useState<string>(conductorName);
  const [formBusNumber, setFormBusNumber] = useState<string>(busDetails.id);
  const [formDirection, setFormDirection] = useState<"sogod-to-ormoc" | "ormoc-to-sogod">(selectedDirection);
  const [formIsAircon, setFormIsAircon] = useState<boolean>(busDetails.isAircon ?? true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenRegister = () => {
    setFormName(conductorName);
    setFormBusNumber(busDetails.id);
    setFormDirection(selectedDirection);
    setFormIsAircon(busDetails.isAircon ?? true);
    setShowRegisterModal(true);
  };

  const handleSaveRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast("Please enter conductor name.");
      return;
    }
    if (!formBusNumber.trim()) {
      showToast("Please enter bus number.");
      return;
    }
    registerConductorShift({
      name: formName.trim(),
      busNumber: formBusNumber.trim(),
      direction: formDirection,
      isAircon: formIsAircon,
    });
    showToast(`✓ Shift Registered: ${formName.trim()} • Bus ${formBusNumber.trim().toUpperCase()} (${formIsAircon ? "Aircondition" : "Non-Aircon"}) • Status: In Queue`);
    setShowRegisterModal(false);
  };

  const handleUpdateStatus = (newStatus: BusDispatchStatus) => {
    setBusStatus(newStatus);
    const statusLabels: Record<BusDispatchStatus, string> = {
      in_queue: "In Queue",
      boarding: "Boarding",
      depart: "Depart",
    };
    showToast(`✓ Bus Status Updated: ${statusLabels[newStatus]}`);
  };

  const handlePickupHail = (hail: PassengerHail) => {
    pickupHail(hail.id);
    showToast(`✓ Picked up ${hail.passengerName} in ${hail.location}! (Ping cleared)`);
  };

  const handleRemoveHail = (hail: PassengerHail) => {
    removeHail(hail.id);
    showToast(`Removed ping: No passenger at ${hail.location}.`);
  };

  // Find all passengers who paid online and are waiting for conductor to assign their seat
  const pendingSeatBookings = bookings.filter((b) => b.status === "pending_seat");
  const confirmedSeatBookings = bookings.filter((b) => b.status === "confirmed");

  // Active location pings from passengers waiting along the highway
  const activeHails = passengerHails.filter((h) => h.status !== "boarded");

  // Total notification count across reservations and location pings
  const totalNotificationsCount = pendingSeatBookings.length + activeHails.length;

  const totalSeats = 45;
  const availableSeats = Math.max(0, totalSeats - passengersOnBoard);
  const occupancyPercent = Math.min(100, Math.round((passengersOnBoard / totalSeats) * 100));

  const handleSimulateNewReservation = () => {
    const sampleNames = ["Carlos Mendoza", "Maricar Santos", "David Tan", "Elena Bautista"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const newBooking = requestSeatReservation(randomName, selectedDirection === "ormoc-to-sogod" ? "ormoc-sogod" : "sogod-ormoc");
    showToast(`🔔 New online booking received from ${newBooking.passengerName}! Awaiting seat selection.`);
  };

  const handleSimulateNewHail = () => {
    const sampleStops = ["VSU Main Campus", "Baybay City Terminal", "Inopacan Crossing", "Hilongos Market"];
    const randomStop = sampleStops[Math.floor(Math.random() * sampleStops.length)];
    const sampleNames = ["Patricia Gomez", "Joshua Reyes", "Althea Cruz", "Rafael Morales"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    hailBus(busDetails.id, randomStop, "Approaching in 14 min");
    showToast(`📍 ${randomName} pinged location at ${randomStop}!`);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-[#191C1E] flex flex-col font-sans pb-16">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">notifications_active</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Conductor Header (Light Orange matching Passenger Dashboard) ── */}
      <header className="sticky top-0 z-30 bg-[#FFDFC9] text-[#191C1E] px-3.5 sm:px-4 py-3 shadow-xs border-b border-[#F5DECD]">
        <div className="max-w-[440px] w-full mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Logo className="h-7 w-auto shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] sm:text-[12px] font-black tracking-tight text-[#191C1E] flex items-center gap-1.5 truncate">
                <span className="truncate">CONDUCTOR DASHBOARD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping shrink-0" />
              </span>
              <span className="text-[10px] text-slate-700 font-semibold truncate">
                Bus {busDetails.id} • {conductorName} • {busDetails.isAircon ?? true ? "Aircon" : "Non-Air"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 relative">
            {/* Notification Bell Button with dropdown for Reservation Requests & Location Pings */}
            <button
              type="button"
              onClick={() => {
                setShowNotificationDropdown(!showNotificationDropdown);
              }}
              className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full transition flex items-center justify-center text-slate-800 cursor-pointer shadow-2xs ${
                showNotificationDropdown ? "bg-white/90 ring-2 ring-[#F95700]" : "bg-white/50 backdrop-blur-xs hover:bg-white/70 active:scale-95"
              }`}
              title="Notifications: Reservation Requests & Location Pings"
              aria-label="Toggle Notifications Dropdown"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px]">notifications</span>
              {totalNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] sm:min-w-[20px] h-4.5 sm:h-5 bg-[#F95700] text-white text-[9px] sm:text-[10px] font-black rounded-full px-1 flex items-center justify-center shadow-md animate-bounce ring-2 ring-[#FFDFC9]">
                  {totalNotificationsCount}
                </span>
              )}
            </button>

            {/* Conductor & Bus Registration Button (Person Icon) */}
            <button
              type="button"
              onClick={handleOpenRegister}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full transition flex items-center justify-center text-slate-800 cursor-pointer shadow-2xs group ${
                showRegisterModal ? "bg-white/90 ring-2 ring-[#F95700]" : "bg-white/50 backdrop-blur-xs hover:bg-white/70 active:scale-95"
              }`}
              title="Register Conductor Name, Bus Number & Direction"
              aria-label="Conductor & Bus Registration"
            >
              <span className="material-symbols-outlined text-[20px] sm:text-[22px] group-hover:scale-105 transition-transform">person</span>
            </button>

            {/* ── Notification Dropdown Menu ── */}
            {showNotificationDropdown && (
              <>
                {/* Backdrop to close dropdown on tap outside */}
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs"
                  onClick={() => setShowNotificationDropdown(false)}
                />

                {/* Dropdown Floating Panel */}
                <div className="absolute right-0 top-11 sm:top-12 w-[340px] sm:w-[370px] max-w-[calc(100vw-20px)] bg-white text-[#191C1E] rounded-3xl shadow-2xl border border-[#ECEEF0] z-50 overflow-hidden animate-fade-in text-left">
                  {/* Dropdown Header */}
                  <div className="p-3.5 pb-2.5 border-b border-[#ECEEF0] flex items-center justify-between bg-[#F8F9FA]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-[13px] font-black text-[#191C1E]">Notifications</h3>
                          {totalNotificationsCount > 0 && (
                            <span className="bg-[#F95700] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                              {totalNotificationsCount}
                            </span>
                          )}
                        </div>
                        <p className="text-[9.5px] text-slate-500 font-medium truncate">Reservations &amp; Location Pings</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowNotificationDropdown(false)}
                      className="w-7 h-7 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs cursor-pointer shrink-0"
                      aria-label="Close Dropdown"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Category Filter Tabs - 3 column responsive grid */}
                  <div className="grid grid-cols-3 gap-1 px-2.5 py-2 bg-white border-b border-[#ECEEF0]">
                    <button
                      type="button"
                      onClick={() => setDropdownTab("all")}
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-black transition cursor-pointer flex items-center justify-center gap-1 truncate ${
                        dropdownTab === "all"
                          ? "bg-[#101A2C] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>All</span>
                      <span className="text-[9px] opacity-75">({totalNotificationsCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDropdownTab("reservations")}
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-black transition cursor-pointer flex items-center justify-center gap-1 truncate ${
                        dropdownTab === "reservations"
                          ? "bg-[#F95700] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">airline_seat_recline_extra</span>
                      <span className="truncate">Seats</span>
                      <span className="text-[9px] opacity-75">({pendingSeatBookings.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDropdownTab("pings")}
                      className={`py-1.5 px-1 rounded-xl text-[10.5px] font-black transition cursor-pointer flex items-center justify-center gap-1 truncate ${
                        dropdownTab === "pings"
                          ? "bg-[#101A2C] text-white shadow-2xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">cell_tower</span>
                      <span className="truncate">Pings</span>
                      <span className="text-[9px] opacity-75">({activeHails.length})</span>
                    </button>
                  </div>

                  {/* Scrollable Notification List */}
                  <div className="max-h-[380px] overflow-y-auto p-3 space-y-2.5">
                    {/* 1. Reservation Requests */}
                    {(dropdownTab === "all" || dropdownTab === "reservations") && pendingSeatBookings.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 px-1">
                          <span>Seat Reservation Requests ({pendingSeatBookings.length})</span>
                          <span className="text-[#F95700]">Paid Online</span>
                        </div>
                        {pendingSeatBookings.map((booking) => (
                          <div
                            key={booking.id}
                            className="bg-[#FFF8F2] border border-[#F95700]/30 rounded-2xl p-3 space-y-2 shadow-2xs"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-[13px] text-[#191C1E]">{booking.passengerName}</span>
                                  <span className="bg-[#FFE8D6] text-[#A53700] text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase">
                                    Needs Seat
                                  </span>
                                </div>
                                <p className="text-[10px] text-slate-600 mt-0.5">
                                  {booking.direction === "sogod-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"} • Dep {booking.departureTime}
                                </p>
                                <p className="text-[10px] text-emerald-700 font-bold mt-0.5">
                                  Paid ₱{booking.totalFare} ({booking.paymentMethod}) • PNR: {booking.pnr}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setShowNotificationDropdown(false);
                                router.push(`/conductor/matrix?assignBookingId=${booking.id}`);
                              }}
                              className="w-full py-2 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[11px] flex items-center justify-center gap-1 shadow-2xs cursor-pointer transition active:scale-95"
                            >
                              <span className="material-symbols-outlined text-[15px]">airline_seat_recline_normal</span>
                              <span>Select Seat on Bus Map ➔</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 2. Passenger Location Pings */}
                    {(dropdownTab === "all" || dropdownTab === "pings") && activeHails.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 px-1 pt-1">
                          <span>Passenger Location Pings ({activeHails.length})</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNotificationDropdown(false);
                              router.push("/conductor/map");
                            }}
                            className="text-[#F95700] hover:underline flex items-center gap-0.5 cursor-pointer lowercase first-letter:uppercase"
                          >
                            <span>view on map ➔</span>
                          </button>
                        </div>
                        {activeHails.map((hail) => (
                          <div
                            key={hail.id}
                            className="bg-[#F0F4F8] border border-slate-200 rounded-2xl p-3 space-y-2 shadow-2xs"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-[13px] text-[#191C1E]">{hail.passengerName}</span>
                                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded inline-flex items-center gap-1 ${
                                    hail.tier === "premium" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-700"
                                  }`}>
                                    {hail.tier === "premium" ? (
                                      <>
                                        <CrownIcon className="w-2.5 h-2.5 text-amber-700" />
                                        <span>MEtro+</span>
                                      </>
                                    ) : (
                                      "Free Tier"
                                    )}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-800 font-bold mt-0.5 flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[13px] text-[#F95700]">location_on</span>
                                  <span>Waiting at: <strong>{hail.location}</strong></span>
                                </p>
                                <p className="text-[10px] text-slate-500 font-medium">
                                  Pinged at {hail.timestamp} {hail.etaAtHail ? `• ${hail.etaAtHail}` : ""}
                                </p>
                              </div>
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                hail.status === "acknowledged" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800 animate-pulse"
                              }`}>
                                {hail.status === "acknowledged" ? "Crew Notified" : "Waiting"}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNotificationDropdown(false);
                                  router.push(`/conductor/map?hailId=${hail.id}`);
                                }}
                                className="py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-black transition active:scale-95 flex items-center gap-1 cursor-pointer shrink-0"
                                title="View on Map"
                              >
                                <span className="material-symbols-outlined text-[12px] text-[#F95700]">map</span>
                                <span>Map</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  pickupHail(hail.id);
                                  showToast(`✓ Picked up ${hail.passengerName} in ${hail.location}! Ping cleared.`);
                                }}
                                className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 text-emerald-800 text-[10px] font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 group"
                                title="Signify you successfully picked up passenger in this pinged area"
                              >
                                <span className="w-3.5 h-3.5 rounded-full border-1.5 border-emerald-600 flex items-center justify-center bg-white shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                </span>
                                <span>Picked Up</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  removeHail(hail.id);
                                  showToast(`Removed ping: No passenger at ${hail.location}.`);
                                }}
                                className="py-1.5 px-2 rounded-xl bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 text-[10px] font-black transition active:scale-95 cursor-pointer flex items-center gap-0.5 shrink-0"
                                title="No passenger in pinged area (Remove)"
                              >
                                <span className="material-symbols-outlined text-[12px]">person_off</span>
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 3. Empty State */}
                    {((dropdownTab === "all" && totalNotificationsCount === 0) ||
                      (dropdownTab === "reservations" && pendingSeatBookings.length === 0) ||
                      (dropdownTab === "pings" && activeHails.length === 0)) && (
                      <div className="py-6 px-4 text-center space-y-2">
                        <span className="material-symbols-outlined text-[28px] text-slate-300">notifications_paused</span>
                        <p className="text-[12px] font-bold text-slate-600">No Pending Notifications</p>
                        <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto">
                          {dropdownTab === "reservations"
                            ? "No reservation requests awaiting seat assignment."
                            : dropdownTab === "pings"
                            ? "No passengers currently pinging their highway location."
                            : "All reservation requests have been assigned and no active location pings."}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Footer with Quick Simulators */}
                  <div className="p-3 bg-[#F8F9FA] border-t border-[#ECEEF0] flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Simulator:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleSimulateNewReservation}
                        className="text-[#A53700] hover:bg-[#FFE8D6] px-2 py-1 rounded-md font-bold transition cursor-pointer"
                      >
                        + Reservation
                      </button>
                      <button
                        type="button"
                        onClick={handleSimulateNewHail}
                        className="text-slate-700 hover:bg-slate-200 px-2 py-1 rounded-md font-bold transition cursor-pointer"
                      >
                        + Location Ping
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-[440px] w-full mx-auto px-3.5 sm:px-4 pt-3.5 space-y-3.5">
        {/* ── Active Corridor & Direction Strip ── */}
        <section className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-2xs border border-[#ECEEF0] flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">
                ROUTE 04 • {selectedDirection === "sogod-to-ormoc" ? "OUTBOUND" : "INBOUND"}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                {busDetails.isAircon ?? true ? "Aircon" : "Non-Aircon"}
              </span>
            </div>
            <h2 className="text-[14px] sm:text-[15px] font-black text-[#191C1E] mt-0.5 truncate">
              {selectedDirection === "sogod-to-ormoc" ? "Sogod ➔ Ormoc City" : "Ormoc City ➔ Sogod"}
            </h2>
            <p className="text-[10.5px] sm:text-[11px] text-slate-600 font-medium flex items-center gap-1 mt-0.5 truncate">
              <span className="material-symbols-outlined text-[13px] text-[#F95700] shrink-0">near_me</span>
              <span className="truncate">Next Stop: <strong>{currentBusStop}</strong></span>
            </p>
          </div>

          <div className="shrink-0 flex items-center">
            <button
              type="button"
              onClick={() => {
                advanceToNextStop();
                showToast(`Bus location updated: Approaching ${currentBusStop}`);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[#FFE8D6] text-[#A53700] hover:bg-[#FFD9BC] active:scale-95 transition text-[10.5px] sm:text-[11px] font-black flex items-center gap-1 cursor-pointer shadow-2xs"
              title="Advance Bus Stop"
            >
              <span className="material-symbols-outlined text-[13px]">fast_forward</span>
              <span>Next Stop</span>
            </button>
          </div>
        </section>

        {/* ── BUS DISPATCH STATUS UPDATE (In Queue, Boarding, Depart) ── */}
        <section className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-2xs border border-[#ECEEF0] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[17px] text-[#F95700]">swap_driving_apps</span>
              <span className="text-[11px] font-black tracking-wider uppercase text-slate-700">
                Bus Status Update
              </span>
            </div>
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                busStatus === "in_queue"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : busStatus === "boarding"
                  ? "bg-blue-100 text-blue-800 border border-blue-300 animate-pulse"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {busStatus === "in_queue" ? "In Queue" : busStatus === "boarding" ? "Boarding" : "Depart"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* 1. In Queue */}
            <button
              type="button"
              onClick={() => handleUpdateStatus("in_queue")}
              className={`py-2.5 px-1.5 sm:px-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition active:scale-95 border ${
                busStatus === "in_queue"
                  ? "bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300/60"
                  : "bg-[#F7F9FB] hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Set bus status to In Queue"
            >
              <span className="material-symbols-outlined text-[20px]">schedule</span>
              <span className="text-[11px] font-black uppercase tracking-tight">In Queue</span>
            </button>

            {/* 2. Boarding */}
            <button
              type="button"
              onClick={() => handleUpdateStatus("boarding")}
              className={`py-2.5 px-1.5 sm:px-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition active:scale-95 border ${
                busStatus === "boarding"
                  ? "bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300/60"
                  : "bg-[#F7F9FB] hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Set bus status to Boarding"
            >
              <span className="material-symbols-outlined text-[20px]">door_front</span>
              <span className="text-[11px] font-black uppercase tracking-tight">Boarding</span>
            </button>

            {/* 3. Depart */}
            <button
              type="button"
              onClick={() => handleUpdateStatus("depart")}
              className={`py-2.5 px-1.5 sm:px-2 rounded-xl text-center flex flex-col items-center justify-center gap-1 cursor-pointer transition active:scale-95 border ${
                busStatus === "depart"
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300/60"
                  : "bg-[#F7F9FB] hover:bg-slate-100 text-slate-700 border-slate-200"
              }`}
              title="Set bus status to Depart"
            >
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
              <span className="text-[11px] font-black uppercase tracking-tight">Depart</span>
            </button>
          </div>
        </section>

        {/* ── HERO CARD: Display Number of Passengers on Board ── */}
        <section className="bg-gradient-to-br from-[#101A2C] via-[#162238] to-[#1F2F4C] text-white rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-700/60 relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none blur-xl" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#FF9E58] shrink-0">
                  <span className="material-symbols-outlined text-[19px]">groups</span>
                </span>
                <div className="min-w-0">
                  <h3 className="text-[10.5px] sm:text-[11px] font-black uppercase tracking-wider text-slate-300 truncate">
                    PASSENGERS ON BOARD
                  </h3>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium truncate">
                    Live Cabin Headcount
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                  availableSeats === 0
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : availableSeats <= 5
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {availableSeats === 0 ? "Full Bus" : `${availableSeats} Seats Left`}
              </span>
            </div>

            {/* Big Headcount Counter */}
            <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                  {passengersOnBoard}
                </span>
                <span className="text-slate-300 font-bold text-base sm:text-lg">
                  / {totalSeats}
                </span>
                <span className="text-[11px] sm:text-[12px] font-extrabold text-[#FF9E58] bg-[#F95700]/20 px-2 py-0.5 rounded-md border border-[#F95700]/30 ml-1">
                  {occupancyPercent}% FULL
                </span>
              </div>

              {/* Headcount Status Badge */}
              <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-bold text-slate-200 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Cabin Count</span>
              </div>
            </div>

            {/* Capacity Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#00C853] via-[#FFB300] to-[#F95700] rounded-full transition-all duration-300"
                  style={{ width: `${occupancyPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[9.5px] sm:text-[10px] text-slate-400 font-medium">
                <span className="flex items-center gap-1 truncate mr-1">
                  <span className="material-symbols-outlined text-[12px] text-emerald-400 shrink-0">sync</span>
                  <span className="truncate">Increases on Walk-in or QR Scan</span>
                </span>
                <span className="shrink-0">{availableSeats} Vacant</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── THE TWO CORE ACTION BUTTONS ── */}
        <section className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {/* 1. Walk-in Ticket Button */}
          <button
            type="button"
            onClick={() => router.push("/conductor/pos")}
            className="group relative bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-md transition-all flex flex-col justify-between text-left cursor-pointer border border-[#F95700]"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">receipt_long</span>
              </div>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">
                arrow_outward
              </span>
            </div>

            <div className="mt-3 sm:mt-4">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-orange-200">
                CASH &amp; POS
              </span>
              <h3 className="text-[15px] sm:text-[17px] font-black leading-tight text-white mt-0.5">
                Walk-in Ticket
              </h3>
            </div>
          </button>

          {/* 2. Scan Passenger Button */}
          <button
            type="button"
            onClick={() => router.push("/conductor/scan")}
            className="group relative bg-[#101A2C] hover:bg-[#182640] active:scale-[0.98] text-white p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl shadow-md transition-all flex flex-col justify-between text-left cursor-pointer border border-slate-700/80"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#FF9E58]">
                <span className="material-symbols-outlined text-[20px] sm:text-[22px]">qr_code_scanner</span>
              </div>
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] opacity-75 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition">
                arrow_outward
              </span>
            </div>

            <div className="mt-3 sm:mt-4">
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400">
                ONLINE RESERVATION
              </span>
              <h3 className="text-[15px] sm:text-[17px] font-black leading-tight text-white mt-0.5">
                Scan Passenger
              </h3>
            </div>
          </button>
        </section>

        {/* ── NOTIFICATION SECTION: Seat Reservation Requests (The idea is conductor selects the seat) ── */}
        <section
          id="seat-requests-section"
          className="bg-white rounded-3xl p-4.5 shadow-2xs border border-[#ECEEF0] space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">airline_seat_recline_extra</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[15px] font-black text-[#191C1E] tracking-tight">
                    Seat Reservation Requests
                  </h3>
                  {pendingSeatBookings.length > 0 && (
                    <span className="bg-[#F95700] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {pendingSeatBookings.length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => router.push("/conductor/matrix")}
                className="text-[10px] font-bold text-[#F95700] hover:bg-[#FFE8D6] px-2 py-1 rounded-lg transition cursor-pointer flex items-center gap-1"
                title="View Seat Map"
              >
                <span className="material-symbols-outlined text-[13px]">airline_seat_recline_normal</span>
                <span>Seat Map</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateNewReservation}
                className="text-[10px] font-bold text-[#A53700] hover:bg-[#FFE8D6] px-2 py-1 rounded-lg transition cursor-pointer"
                title="Add a test online booking"
              >
                + Simulate
              </button>
            </div>
          </div>

          {/* Pending Bookings List */}
          {pendingSeatBookings.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {pendingSeatBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-[#FFF8F2] border-2 border-[#F95700]/30 rounded-2xl p-3.5 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[14px] text-[#191C1E]">
                          {booking.passengerName}
                        </span>
                        <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          Awaiting Seat
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                        {booking.direction === "sogod-ormoc" ? "Sogod ➔ Ormoc City" : "Ormoc City ➔ Sogod"} • Dep: {booking.departureTime}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold mt-1">
                        <span className="flex items-center gap-0.5 text-emerald-700 font-bold">
                          <span className="material-symbols-outlined text-[13px]">payments</span>
                          <span>Paid ₱{booking.totalFare} ({booking.paymentMethod})</span>
                        </span>
                        <span>•</span>
                        <span>PNR: {booking.pnr}</span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-[#FFE8D6] text-[#F95700] flex items-center justify-center font-black text-xs">
                      ?
                    </div>
                  </div>

                  {/* Conductor Seat Selection CTA */}
                  <button
                    type="button"
                    onClick={() => {
                      router.push(`/conductor/matrix?assignBookingId=${booking.id}`);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[12px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">airline_seat_recline_normal</span>
                    <span>Select &amp; Assign Seat on Bus Map</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#F8F9FA] rounded-2xl p-4 text-center space-y-1.5 border border-dashed border-[#ECEEF0]">
              <span className="material-symbols-outlined text-[24px] text-slate-400">check_circle</span>
              <p className="text-[12px] font-bold text-slate-600">All Online Reservations Assigned</p>
              <p className="text-[10px] text-slate-400">
                When a commuter books and pays online, they will appear here for you to assign their seat.
              </p>
            </div>
          )}

          {/* Recently Confirmed Online Bookings */}
          {confirmedSeatBookings.length > 0 && (
            <div className="pt-1 border-t border-[#ECEEF0]">
              <details className="group cursor-pointer">
                <summary className="flex items-center justify-between text-[11px] font-bold text-slate-500 py-1">
                  <span>Assigned Online Bookings ({confirmedSeatBookings.length})</span>
                  <span className="material-symbols-outlined text-[16px] group-open:rotate-180 transition">
                    expand_more
                  </span>
                </summary>
                <div className="space-y-1.5 pt-2">
                  {confirmedSeatBookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#101A2C] text-white flex items-center justify-center font-black text-[10px]">
                          {b.assignedSeat || "—"}
                        </span>
                        <div>
                          <p className="font-bold text-[#191C1E] text-[12px]">{b.passengerName}</p>
                          <p className="text-[10px] text-slate-500">PNR: {b.pnr}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Seat #{b.assignedSeat} Assigned
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </section>

        {/* ── PASSENGER ALERT ("Notify Bus" pings) ── */}
        <section className="bg-white rounded-3xl p-4.5 shadow-2xs border border-[#ECEEF0] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#FFE8D6] text-[#F95700] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">cell_tower</span>
              </div>
              <div>
                <h3 className="text-[15px] font-black text-[#191C1E] tracking-tight">
                  Passenger Alert
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.push("/conductor/map")}
                className="py-1.5 px-3 rounded-xl bg-[#F95700] hover:bg-[#E04E00] active:scale-95 text-white font-black text-[11px] shadow-2xs transition flex items-center gap-1 cursor-pointer"
                title="View passengers on Leyte highway map"
              >
                <span className="material-symbols-outlined text-[15px]">map</span>
                <span>View Map</span>
              </button>
              {passengerHails && passengerHails.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] animate-ping" />
              )}
            </div>
          </div>

          {passengerHails && passengerHails.length > 0 ? (
            <div className="space-y-2.5 pt-1">
              {passengerHails.map((hail) => (
                <SwipeableHailCard
                  key={hail.id}
                  hail={hail}
                  onPickup={handlePickupHail}
                  onRemove={handleRemoveHail}
                  onViewMap={(h) => router.push(`/conductor/map?hailId=${h.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-[#F8F9FA] rounded-2xl p-4 text-center space-y-1.5 border border-dashed border-[#ECEEF0]">
              <span className="material-symbols-outlined text-[24px] text-slate-400">cell_tower</span>
              <p className="text-[12px] font-bold text-slate-600">No Active Passenger Pings</p>
              <p className="text-[10px] text-slate-400">
                Roadside commuters waiting along the route who notify the bus will appear here.
              </p>
            </div>
          )}
        </section>

        {/* ── Conductor Shift Info & App Switcher ── */}
        <div className="text-center pt-2 space-y-2">
          <p className="text-[10px] text-slate-400 font-medium">
            Shift Active • Terminal Dispatch GPS Synchronized
          </p>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#A53700] font-bold py-1.5 px-3.5 rounded-full bg-slate-100 hover:bg-slate-200 transition"
          >
            <span className="material-symbols-outlined text-[15px]">arrow_back</span>
            <span>Return to Passenger App</span>
          </Link>
        </div>
      </main>

      {/* ── Conductor & Bus Registration Modal ── */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-[420px] w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 shadow-2xl space-y-4 border border-[#ECEEF0] text-[#191C1E] my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">badge</span>
                </div>
                <div>
                  <h3 className="font-black text-[16px] text-[#191C1E]">
                    Conductor &amp; Bus Registration
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Register crew details &amp; corridor assignment
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowRegisterModal(false)}
                className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-900 flex items-center justify-center text-sm cursor-pointer shrink-0"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRegistration} className="space-y-4">
              {/* 1. Conductor Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Conductor Full Name
                </label>
                <div className="flex items-center gap-2 bg-[#F2F4F6] border border-[#ECEEF0] rounded-2xl px-3.5 py-2.5 focus-within:border-[#F95700] transition">
                  <span className="material-symbols-outlined text-[19px] text-slate-500">person</span>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Kuya Rolly B."
                    className="bg-transparent font-black text-[14px] text-[#191C1E] outline-none w-full"
                  />
                </div>
              </div>

              {/* 2. Bus Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Assigned Bus Number
                </label>
                <div className="flex items-center gap-2 bg-[#F2F4F6] border border-[#ECEEF0] rounded-2xl px-3.5 py-2.5 focus-within:border-[#F95700] transition">
                  <span className="material-symbols-outlined text-[19px] text-slate-500">directions_bus</span>
                  <input
                    type="text"
                    required
                    value={formBusNumber}
                    onChange={(e) => setFormBusNumber(e.target.value)}
                    placeholder="e.g. DMS-048"
                    className="bg-transparent font-black text-[14px] text-[#191C1E] uppercase outline-none w-full"
                  />
                </div>
                {/* Quick suggestions */}
                <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-bold">Quick:</span>
                  {["DMS-048", "DMS-032", "DMS-089", "DMS-104"].map((bNum) => (
                    <button
                      key={bNum}
                      type="button"
                      onClick={() => setFormBusNumber(bNum)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        formBusNumber.toUpperCase() === bNum
                          ? "bg-[#FFE8D6] text-[#A53700] border-[#F95700]"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {bNum}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Choose Route Direction: Sogod to Ormoc or Ormoc to Sogod */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Choose Corridor Route Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormDirection("sogod-to-ormoc")}
                    className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                      formDirection === "sogod-to-ormoc"
                        ? "border-[#F95700] bg-[#FFF8F2] shadow-2xs"
                        : "border-[#ECEEF0] bg-[#F7F9FB] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-black uppercase text-[#F95700]">Outbound</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formDirection === "sogod-to-ormoc"
                            ? "border-[#F95700] bg-[#F95700]"
                            : "border-slate-300"
                        }`}
                      >
                        {formDirection === "sogod-to-ormoc" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-[13px] font-black text-[#191C1E]">Sogod ➔ Ormoc</p>
                      <p className="text-[10px] text-slate-500 font-medium">Via Baybay City</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormDirection("ormoc-to-sogod")}
                    className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                      formDirection === "ormoc-to-sogod"
                        ? "border-[#F95700] bg-[#FFF8F2] shadow-2xs"
                        : "border-[#ECEEF0] bg-[#F7F9FB] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-black uppercase text-[#F95700]">Inbound</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formDirection === "ormoc-to-sogod"
                            ? "border-[#F95700] bg-[#F95700]"
                            : "border-slate-300"
                        }`}
                      >
                        {formDirection === "ormoc-to-sogod" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-[13px] font-black text-[#191C1E]">Ormoc ➔ Sogod</p>
                      <p className="text-[10px] text-slate-500 font-medium">Return Trip</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 4. Kind of Bus: Aircondition or Non Aircon */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Kind of Bus (Amenity)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormIsAircon(true)}
                    className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                      formIsAircon
                        ? "border-[#F95700] bg-[#FFF8F2] shadow-2xs"
                        : "border-[#ECEEF0] bg-[#F7F9FB] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-[20px] text-[#F95700]">ac_unit</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          formIsAircon
                            ? "border-[#F95700] bg-[#F95700]"
                            : "border-slate-300"
                        }`}
                      >
                        {formIsAircon && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-[13px] font-black text-[#191C1E]">Aircondition</p>
                      <p className="text-[10px] text-slate-500 font-medium">Cool &amp; Express</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormIsAircon(false)}
                    className={`p-3 rounded-2xl text-left border-2 transition cursor-pointer flex flex-col justify-between ${
                      !formIsAircon
                        ? "border-[#F95700] bg-[#FFF8F2] shadow-2xs"
                        : "border-[#ECEEF0] bg-[#F7F9FB] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="material-symbols-outlined text-[20px] text-slate-600">mode_fan</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          !formIsAircon
                            ? "border-[#F95700] bg-[#F95700]"
                            : "border-slate-300"
                        }`}
                      >
                        {!formIsAircon && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-[13px] font-black text-[#191C1E]">Non Aircon</p>
                      <p className="text-[10px] text-slate-500 font-medium">Regular Airflow</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Status Note */}
              <div className="flex items-center gap-1.5 text-[10.5px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="material-symbols-outlined text-[15px] text-amber-600">info</span>
                <span>Registering will automatically set bus status to <strong>In Queue</strong>.</span>
              </div>

              {/* Submit & Cancel CTAs */}
              <div className="pt-1 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[14px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>Register &amp; Save Shift</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
