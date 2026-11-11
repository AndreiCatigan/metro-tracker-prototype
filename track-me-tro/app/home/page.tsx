"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";
import { useAppContext, SimulatedTime } from "@/lib/AppContext";
import { TRAVEL_TIMES_FROM_SOGOD } from "@/lib/mockData";
import { calculateTripETA } from "@/components/ScheduleList";

interface DepartedBus {
  id: string;
  busNumber: string;
  driverName: string;
  departureTime: string;
  terminal: string;
  gate: string;
  isAircon: boolean;
  passengers: number;
  capacity: number;
  status: "en_route" | "arrived";
  currentStop: string;
  nextStop: string;
  speed: string;
  progressPercent: number;
}

export default function HomePage() {
  const router = useRouter();
  const {
    passengerName,
    userLocation,
    simulatedTime,
  } = useAppContext();

  // Extract first name for personalized greeting
  const firstName = passengerName ? passengerName.split(" ")[0] : "Juana";

  // State for swapping origin and destination
  const [origin, setOrigin] = useState("Sogod, Southern Leyte");
  const [destination, setDestination] = useState("Ormoc City, Leyte");

  // Selected departed bus index
  const [selectedDepartedId, setSelectedDepartedId] = useState<string>("en_route_bus");

  // Calendar dates state
  const [selectedDate, setSelectedDate] = useState("03");
  const [showNotifications, setShowNotifications] = useState(false);

  const daysOfWeek = [
    { day: "S", date: "01" },
    { day: "M", date: "02" },
    { day: "T", date: "03" },
    { day: "W", date: "04" },
    { day: "T", date: "05" },
    { day: "F", date: "06" },
    { day: "S", date: "07" },
  ];

  // Dynamic departed buses based on the active simulated time (9 AM, 2 PM, 4 PM)
  const getDepartedBuses = (time: SimulatedTime): DepartedBus[] => {
    switch (time) {
      case "2:00 PM":
        return [
          {
            id: "en_route_bus",
            busNumber: "DMS-065",
            driverName: "Kuya Benjie M.",
            departureTime: "1:30 PM",
            terminal: "Sogod Terminal",
            gate: "Bay 2",
            isAircon: true,
            passengers: 44,
            capacity: 45,
            status: "en_route",
            currentStop: "Approaching Bato Junction",
            nextStop: "Bato Terminal (~2:15 PM)",
            speed: "54 km/h",
            progressPercent: 36,
          },
          {
            id: "arrived_bus",
            busNumber: "DMS-060",
            driverName: "Mang Mario R.",
            departureTime: "11:00 AM",
            terminal: "Sogod Terminal",
            gate: "Bay 1",
            isAircon: true,
            passengers: 45,
            capacity: 45,
            status: "arrived",
            currentStop: "Ormoc City Port Terminal",
            nextStop: "Arrived at Ormoc (1:45 PM)",
            speed: "0 km/h (Docked)",
            progressPercent: 100,
          },
        ];
      case "4:00 PM":
        return [
          {
            id: "en_route_bus",
            busNumber: "DMS-069",
            driverName: "Kuya Marlon D.",
            departureTime: "3:30 PM",
            terminal: "Sogod Terminal",
            gate: "Bay 1",
            isAircon: true,
            passengers: 45,
            capacity: 45,
            status: "en_route",
            currentStop: "Highway 1 • Bato North",
            nextStop: "Hilongos Terminal (~4:45 PM)",
            speed: "51 km/h",
            progressPercent: 42,
          },
          {
            id: "arrived_bus",
            busNumber: "DMS-064",
            driverName: "Mang Ruben F.",
            departureTime: "1:00 PM",
            terminal: "Sogod Terminal",
            gate: "Bay 2",
            isAircon: false,
            passengers: 45,
            capacity: 45,
            status: "arrived",
            currentStop: "Ormoc City Port Terminal",
            nextStop: "Arrived at Ormoc (3:45 PM)",
            speed: "0 km/h (Docked)",
            progressPercent: 100,
          },
        ];
      case "9:00 AM":
      default:
        return [
          {
            id: "en_route_bus",
            busNumber: "DMS-055",
            driverName: "Mang Danilo T.",
            departureTime: "8:30 AM",
            terminal: "Sogod Terminal",
            gate: "Bay 1",
            isAircon: false,
            passengers: 45,
            capacity: 45,
            status: "en_route",
            currentStop: "Approaching Bato Junction",
            nextStop: "Bato Terminal (~9:15 AM)",
            speed: "52 km/h",
            progressPercent: 35,
          },
          {
            id: "arrived_bus",
            busNumber: "DMS-050",
            driverName: "Kuya Nestor V.",
            departureTime: "6:00 AM",
            terminal: "Sogod Terminal",
            gate: "Bay 3",
            isAircon: true,
            passengers: 45,
            capacity: 45,
            status: "arrived",
            currentStop: "Ormoc City Port Terminal",
            nextStop: "Arrived at Ormoc (8:45 AM)",
            speed: "0 km/h (Docked)",
            progressPercent: 100,
          },
        ];
    }
  };

  const departedBuses = getDepartedBuses(simulatedTime);
  const activeDeparted = departedBuses.find((b) => b.id === selectedDepartedId) || departedBuses[0];

  // Calculate ETA of the departed bus reaching the user's set location
  const userTravelMins = TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 115;
  const departedETAAtUserLoc = calculateTripETA(activeDeparted.departureTime, userTravelMins);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleBookTicketClick = () => {
    const dir = origin.toLowerCase().includes("sogod") ? "sogod-ormoc" : "ormoc-sogod";
    router.push(`/booking?direction=${dir}`);
  };

  // Quick book trip previews based on simulated time
  const getUpcomingPreviews = (time: SimulatedTime) => {
    switch (time) {
      case "2:00 PM":
        return [
          { dep: "2:00 PM", bus: "DMS-066", aircon: true, seats: "8 seats left", tag: "Boarding Now" },
          { dep: "2:30 PM", bus: "DMS-067", aircon: false, seats: "24 seats left", tag: "In Queue" },
        ];
      case "4:00 PM":
        return [
          { dep: "4:00 PM", bus: "DMS-070", aircon: false, seats: "11 seats left", tag: "Boarding Now" },
          { dep: "4:30 PM", bus: "DMS-071", aircon: true, seats: "29 seats left", tag: "In Queue" },
        ];
      case "9:00 AM":
      default:
        return [
          { dep: "9:00 AM", bus: "DMS-056", aircon: true, seats: "7 seats left", tag: "Boarding Now" },
          { dep: "9:30 AM", bus: "DMS-057", aircon: true, seats: "21 seats left", tag: "In Queue" },
        ];
    }
  };

  const upcomingPreviews = getUpcomingPreviews(simulatedTime);

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
                  {departedBuses[1]?.busNumber} completed its trip and arrived at Ormoc City Port Terminal.
                </p>
              </div>

              <div className="p-3 bg-[#FFE8D6]/60 rounded-2xl border border-[#F5DECD] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#A53700]">Departed Bus Alert</span>
                  <span className="text-[10px] text-slate-400">15m ago</span>
                </div>
                <p className="text-slate-700 font-medium">
                  {departedBuses[0]?.busNumber} departed on schedule. Approaching Bato junction.
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
              {/* Origin Field */}
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

              {/* Destination Field */}
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

          {/* Action Buttons: Live Buses & Book Ticket */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => router.push("/map")}
              className="w-full py-3.5 px-4 rounded-full bg-[#181C24] hover:bg-black active:scale-[0.98] text-white font-black text-[14px] tracking-tight shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px] text-[#F95700]">near_me</span>
              <span>Live Buses</span>
            </button>

            <button
              type="button"
              onClick={handleBookTicketClick}
              className="w-full py-3.5 px-4 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[14px] tracking-tight shadow-[0_6px_20px_rgba(249,87,0,0.35)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">confirmation_number</span>
              <span>Book Ticket</span>
            </button>
          </div>
        </section>

        {/* ── Departed Buses Section (Buses That Have Already Departed) ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-[18px] font-black tracking-tight text-[#191C1E]">
                Departed Buses
              </h2>
            </div>

            <span className="text-[10px] font-black text-slate-500 bg-slate-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              En Route
            </span>
          </div>

          {/* Departed Buses Selector Tabs: En Route vs Arrived at Ormoc */}
          <div className="bg-[#ECEEF0] p-1 rounded-2xl flex items-center gap-1 shadow-2xs">
            {departedBuses.map((bus) => {
              const isSelected = selectedDepartedId === bus.id;
              return (
                <button
                  key={bus.id}
                  type="button"
                  onClick={() => setSelectedDepartedId(bus.id)}
                  className={`flex-1 py-2 px-2.5 rounded-xl text-[12px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? "bg-[#181C24] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${bus.status === "arrived" ? "bg-emerald-400" : "bg-blue-400"}`} />
                  <span>{bus.busNumber}</span>
                  <span className="text-[10px] opacity-75">
                    ({bus.status === "arrived" ? "Arrived" : bus.departureTime})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Departed Bus Detailed Card */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border-2 border-emerald-100 relative overflow-hidden space-y-3.5">
            {/* Top row: Unit ID, Driver, Aircon status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#101A2C] text-white flex flex-col items-center justify-center shadow-xs">
                  <span className="text-[9px] font-bold text-slate-400">BUS</span>
                  <span className="text-[13px] font-black leading-none">{activeDeparted.busNumber.replace("DMS-", "")}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[16px] font-black text-[#191C1E]">Bus {activeDeparted.busNumber}</h3>
                    {activeDeparted.isAircon ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Aircon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.2 rounded-full text-[10px] font-black">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        Non-Air
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Driver: <span className="font-bold text-slate-700">{activeDeparted.driverName}</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                {activeDeparted.status === "arrived" ? (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    Arrived at Ormoc
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Departed {activeDeparted.departureTime}
                  </span>
                )}
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activeDeparted.terminal} • {activeDeparted.gate}</p>
              </div>
            </div>

            {/* Commuter ETA Banner or Arrived Confirmation */}
            {activeDeparted.status === "arrived" ? (
              <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                    TRIP COMPLETED • ORMOC CITY PORT
                  </p>
                  <p className="text-[15px] font-black text-emerald-900 leading-tight">
                    Arrived at {activeDeparted.nextStop.replace("Arrived at Ormoc (", "").replace(")", "")}
                  </p>
                </div>
                <div className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-emerald-800 shadow-2xs border border-emerald-200">
                  <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span>
                  <span>Docked</span>
                </div>
              </div>
            ) : (
              <div className="bg-[#FFE8D6]/70 rounded-2xl p-3 border border-[#F5DECD] flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    ETA AT YOUR STOP ({userLocation})
                  </p>
                  <p className="text-[16px] font-black text-[#A53700] leading-tight">
                    {departedETAAtUserLoc}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-[10px] font-black text-slate-700 shadow-2xs">
                    <span className="material-symbols-outlined text-[13px] text-[#F95700]">speed</span>
                    <span>{activeDeparted.speed}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Corridor Progression Tracker */}
            <div className="bg-[#F7F9FB] rounded-2xl p-3 border border-[#ECEEF0] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-600">Sogod ➔ Ormoc Corridor</span>
                <span className="text-emerald-700 font-black">
                  {activeDeparted.passengers} / {activeDeparted.capacity} Passengers ({Math.round((activeDeparted.passengers / activeDeparted.capacity) * 100)}%)
                </span>
              </div>

              {/* Waypoint route bar */}
              <div className="relative pt-2 pb-1">
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      activeDeparted.status === "arrived"
                        ? "bg-emerald-500"
                        : "bg-gradient-to-r from-emerald-500 to-[#F95700]"
                    }`}
                    style={{ width: `${activeDeparted.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-extrabold text-slate-400 pt-1.5">
                  <span className="text-slate-700">Sogod</span>
                  <span className={activeDeparted.status === "arrived" ? "text-slate-700" : "text-[#A53700] font-black"}>
                    ▶ {activeDeparted.currentStop.split("•")[0]}
                  </span>
                  <span>Baybay</span>
                  <span className={activeDeparted.status === "arrived" ? "text-emerald-700 font-black" : ""}>
                    Ormoc ✓
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-[11px]">
                <span className="text-slate-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#F95700]">location_on</span>
                  <span>Status: <strong className="text-slate-700">{activeDeparted.nextStop}</strong></span>
                </span>
              </div>
            </div>

            {/* Track on Live GPS Map */}
            <button
              type="button"
              onClick={() => router.push("/map")}
              className="w-full py-2.5 px-4 rounded-2xl bg-[#181C24] hover:bg-black text-white font-extrabold text-[12px] shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
            >
              <span className="material-symbols-outlined text-[15px] text-[#F95700]">near_me</span>
              <span>Track {activeDeparted.busNumber} on Live GPS Map</span>
            </button>
          </div>
        </section>

        {/* ── Book A Ticket Section & Date Selector ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[18px] font-black tracking-tight text-[#191C1E] flex items-center gap-1.5">
              <span>Book A Ticket</span>
              <span className="text-amber-500 text-[16px]">👑</span>
            </h2>
            <button
              type="button"
              onClick={handleBookTicketClick}
              className="text-[11px] font-bold text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full hover:bg-[#F5DECD] transition cursor-pointer"
            >
              Reserve Seat ➔
            </button>
          </div>

          {/* Mini-Calendar Card */}
          <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#ECEEF0] space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-extrabold text-[15px] text-[#191C1E]">
                November 2026
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#E0E8F0] text-slate-600 hover:bg-[#D0DCE8] flex items-center justify-center transition cursor-pointer"
                  aria-label="Previous week"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                </button>
                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-[#E0E8F0] text-slate-600 hover:bg-[#D0DCE8] flex items-center justify-center transition cursor-pointer"
                  aria-label="Next week"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {daysOfWeek.map((item) => {
                const isSelected = selectedDate === item.date;

                return (
                  <button
                    key={item.date}
                    type="button"
                    onClick={() => setSelectedDate(item.date)}
                    className={`py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? "bg-[#FFDBCA] text-[#191C1E] shadow-2xs font-black ring-2 ring-[#F95700]/30"
                        : "text-slate-600 hover:bg-slate-50 font-bold"
                    }`}
                  >
                    <span className="text-[11px] text-slate-400 font-semibold mb-0.5">
                      {item.day}
                    </span>
                    <span className="text-[14px] leading-tight">{item.date}</span>
                  </button>
                );
              })}
            </div>

            {/* Upcoming Trip Reservation Previews for Active Time */}
            <div className="pt-2 border-t border-[#ECEEF0] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <p className="font-extrabold text-slate-400 uppercase tracking-wider">
                  Upcoming Departures ({simulatedTime}):
                </p>
                <span className="text-[10px] font-black text-[#A53700] bg-[#FFE8D6] px-2 py-0.5 rounded-full">
                  Continuous 30m
                </span>
              </div>

              <div className="space-y-1.5">
                {upcomingPreviews.map((preview, idx) => (
                  <button
                    key={preview.bus}
                    type="button"
                    onClick={() => router.push(`/booking?direction=sogod-ormoc&trip=sogod-ormoc-trip-${idx + 1}`)}
                    className="w-full bg-[#F7F9FB] hover:bg-[#FFE8D6]/40 p-2.5 rounded-2xl border border-[#ECEEF0] flex items-center justify-between text-left transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center text-white ${
                        idx === 0 ? "bg-[#F95700]" : "bg-[#181C24]"
                      }`}>
                        {preview.dep.replace(":00", "").replace(" ", "")}
                      </span>
                      <div>
                        <p className="text-[13px] font-black text-[#191C1E]">
                          {preview.dep} • {preview.bus}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {preview.aircon ? "Aircon Express" : "Non-Aircon"} • {preview.seats}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] font-black text-[#A53700]">₱95.00</span>
                      <p className="text-[9px] text-[#A53700] font-extrabold uppercase">{preview.tag}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleBookTicketClick}
                className="w-full py-3 rounded-2xl bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[13px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <span>View Full Schedule &amp; Book Online</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Corridor Highlights / Live Summary ── */}
        <section className="bg-white rounded-3xl p-4 shadow-xs border border-[#ECEEF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFE8D6] text-[#A53700] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h3 className="text-[14px] font-black text-[#191C1E]">Daily Corridor Timetable</h3>
              <p className="text-[11px] text-slate-400 font-medium">Buses depart every 30 mins (4AM–5PM)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/schedule")}
            className="px-3.5 py-2 rounded-full bg-[#181C24] text-white text-[11px] font-black hover:bg-black transition cursor-pointer"
          >
            Full Schedule
          </button>
        </section>
      </main>

      {/* ── Bottom Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
