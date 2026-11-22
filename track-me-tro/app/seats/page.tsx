"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

function SeatsRedirectContent() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/booking");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-slate-500">Redirecting to booking...</p>
      </div>
    </div>
  );
}

export default function SeatsPage() {
  return (
    <Suspense fallback={null}>
      <SeatsRedirectContent />
    </Suspense>
  );
}
