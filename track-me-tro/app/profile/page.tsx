"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext, SimulatedTime } from "@/lib/AppContext";
import { PassengerType } from "@/lib/data";
import { CORRIDOR_STOPS, TRAVEL_TIMES_FROM_SOGOD } from "@/lib/mockData";
import BottomNavigation from "@/components/BottomNavigation";
import MetroPlusModal from "@/components/MetroPlusModal";

export default function ProfilePage() {
  const router = useRouter();
  const {
    passengerName,
    userLocation,
    setUserLocation,
    simulatedTime,
    setSimulatedTime,
    isPremium,
    setIsPremium,
    verifiedDiscount,
    discountIdNumber,
    discountSchoolOrAgency,
    verifyDiscount,
    removeDiscount,
  } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMetroPlusModal, setShowMetroPlusModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [selectedConcessionType, setSelectedConcessionType] = useState<PassengerType>(
    verifiedDiscount !== "regular" ? verifiedDiscount : "student"
  );
  const [inputAgency, setInputAgency] = useState("Southern Leyte State University (SLSU)");
  const [inputIdNumber, setInputIdNumber] = useState("2024-88421");
  const [isVerifying, setIsVerifying] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenDiscountModal = () => {
    const current = verifiedDiscount !== "regular" ? verifiedDiscount : "student";
    setSelectedConcessionType(current);
    if (current === "student") {
      setInputAgency(discountSchoolOrAgency || "Southern Leyte State University (SLSU)");
      setInputIdNumber(discountIdNumber || "2024-88421");
    } else if (current === "senior") {
      setInputAgency(discountSchoolOrAgency || "Sogod Municipal OSCA");
      setInputIdNumber(discountIdNumber || "OSCA-2024-0918");
    } else if (current === "pwd") {
      setInputAgency(discountSchoolOrAgency || "Baybay City PDAO");
      setInputIdNumber(discountIdNumber || "PWD-0864-10492");
    }
    setShowDiscountModal(true);
  };

  const handleSelectConcessionType = (type: PassengerType) => {
    setSelectedConcessionType(type);
    if (type === "student") {
      setInputAgency("Southern Leyte State University (SLSU)");
      setInputIdNumber("2024-88421");
    } else if (type === "senior") {
      setInputAgency("Sogod Municipal OSCA");
      setInputIdNumber("OSCA-2024-0918");
    } else if (type === "pwd") {
      setInputAgency("Baybay City PDAO");
      setInputIdNumber("PWD-0864-10492");
    }
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      verifyDiscount(selectedConcessionType, inputIdNumber, inputAgency);
      setIsVerifying(false);
      setShowDiscountModal(false);
      const label = selectedConcessionType === "student"
        ? "Student"
        : selectedConcessionType === "senior"
          ? "Senior Citizen"
          : "PWD";
      showToast(`${label} discount verified! 20% discount is now active.`);
    }, 600);
  };

  const handleRemoveDiscount = () => {
    removeDiscount();
    showToast("Discount verification removed. Reverted to Regular rate.");
  };

  const handleLocationChange = (stop: string) => {
    setUserLocation(stop);
    const mins = TRAVEL_TIMES_FROM_SOGOD[stop] ?? 0;
    const timeStr = mins === 0 ? "At Origin" : `+${Math.floor(mins / 60)}h ${mins % 60}m from Sogod`;
    showToast(`Location set to ${stop} (${timeStr}). Bus ETAs updated!`);
  };

  const handleTimeChange = (time: SimulatedTime) => {
    setSimulatedTime(time);
    showToast(`Simulated time set to ${time}. Bus schedule updated!`);
  };

  const currentMins = TRAVEL_TIMES_FROM_SOGOD[userLocation] ?? 115;

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-36">
      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[420px] w-full mx-auto px-4 pt-8 space-y-4">
        {/* ── User Avatar & Identity ── */}
        <div className="text-center space-y-2">
          {/* Circular Line Avatar */}
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
              juana.delacruz@gmail.com • 0922 333 4444
            </p>

            {/* ── User Membership Status Badge (Free tier vs MEtro+) ── */}
            <div className="pt-2 flex justify-center">
              <div
                className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider select-none shadow-2xs ${
                  isPremium
                    ? "bg-gradient-to-r from-amber-500 via-[#F95700] to-amber-600 text-white shadow-[0_2px_10px_rgba(249,87,0,0.3)] ring-2 ring-amber-300/40"
                    : "bg-[#ECEEF0] text-slate-600 border border-slate-300/80"
                }`}
                aria-label={isPremium ? "MEtro+ Member" : "Free Tier Commuter"}
              >
                <span>{isPremium ? "👑" : "👤"}</span>
                <span>{isPremium ? "MEtro+ Member" : "Free Tier Commuter"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Explore Premium CTA / MEtro+ Membership Hub ── */}
        <button
          type="button"
          onClick={() => setShowMetroPlusModal(true)}
          className={`w-full py-3.5 px-4 rounded-full font-black text-[14px] shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer ${
            isPremium
              ? "bg-[#181C24] hover:bg-black text-white"
              : "bg-[#F95700] hover:bg-[#E04E00] text-white"
          }`}
        >
          <span>{isPremium ? "Manage MEtro+ Perks" : "Explore Premium"}</span>
          <span className="text-[16px]">👑</span>
        </button>

        {/* ── Concession & Discount Verification Card ── */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                verifiedDiscount !== "regular"
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-[#FFE8D6] text-[#F95700]"
              }`}>
                <span className="material-symbols-outlined text-[22px]">
                  {verifiedDiscount === "student"
                    ? "school"
                    : verifiedDiscount === "senior"
                      ? "elderly"
                      : verifiedDiscount === "pwd"
                        ? "accessible"
                        : "badge"}
                </span>
              </div>
              <div>
                <h2 className="text-[15px] font-black tracking-tight text-[#191C1E]">
                  Discount Verification
                </h2>
                <p className="text-[11px] font-medium text-slate-500">
                  20% Statutory Concession Fare
                </p>
              </div>
            </div>

            {verifiedDiscount !== "regular" ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Verified</span>
              </span>
            ) : (
              <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Unverified
              </span>
            )}
          </div>

          {verifiedDiscount !== "regular" ? (
            <div className="space-y-3 pt-1">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-emerald-950 uppercase tracking-wider text-[11px]">
                    {verifiedDiscount === "student"
                      ? "Student Concession"
                      : verifiedDiscount === "senior"
                        ? "Senior Citizen Concession"
                        : "PWD Concession"}
                  </span>
                  <span className="font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full text-[10px]">
                    20% OFF ACTIVE
                  </span>
                </div>
                <p className="text-[13px] font-extrabold text-slate-800">
                  {discountSchoolOrAgency || (verifiedDiscount === "student" ? "Southern Leyte State University (SLSU)" : "Regional Government Office")}
                </p>
                <p className="text-[11px] font-mono font-bold text-slate-500">
                  ID: {discountIdNumber || "2024-88421"}
                </p>
                <p className="text-[11px] text-emerald-800 font-medium pt-1 border-t border-emerald-200/60">
                  Your 20% discount will automatically apply on every ticket booking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenDiscountModal}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#F7F9FB] hover:bg-[#ECEEF0] text-slate-800 font-bold text-[12px] border border-[#ECEEF0] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Update ID</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveDiscount}
                  className="py-2.5 px-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[12px] border border-rose-200/60 transition cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <p className="text-[12px] text-slate-600 font-medium leading-relaxed">
                Students, Senior Citizens, and Persons with Disability (PWD) are legally entitled to a <strong>20% discount</strong>. Verify your account once to automatically get discounted rates on all tickets.
              </p>

              <button
                type="button"
                onClick={handleOpenDiscountModal}
                className="w-full py-3 px-4 rounded-2xl bg-[#181C24] hover:bg-black active:scale-[0.98] text-white font-extrabold text-[13px] transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px] text-[#F95700]">verified</span>
                <span>Verify for Discount</span>
              </button>
            </div>
          )}
        </section>

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

        {/* ── CONSOLIDATED DISCREET DEMO SIMULATION CONTROLS (Tucked at Bottom) ── */}
        <section className="bg-slate-100/90 rounded-3xl p-4 border border-slate-200/80 space-y-3.5 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-slate-400">tune</span>
              <span>Demo Simulation Controls</span>
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">Pitch Controls</span>
          </div>

          {/* 1. Conductor App Mode Switcher (Merged inside Demo Controls) */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#101A2C] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div>
                <p className="text-[13px] font-black text-[#191C1E]">Conductor App Mode</p>
                <p className="text-[10px] text-slate-400 font-medium">Manifests &amp; POS ticketing</p>
              </div>
            </div>

            <Link
              href="/conductor"
              className="px-3 py-1.5 rounded-xl bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[11px] shadow-2xs transition flex items-center gap-1"
            >
              <span>Switch</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {/* 2. Simulated Clock: 9 AM, 2 PM, 4 PM */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Set Simulated Time:</span>
              <span className="font-black text-[#A53700]">{simulatedTime}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
              {(["9:00 AM", "2:00 PM", "4:00 PM"] as SimulatedTime[]).map((timeOption) => {
                const isActive = simulatedTime === timeOption;
                return (
                  <button
                    key={timeOption}
                    type="button"
                    onClick={() => handleTimeChange(timeOption)}
                    className={`py-2 px-1 rounded-xl text-[12px] font-black transition cursor-pointer text-center ${
                      isActive
                        ? "bg-[#181C24] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {timeOption}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Simulated Location (Corridor Stop) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Set Commuter Location (GPS):</span>
              <span className="text-[10px] font-bold text-slate-400">
                {currentMins === 0 ? "Origin" : `+${Math.floor(currentMins / 60)}h ${currentMins % 60}m`}
              </span>
            </div>

            <select
              value={userLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-[12px] font-bold text-slate-800 outline-none cursor-pointer"
            >
              {CORRIDOR_STOPS.map((stop) => {
                const mins = TRAVEL_TIMES_FROM_SOGOD[stop] ?? 0;
                const timeLabel = mins === 0 ? "0m • Origin" : `+${Math.floor(mins / 60)}h ${mins % 60}m`;
                return (
                  <option key={stop} value={stop}>
                    {stop} ({timeLabel})
                  </option>
                );
              })}
            </select>
          </div>

          {/* 4. Membership Tier Toggle (Free vs MEtro+) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Simulate Membership Tier:</span>
              <span className="font-black text-[#A53700]">
                {isPremium ? "MEtro+ Premium" : "Free Tier"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsPremium(false);
                  showToast("Switched to Free Tier commuter status.");
                }}
                className={`py-2 px-2 rounded-xl text-[12px] font-black transition cursor-pointer text-center ${
                  !isPremium
                    ? "bg-[#181C24] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Free Tier
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsPremium(true);
                  showToast("Switched to MEtro+ VIP membership active!");
                }}
                className={`py-2 px-2 rounded-xl text-[12px] font-black transition cursor-pointer text-center flex items-center justify-center gap-1 ${
                  isPremium
                    ? "bg-[#F95700] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>👑</span>
                <span>MEtro+ Active</span>
              </button>
            </div>
          </div>

          {/* 5. Simulate Concession Discount Status */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-600">Simulate Concession Status:</span>
              <span className="font-black text-[#A53700]">
                {verifiedDiscount === "regular" ? "Regular (0%)" : `${verifiedDiscount.toUpperCase()} (20% Off)`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-2xl border border-slate-200">
              {(["regular", "student", "senior", "pwd"] as PassengerType[]).map((type) => {
                const isActive = verifiedDiscount === type;
                const label = type === "regular" ? "Regular" : type === "student" ? "Student" : type === "senior" ? "Senior" : "PWD";
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      if (type === "regular") {
                        handleRemoveDiscount();
                      } else {
                        verifyDiscount(type);
                        showToast(`Simulated: Verified ${label} (20% discount active)!`);
                      }
                    }}
                    className={`py-2 px-1 rounded-xl text-[11px] font-black transition cursor-pointer text-center ${
                      isActive
                        ? "bg-[#181C24] text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── Discount Verification Modal ── */}
      {showDiscountModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-[410px] w-full p-5 sm:p-6 shadow-2xl border border-[#ECEEF0] space-y-4 animate-scale-up relative text-left">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#ECEEF0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h3 className="font-black text-[16px] text-[#191C1E]">Verify for Discount</h3>
                  <p className="text-[11px] font-semibold text-slate-500">20% Statutory Fare Concession</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDiscountModal(false)}
                className="w-8 h-8 rounded-full bg-[#F2F4F6] text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs cursor-pointer transition active:scale-95"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerifySubmit} className="space-y-3.5">
              {/* Concession Category Picker */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  Select Concession Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { type: "student" as PassengerType, label: "Student", icon: "school" },
                    { type: "senior" as PassengerType, label: "Senior", icon: "elderly" },
                    { type: "pwd" as PassengerType, label: "PWD", icon: "accessible" },
                  ].map((cat) => {
                    const isSelected = selectedConcessionType === cat.type;
                    return (
                      <button
                        key={cat.type}
                        type="button"
                        onClick={() => handleSelectConcessionType(cat.type)}
                        className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer text-center ${
                          isSelected
                            ? "bg-[#FFE8D6] border-2 border-[#F95700] ring-1 ring-[#F95700]/20"
                            : "bg-[#F7F9FB] border border-[#ECEEF0] hover:border-slate-300"
                        }`}
                      >
                        <span className={`material-symbols-outlined text-[22px] ${
                          isSelected ? "text-[#F95700]" : "text-slate-400"
                        }`}>
                          {cat.icon}
                        </span>
                        <span className={`text-[12px] font-black ${
                          isSelected ? "text-[#A53700]" : "text-slate-700"
                        }`}>
                          {cat.label}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                          20% Off
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Input 1: School or Issuing Office */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {selectedConcessionType === "student"
                    ? "School / University Name"
                    : selectedConcessionType === "senior"
                      ? "Issuing City / Municipality OSCA"
                      : "PDAO / Issuing Authority"}
                </label>
                <input
                  type="text"
                  required
                  value={inputAgency}
                  onChange={(e) => setInputAgency(e.target.value)}
                  className="w-full bg-[#F7F9FB] border border-slate-200 rounded-2xl px-3.5 py-2.5 text-[13px] font-bold text-[#191C1E] outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/20 transition"
                  placeholder="e.g. SLSU Main Campus"
                />
              </div>

              {/* Form Input 2: ID Number */}
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  {selectedConcessionType === "student"
                    ? "Student ID Number"
                    : selectedConcessionType === "senior"
                      ? "Senior Citizen OSCA ID #"
                      : "PWD Registry / ID #"}
                </label>
                <input
                  type="text"
                  required
                  value={inputIdNumber}
                  onChange={(e) => setInputIdNumber(e.target.value)}
                  className="w-full bg-[#F7F9FB] border border-slate-200 rounded-2xl px-3.5 py-2.5 text-[13px] font-bold text-[#191C1E] outline-none focus:border-[#F95700] focus:ring-2 focus:ring-[#F95700]/20 transition font-mono"
                  placeholder="e.g. 2024-88421"
                />
              </div>

              {/* Simulated ID Card Upload Preview */}
              <div className="p-3 bg-[#F7F9FB] border border-dashed border-slate-300 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">badge</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">
                      {selectedConcessionType.toUpperCase()}_ID_JUANA.jpg
                    </p>
                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      <span>Document attached &amp; verified</span>
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#F95700]">Attached</span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscountModal(false)}
                  className="flex-1 py-3 rounded-full bg-[#F2F4F6] hover:bg-[#E6E8EA] text-slate-700 font-bold text-[13px] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 py-3 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-extrabold text-[13px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                >
                  {isVerifying ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying...</span>
                    </span>
                  ) : (
                    <span>Verify &amp; Apply</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MEtro+ Premium Perks Popup Modal ── */}
      <MetroPlusModal
        isOpen={showMetroPlusModal}
        onClose={() => setShowMetroPlusModal(false)}
      />

      {/* ── Floating Navigation Dock ── */}
      <BottomNavigation />
    </div>
  );
}
