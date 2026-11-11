"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useAppContext } from "@/lib/AppContext";

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

export default function SignUpPage() {
  const router = useRouter();
  const { setPassengerName } = useAppContext();

  // Step 1: Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [suffix, setSuffix] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step state: "form" or "otp"
  const [step, setStep] = useState<"form" | "otp">("form");

  // Step 2: OTP State
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [smsNotification, setSmsNotification] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setContactNumber(formatPhoneNumber(e.target.value));
  }, []);

  // Handle Form Submission -> Transitions to OTP
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      showToast("Please enter your First and Last name.");
      return;
    }

    if (!contactNumber.trim() || contactNumber.replace(/\D/g, "").length < 10) {
      showToast("Please enter a valid 10-digit contact number.");
      return;
    }

    if (!password.trim()) {
      showToast("Please create a password.");
      return;
    }

    // Process Middle Initial & Suffix (defaults to "N/A" if empty)
    const finalMiddleInitial = middleInitial.trim() ? middleInitial.trim().toUpperCase() : "N/A";
    const finalSuffix = suffix.trim() ? suffix.trim() : "N/A";

    // Format full passenger name for AppContext
    const miFormatted = finalMiddleInitial !== "N/A" ? `${finalMiddleInitial}. ` : "";
    const suffixFormatted = finalSuffix !== "N/A" ? ` ${finalSuffix}` : "";
    const compiledName = `${firstName.trim()} ${miFormatted}${lastName.trim()}${suffixFormatted}`.trim();

    // Update global app state with user's registered name
    setPassengerName(compiledName);

    // Transition to OTP step
    setStep("otp");

    // Automatically simulate SMS notification with code "1234"
    setTimeout(() => {
      setSmsNotification("1234");
    }, 600);
  };

  // Auto-focus first input on OTP screen
  useEffect(() => {
    if (step === "otp") {
      otpInputRefs.current[0]?.focus();
    }
  }, [step]);

  // Handle single digit OTP change
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto move to next input if entered a digit
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation between OTP boxes
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill convenience button for presentation demo
  const handleAutoFillOtp = () => {
    setOtp(["1", "2", "3", "4"]);
    showToast("Code 1234 auto-filled!");
  };

  // Verify OTP & Proceed to Home
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otp.join("");

    if (enteredCode !== "1234" && enteredCode.length < 4) {
      showToast("Please enter the 4-digit code (use 1234).");
      return;
    }

    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      showToast(`Account verified! Welcome to track MEtro.`);
      setTimeout(() => {
        router.push("/home");
      }, 700);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans select-none pb-12">
      {/* ── Simulated SMS Push Notification Banner (Demo Feature) ── */}
      {smsNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-[400px] bg-[#181C24]/95 text-white backdrop-blur-md p-3.5 rounded-2xl shadow-2xl border border-white/20 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F95700] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">sms</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#F95700]">
                  MESSAGES • NOW
                </span>
                <button
                  type="button"
                  onClick={() => setSmsNotification(null)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-[13px] font-bold text-white mt-0.5 leading-snug">
                Your track MEtro verification code is{" "}
                <span className="text-[#F95700] font-black underline tracking-widest text-[14px]">
                  1234
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Regular Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Warm Peach Hero Section Matching Reference Aesthetic ── */}
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
          {/* Header Row: Back / Logo */}
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <Logo className="h-10 w-auto" />
            </Link>

            <Link
              href="/"
              className="text-[12px] font-extrabold text-[#A53700] hover:text-[#F95700] bg-white/40 px-3 py-1 rounded-full transition"
            >
              Log In
            </Link>
          </div>

          {/* Hero Headline */}
          <div className="mt-6 space-y-1">
            <h1 className="text-[32px] font-black tracking-tight text-[#191C1E] leading-[1.12]">
              {step === "form" ? (
                <>
                  Create Your<br />Account
                </>
              ) : (
                <>
                  Verify Your<br />Number
                </>
              )}
            </h1>
            <p className="text-[11px] font-black text-[#A53700] uppercase tracking-wider pt-0.5">
              Eastern Visayas • Live Transit Network
            </p>
          </div>
        </div>
      </section>

      {/* ── Elevated Form Card (Overlapping Hero) ── */}
      <div className="max-w-[420px] w-full mx-auto px-4 -mt-8 relative z-20 space-y-5">
        {step === "form" ? (
          /* ════════ STEP 1: Registration Form ════════ */
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ECEEF0] space-y-4"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-[16px] font-black text-[#191C1E] tracking-tight">
                Passenger Registration
              </h2>
              <span className="text-[10px] font-black text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Step 1 of 2
              </span>
            </div>

            {/* Row 1: First Name & Last Name */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  FIRST NAME *
                </label>
                <div className="bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-2 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Juana"
                    className="w-full bg-transparent font-bold text-[14px] text-[#191C1E] placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  LAST NAME *
                </label>
                <div className="bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-2 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. de la Cruz"
                    className="w-full bg-transparent font-bold text-[14px] text-[#191C1E] placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Middle Initial & Suffix (Optional • defaults to N/A) */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    MIDDLE INITIAL
                  </label>
                  <span className="text-[9px] text-slate-400 font-semibold">(Opt.)</span>
                </div>
                <div className="bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-2 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                  <input
                    type="text"
                    maxLength={2}
                    value={middleInitial}
                    onChange={(e) => setMiddleInitial(e.target.value)}
                    placeholder="M. or blank (N/A)"
                    className="w-full bg-transparent font-bold text-[13px] text-[#191C1E] placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    SUFFIX
                  </label>
                  <span className="text-[9px] text-slate-400 font-semibold">(Opt.)</span>
                </div>
                <div className="bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-2 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                  <input
                    type="text"
                    maxLength={6}
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Jr./III/blank (N/A)"
                    className="w-full bg-transparent font-bold text-[13px] text-[#191C1E] placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: Contact Number */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                CONTACT NUMBER *
              </label>
              <div className="flex items-center bg-[#F7F9FB] border border-[#E0E3E5] rounded-2xl p-1.5 px-3 focus-within:border-[#F95700] focus-within:ring-2 focus-within:ring-[#F95700]/20 transition-all">
                {/* PH Country Capsule */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 py-1.5 px-2.5 rounded-xl shadow-2xs">
                  <span className="text-[15px] leading-none" role="img" aria-label="Philippines">
                    🇵🇭
                  </span>
                  <span className="text-[13px] font-black text-[#191C1E]">+63</span>
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  value={contactNumber}
                  onChange={handlePhoneChange}
                  placeholder="912 345 6789"
                  maxLength={12}
                  className="w-full bg-transparent font-extrabold text-[15px] text-[#191C1E] placeholder:text-slate-400 outline-none px-3 py-1"
                />
              </div>
            </div>

            {/* Field 4: Password */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider">
                PASSWORD *
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
                  placeholder="Create a strong password"
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
              <p className="text-[10px] text-slate-400 px-1 pt-0.5">
                Note: Middle initial and suffix default to N/A if left blank.
              </p>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[16px] tracking-tight shadow-[0_8px_24px_rgba(249,87,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>Continue to Verification</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            {/* Bottom link: Already have an account? Log in */}
            <p className="text-center text-[13px] text-slate-600 font-medium pt-1">
              Already have an account?{" "}
              <Link href="/" className="font-extrabold text-[#F95700] hover:underline cursor-pointer">
                Log in
              </Link>
            </p>
          </form>
        ) : (
          /* ════════ STEP 2: OTP Verification ════════ */
          <form
            onSubmit={handleVerifyOtp}
            className="bg-white rounded-[32px] p-6 shadow-[0_12px_36px_rgba(0,0,0,0.06)] border border-[#ECEEF0] space-y-5 animate-fade-in"
          >
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-[16px] font-black text-[#191C1E] tracking-tight">
                Phone Verification
              </h2>
              <span className="text-[10px] font-black text-[#A53700] bg-[#FFE8D6] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Step 2 of 2
              </span>
            </div>

            {/* Info Notice */}
            <div className="text-center space-y-1.5 py-1">
              <div className="w-12 h-12 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center mx-auto shadow-2xs">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
              </div>
              <h3 className="text-[16px] font-extrabold text-[#191C1E]">
                Enter 4-Digit OTP Code
              </h3>
              <p className="text-[12px] text-slate-500 leading-relaxed px-2">
                We sent a text message to{" "}
                <span className="font-bold text-[#191C1E]">+63 {contactNumber}</span> with your passcode.
              </p>
            </div>

            {/* 4 Digit OTP Boxes */}
            <div className="flex items-center justify-center gap-3 py-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-14 h-16 text-center text-[24px] font-black text-[#191C1E] bg-[#F7F9FB] border-2 border-[#E0E3E5] rounded-2xl focus:border-[#F95700] focus:ring-4 focus:ring-[#F95700]/15 outline-none transition-all shadow-2xs"
                />
              ))}
            </div>

            {/* Pitch Demo Presentation Helper Pill */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleAutoFillOtp}
                className="bg-[#FFE8D6] text-[#A53700] hover:bg-[#FFDBCA] text-[11px] font-black px-3.5 py-1.5 rounded-full transition flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Auto-fill OTP (1234)</span>
              </button>
            </div>

            {/* Action Button: Verify & Proceed */}
            <button
              type="submit"
              disabled={verifying}
              className="w-full py-4 px-6 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-black text-[16px] tracking-tight shadow-[0_8px_24px_rgba(249,87,0,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {verifying ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Account...</span>
                </span>
              ) : (
                <span>Verify &amp; Proceed to Home</span>
              )}
            </button>

            {/* Resend Code / Edit Info */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                ← Edit details
              </button>

              <button
                type="button"
                onClick={() => {
                  setSmsNotification("1234");
                  showToast("New OTP code 1234 sent via SMS.");
                }}
                className="text-[#A53700] hover:text-[#F95700] font-bold cursor-pointer"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {/* ── Trust & Certification Footer ── */}
        <div className="text-center space-y-1 pt-1 text-slate-400 text-[11px]">
          <div className="flex items-center justify-center gap-1.5 font-bold uppercase tracking-wider text-slate-500">
            <span className="material-symbols-outlined text-[15px] text-slate-400">
              verified_user
            </span>
            <span>LTFRB Certified Partner • 256-bit Encrypted</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Protected by regional transport compliance standards.
          </p>
        </div>
      </div>
    </main>
  );
}
