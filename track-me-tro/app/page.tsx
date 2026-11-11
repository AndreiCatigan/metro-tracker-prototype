"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("912 345 6789");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
  }, []);

  const handleSendOtp = () => {
    setOtpCode("849201");
    showToast("SMS verification code 849201 sent to your mobile number.");
  };

  const handleLogin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
        router.push("/home");
      }, 700);
    },
    [router]
  );

  return (
    <main className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans select-none pb-12">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">mark_chat_unread</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Warm Peach Hero Section Matching Reference Image ── */}
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

        <div className="max-w-[420px] mx-auto relative z-10">
          {/* Header Row: Logo & Notification Bell */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-[22px] font-black tracking-tight text-[#191C1E]">
                track <span className="text-[#F95700]">ME</span>tro
              </span>
            </div>

            <div className="w-9 h-9 rounded-full bg-white/40 backdrop-blur-xs flex items-center justify-center text-slate-800 shadow-2xs">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </div>
          </div>

          {/* Hero Headline */}
          <div className="mt-6 space-y-1">
            <h1 className="text-[34px] font-black tracking-tight text-[#191C1E] leading-[1.12]">
              Where to,<br />Juana?
            </h1>
            <p className="text-[11px] font-black text-[#A53700] uppercase tracking-wider pt-0.5">
              Eastern Visayas • Live Transit Network
            </p>
          </div>
        </div>
      </section>

      {/* ── Elevated Form Card (Overlapping Hero) ── */}
      <div className="max-w-[420px] w-full mx-auto px-4 -mt-8 relative z-20 space-y-5">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ECEEF0] space-y-4"
        >
          {/* Card Sub-heading */}
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-[16px] font-black text-[#191C1E] tracking-tight">
              Passenger Login
            </h2>
            <span className="text-[10px] font-black text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Quick Login
            </span>
          </div>

          {/* ── Input 1: Mobile Number ── */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              MOBILE NUMBER
            </label>
            <div className="flex items-center bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-1.5 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
              {/* PH Country Capsule */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 py-1.5 px-2.5 rounded-xl shadow-2xs">
                <span className="text-[15px] leading-none" role="img" aria-label="Philippines">
                  🇵🇭
                </span>
                <span className="text-[13px] font-black text-[#191C1E]">+63</span>
              </div>

              {/* Phone Input */}
              <input
                type="tel"
                inputMode="numeric"
                required
                value={phone}
                onChange={handlePhoneChange}
                placeholder="912 345 6789"
                maxLength={12}
                className="w-full bg-transparent font-extrabold text-[15px] text-[#191C1E] placeholder:text-slate-400 outline-none px-3 py-1"
              />
            </div>
          </div>

          {/* ── Input 2: Password or OTP Mode ── */}
          {authMode === "password" ? (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                PASSWORD
              </label>
              <div className="flex items-center bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-1.5 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                <span className="material-symbols-outlined text-[19px] text-slate-400 pl-1">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent font-bold text-[14px] text-[#191C1E] placeholder:text-slate-400 outline-none px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition pr-1 cursor-pointer"
                  aria-label="Toggle Password Visibility"
                >
                  <span className="material-symbols-outlined text-[19px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>

              {/* Small option below password input */}
              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("otp");
                    handleSendOtp();
                  }}
                  className="text-[12px] font-bold text-[#A53700] hover:text-[#F95700] transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">sms</span>
                  <span>Receive an OTP as an alternative</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    showToast("Password reset instructions sent to your registered phone.")
                  }
                  className="text-[11px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                  6-DIGIT OTP CODE
                </label>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-[11px] font-bold text-[#F95700] hover:underline cursor-pointer"
                >
                  Resend Code
                </button>
              </div>
              <div className="flex items-center bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-1.5 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                <span className="material-symbols-outlined text-[19px] text-slate-400 pl-1">
                  pin
                </span>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit SMS OTP"
                  className="w-full bg-transparent font-black tracking-widest text-[16px] text-[#191C1E] placeholder:text-slate-400 outline-none px-3 py-1.5"
                />
              </div>

              {/* Switch back to Password */}
              <div className="pt-1 px-1">
                <button
                  type="button"
                  onClick={() => setAuthMode("password")}
                  className="text-[12px] font-bold text-[#A53700] hover:text-[#F95700] transition flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">key</span>
                  <span>Use password instead</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Primary Action CTA Button (Copied Aesthetic from Track Live Buses button) ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[16px] tracking-tight shadow-[0_8px_24px_rgba(249,87,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-75 disabled:cursor-wait"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </span>
            ) : (
              <span>Log In</span>
            )}
          </button>

          {/* ── "No account? Sign up" Link ── */}
          <p className="text-center text-[13px] text-slate-600 font-medium pt-1">
            No account?{" "}
            <a
              href="#signup"
              onClick={(e) => {
                e.preventDefault();
                showToast("Sign up page is coming soon!");
              }}
              className="font-extrabold text-[#F95700] hover:underline cursor-pointer"
            >
              Sign up
            </a>
          </p>
        </form>

        {/* ── Value Props: Clean Minimalist Inline Row (NOT IN A CARD) ── */}
        <div className="flex items-center justify-around py-3 px-2 text-center select-none">
          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[#F95700] text-[22px]">
              share_location
            </span>
            <span className="text-[12px] font-bold text-[#191C1E] mt-0.5">Live GPS</span>
            <span className="text-[10px] text-slate-400 font-semibold">Accurate ETA</span>
          </div>

          <span className="h-6 w-[1px] bg-slate-200" />

          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[#F95700] text-[22px]">
              airline_seat_recline_normal
            </span>
            <span className="text-[12px] font-bold text-[#191C1E] mt-0.5">Seat Count</span>
            <span className="text-[10px] text-slate-400 font-semibold">Real-Time</span>
          </div>

          <span className="h-6 w-[1px] bg-slate-200" />

          <div className="flex flex-col items-center">
            <span className="material-symbols-outlined text-[#F95700] text-[22px]">
              contactless
            </span>
            <span className="text-[12px] font-bold text-[#191C1E] mt-0.5">Cashless</span>
            <span className="text-[10px] text-slate-400 font-semibold">Instant Tap</span>
          </div>
        </div>

        {/* ── Trust & Certification Footer ── */}
        <div className="text-center space-y-1 pt-1 text-slate-400 text-[11px]">
          <div className="flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
            <span className="material-symbols-outlined text-[15px] text-slate-400">
              verified_user
            </span>
            <span>LTFRB Certified Partner • 256-bit Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-400">
            By proceeding, you agree to our{" "}
            <a href="#" onClick={(e) => e.preventDefault()} className="underline text-slate-600 hover:text-[#F95700]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" onClick={(e) => e.preventDefault()} className="underline text-slate-600 hover:text-[#F95700]">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
