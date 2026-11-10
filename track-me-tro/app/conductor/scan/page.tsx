export default function ConductorScanPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-indigo-400">Scan Passenger Ticket</h1>
          <p className="text-xs text-slate-400">Validate QR codes for reserved seats</p>
        </div>
        <a href="/conductor" className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-700">
          Back
        </a>
      </header>
      <div className="p-4 max-w-md mx-auto space-y-4">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center space-y-4">
          <div className="w-48 h-48 mx-auto border-2 border-dashed border-indigo-400 rounded-2xl flex flex-col items-center justify-center bg-slate-900/50">
            <span className="text-3xl mb-1">📷</span>
            <p className="text-xs text-slate-400">Camera Viewfinder Placeholder</p>
          </div>
          <p className="text-xs text-slate-300">Point at passenger&apos;s digital ticket QR code</p>
        </div>
      </div>
    </main>
  );
}

