"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BottomNavigation from "@/components/BottomNavigation";
import Logo from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();

  // State for swapping origin and destination
  const [origin, setOrigin] = useState("Sogod");
  const [destination, setDestination] = useState("Ormoc");

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSelectFrequentRoute = (from: string, to: string) => {
    setOrigin(from);
    setDestination(to);
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      {/* ── Fixed Header with Backdrop Blur ── */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-surface-container-high/60">
        <div className="max-w-[480px] mx-auto px-margin py-3 flex items-center justify-between">
          {/* Left: Primary circle with transit icon and Home text */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                directions_bus
              </span>
            </div>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Home
            </span>
          </div>

          {/* Right: Notification Bell & Profile Avatar */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface transition relative cursor-pointer"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-container" />
            </button>

            <Link
              href="/conductor"
              className="w-9 h-9 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center shadow-xs border border-primary-fixed-dim hover:scale-105 transition"
              title="Juana • Switch to Conductor"
            >
              J
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="flex-1 w-full max-w-[480px] mx-auto px-margin py-space-md space-y-space-lg pb-32">
        {/* ── Hero Section (Warm Peach Background) ── */}
        <section className="relative rounded-3xl bg-gradient-to-b from-tertiary-fixed/35 via-tertiary-fixed/15 to-surface p-space-lg border border-outline-variant/30 overflow-hidden shadow-xs">
          {/* Decorative Route Trail Graphic */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-15 pointer-events-none text-primary">
            <svg
              className="w-full h-full stroke-current"
              fill="none"
              strokeLinecap="round"
              strokeWidth="10"
              viewBox="0 0 100 100"
            >
              <path d="M10 20 C 50 20, 50 80, 90 80 S 130 20, 170 20" />
            </svg>
          </div>

          {/* Stylized Logo Badge */}
          <div className="flex items-center gap-space-sm mb-2">
            <Logo className="h-9 w-auto" />
            <span className="font-label-sm text-[10px] text-on-surface-variant bg-surface-container-lowest px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs font-bold">
              Eastern Visayas
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight leading-tight">
            Where to, Juana?
          </h1>
          <p className="font-body-md text-body-md text-secondary mt-1 leading-relaxed">
            Live GPS bus arrivals and guaranteed seat reservations across Leyte.
          </p>
        </section>

        {/* ── Route Input Card (Level 1 Elevation, rounded-3xl, pure white) ── */}
        <section className="bg-surface-container-lowest rounded-3xl p-space-lg border border-[#E2E8F0] shadow-elevation1 space-y-space-md">
          {/* Origin & Destination with Vertical Swap button */}
          <div className="flex items-center gap-space-sm relative">
            {/* Visual Transit Trail Node & Line */}
            <div className="flex flex-col items-center justify-between self-stretch py-3.5 pl-1 shrink-0">
              {/* Departure Node (Open Circle) */}
              <div className="w-3.5 h-3.5 rounded-full border-2 border-primary bg-surface-container-lowest shadow-2xs" />
              {/* Connector Line */}
              <div className="w-0.5 flex-1 bg-[#E2E8F0] my-1" />
              {/* Destination Node (Solid Orange Circle) */}
              <div className="w-3.5 h-3.5 rounded-full bg-primary shadow-2xs" />
            </div>

            {/* Inputs Column */}
            <div className="flex-1 space-y-2">
              {/* Origin */}
              <div className="bg-surface-container-low p-2.5 rounded-2xl border border-transparent focus-within:border-primary/40 focus-within:bg-surface-container transition">
                <label className="block font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
                  Origin
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface font-bold outline-none placeholder:text-secondary-fixed-dim"
                  placeholder="Enter starting terminal"
                />
              </div>

              {/* Destination */}
              <div className="bg-surface-container-low p-2.5 rounded-2xl border border-transparent focus-within:border-primary/40 focus-within:bg-surface-container transition">
                <label className="block font-label-sm text-[10px] uppercase tracking-wider text-secondary font-bold">
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-transparent font-headline-sm text-headline-sm text-on-surface font-bold outline-none placeholder:text-secondary-fixed-dim"
                  placeholder="Enter destination terminal"
                />
              </div>
            </div>

            {/* Circular Swap Button */}
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high transition shadow-sm flex items-center justify-center text-primary cursor-pointer active:scale-95 shrink-0 border border-outline-variant/30"
              title="Swap Origin &amp; Destination"
              aria-label="Swap Origin and Destination"
            >
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </button>
          </div>

          {/* Chips Row: Departing Now & 1 Passenger */}
          <div className="flex items-center gap-space-xs pt-1">
            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              <span>Departing Now</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-low border border-surface-container-high text-on-surface font-label-md text-label-md font-bold hover:bg-surface-container transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">person</span>
              <span>1 Passenger</span>
            </button>
          </div>

          {/* Action CTA: Track Live Buses */}
          <button
            type="button"
            onClick={() => router.push("/map")}
            className="w-full py-4 rounded-full bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-bold tracking-wide shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 cursor-pointer mt-space-xs"
          >
            <span>Track Live Buses</span>
            <span className="material-symbols-outlined text-[20px]">radar</span>
          </button>
        </section>

        {/* ── Status Card: Active Buses with Pulsing Live Badge ── */}
        <section className="bg-surface-container-lowest rounded-2xl p-space-md border border-[#E2E8F0] shadow-elevation1 flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">directions_bus</span>
            </div>
            <div>
              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                3 Buses Active
              </p>
              <p className="font-body-sm text-body-sm text-secondary">
                Along {origin} ➔ {destination} corridor
              </p>
            </div>
          </div>

          {/* Pulsing Live Badge */}
          <div className="flex items-center gap-1.5 bg-primary-container text-on-primary px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider shadow-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>Live</span>
          </div>
        </section>

        {/* ── Frequent Routes ── */}
        <section className="space-y-space-sm">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-label-lg text-label-lg uppercase tracking-wider text-secondary font-bold">
              Frequent Routes
            </h2>
            <span className="font-label-sm text-label-sm text-primary font-bold">
              Popular in Leyte
            </span>
          </div>

          <div className="space-y-space-sm">
            {/* Route Card 1: Baybay ➔ Ormoc */}
            <div
              onClick={() => handleSelectFrequentRoute("Baybay", "Ormoc")}
              className="p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-2xl border border-[#E2E8F0] shadow-elevation1 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    Baybay ➔ Ormoc
                  </span>
                  <span className="font-label-sm text-[10px] bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full font-bold">
                    Express
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary flex items-center gap-2">
                  <span>⏱ 1 hr 15 min</span>
                  <span>•</span>
                  <span>₱75 Fare + ₱15 Fee</span>
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-surface-container group-hover:bg-primary-container group-hover:text-on-primary text-secondary flex items-center justify-center transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </div>

            {/* Route Card 2: VSU Main Campus ➔ Baybay Terminal */}
            <div
              onClick={() => handleSelectFrequentRoute("VSU Main Campus", "Baybay Terminal")}
              className="p-space-md bg-surface-container-lowest hover:bg-surface-container-low rounded-2xl border border-[#E2E8F0] shadow-elevation1 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    VSU Main Campus ➔ Baybay Terminal
                  </span>
                  <span className="font-label-sm text-[10px] bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
                    Student Shuttle
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-secondary flex items-center gap-2">
                  <span>⏱ 25 min</span>
                  <span>•</span>
                  <span>₱30 Fare + ₱10 Fee</span>
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-surface-container group-hover:bg-primary-container group-hover:text-on-primary text-secondary flex items-center justify-center transition-all shadow-2xs">
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Ad Space Card (Pitch Monetization Model) ── */}
        <section className="bg-gradient-to-r from-surface-container-low to-surface-container rounded-2xl p-space-md border border-dashed border-outline-variant/60 flex items-center gap-space-md shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-primary-container/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
            <span className="material-symbols-outlined text-[26px]">storefront</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-on-surface-variant bg-surface-container-highest px-1.5 py-0.5 rounded">
                Sponsored Partner
              </span>
              <span className="font-label-sm text-[11px] font-bold text-on-surface">
                Leyte Kape &amp; Pasalubong
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-secondary mt-0.5 leading-snug">
              Show your track MEtro digital ticket at Ormoc Terminal for 15% off fresh brewed coffee!
            </p>
          </div>
        </section>
      </main>

      {/* ── Floating Pill Bottom Navigation ── */}
      <BottomNavigation />
    </div>
  );
}
