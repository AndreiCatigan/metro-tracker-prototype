"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BrandHeader from "@/components/BrandHeader";
import PrimaryButton from "@/components/PrimaryButton";
import InputField from "@/components/InputField";

/** Auto-format a PH mobile number as "912 345 6789" */
function formatPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").substring(0, 10);
  if (digits.length > 6) {
    return `${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`;
  }
  if (digits.length > 3) {
    return `${digits.substring(0, 3)} ${digits.substring(3)}`;
  }
  return digits;
}

/** Value-prop feature data for the 3-column grid */
const VALUE_PROPS = [
  {
    icon: "share_location",
    title: "Live GPS",
    subtitle: "Accurate ETA",
  },
  {
    icon: "airline_seat_recline_normal",
    title: "Seat Count",
    subtitle: "Real-Time",
  },
  {
    icon: "contactless",
    title: "Cashless",
    subtitle: "Instant Tap",
  },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = useCallback((value: string) => {
    setPhone(formatPhoneNumber(value));
  }, []);

  const handleContinue = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      router.push("/home");
    }, 1000);
  }, [router]);

  const handleGuestContinue = useCallback(() => {
    router.push("/map");
  }, [router]);

  return (
    <main className="flex-1 flex flex-col relative w-full bg-surface max-w-[480px] mx-auto selection:bg-primary-fixed selection:text-on-primary-fixed">
      <div className="flex flex-col w-full">
        {/* ── Brand Header (Top Scrim with Logo & Live Network Pill) ── */}
        <BrandHeader />

        {/* ── Content & Form Container ── */}
        <div className="flex flex-col px-margin py-space-lg space-y-space-lg">
          {/* Headline & Subtitle */}
          <div className="flex flex-col space-y-space-xs text-left">
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight tracking-tight font-extrabold">
              Your Daily Commute,
              <br />
              Simplified.
            </h1>
            <p className="font-body-md text-body-md text-secondary leading-relaxed">
              Track buses in real-time, view live schedules, and ride cashless
              across the regional network.
            </p>
          </div>

          {/* ── Quick Value-Props Grid ── */}
          <div className="grid grid-cols-3 gap-space-sm">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="flex flex-col items-center justify-center p-space-sm bg-surface-container-lowest rounded-DEFAULT shadow-sm text-center"
              >
                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-primary mb-1.5">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {prop.icon}
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-bold leading-tight">
                  {prop.title}
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-bold">
                  {prop.subtitle}
                </span>
              </div>
            ))}
          </div>

          {/* ── Mobile Authentication Card (Input + Primary CTA Button inside card) ── */}
          <InputField
            label="Mobile Number"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="912 345 6789"
            type="tel"
            inputMode="numeric"
            maxLength={12}
            badge={
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1 font-bold">
                <span className="material-symbols-outlined text-[14px]">
                  bolt
                </span>
                Quick Login
              </span>
            }
            prefix={
              <button
                type="button"
                className="flex items-center gap-1.5 bg-surface-container-lowest py-2.5 px-3.5 rounded-full shadow-sm cursor-pointer"
              >
                <span
                  aria-label="Philippines"
                  className="font-headline-sm text-body-lg leading-none"
                  role="img"
                >
                  🇵🇭
                </span>
                <span className="font-label-lg text-label-lg text-on-surface font-extrabold">
                  +63
                </span>
                <span className="material-symbols-outlined text-[16px] text-secondary">
                  expand_more
                </span>
              </button>
            }
            helperIcon="verified_user"
            helperText="We will send a 6-digit SMS verification code to protect your commuter wallet and bookings."
          >
            {/* Primary Action CTA Button inside the card */}
            <PrimaryButton
              icon="arrow_forward"
              loading={loading}
              onClick={handleContinue}
              className="mt-space-xs"
            >
              Continue
            </PrimaryButton>
          </InputField>

          {/* ── Guest / Alternative Options ── */}
          <div className="flex flex-col items-center justify-center space-y-space-md pt-space-xs">
            <button
              type="button"
              onClick={handleGuestContinue}
              className="py-3 px-6 rounded-full bg-secondary-fixed/50 text-on-secondary-fixed font-label-lg text-label-lg font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                map
              </span>
              <span>Continue as Guest (Free Map Only)</span>
            </button>

            {/* Trust & Certification Footer */}
            <div className="flex flex-col items-center space-y-space-xs text-center text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-tertiary">
                  verified
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  LTFRB Certified Partner • 256-bit Encrypted
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-secondary">
                By proceeding, you agree to our{" "}
                <a
                  className="underline text-on-surface hover:text-primary"
                  href="#"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  className="underline text-on-surface hover:text-primary"
                  href="#"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
