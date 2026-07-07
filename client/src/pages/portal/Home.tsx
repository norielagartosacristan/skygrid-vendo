import PortalLayout from "../../layouts/PortalLayout";
import Footer from "../../components/portal/Footer";
import Clock from "../../components/portal/Clock";
import HeroCarousel from "../../components/portal/HeroCarousel";
import VoucherLogin from "../../components/portal/VoucherLogin";
import { useState, useEffect } from "react";
import { useCountdown } from "../../hooks/useCountdown";

export default function Home() {
  // 1. Kuhanin ang initial state mula sa localStorage kung meron man
  const [session, setSession] = useState<any>(() => {
    const savedSession = localStorage.getItem("skygrid_session");
    return savedSession ? JSON.parse(savedSession) : null;
  });

  const remaining = useCountdown(session?.expiresAt);
  const isConnected = !!session;

  // 2. I-save sa localStorage tuwing magbabago ang session state
  useEffect(() => {
    if (session) {
      localStorage.setItem("skygrid_session", JSON.stringify(session));
    } else {
      localStorage.removeItem("skygrid_session");
    }
  }, [session]);

  // 3. Opsyonal: Kung tapos na ang oras (remaining time), kusang i-clear ang session
useEffect(() => {
  const handleDisconnect = async () => {
    if (session) {
      const isExpired = new Date(session.expiresAt) <= new Date();
      
      if (remaining === "00:00:00" || isExpired) {
        try {
          // 1. Tawagin ang backend para sipain ang user sa router
          const response = await fetch('/api/voucher/disconnect', { // Palitan ang URL kung iba ang daan sa backend mo
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // Kung may Authorization Header ang API mo, ilagay dito:
              // 'Authorization': `Bearer ${session.token}` 
            },
            body: JSON.stringify({ 
              token: session.token, // O kung anong field ang gamit niyo (e.g., voucher: session.code)
            }),
          });

          if (!response.ok) {
            console.error("Failed to disconnect from router backend");
          }
        } catch (error) {
          console.error("Network error while disconnecting:", error);
        } finally {
          // 2. Kahit mag-error o mag-success ang API, burahin pa rin ang session sa screen
          setSession(null);
        }
      }
    }
  };

  handleDisconnect();
}, [remaining, session]);

  return (
    <PortalLayout>
      {/* HERO SECTION - REDUCED HEIGHT FOR MOBILE */}
      <section className="relative w-full h-[350px] sm:h-[220px] lg:h-[400px] overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
            <div className="max-w-2xl text-white">
              <h4 className="text-sky-400 text-sm sm:text-base lg:text-xl font-semibold">Welcome to</h4>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">BayanNet Wifi Vendo</h1>
              <p className="text-xs sm:text-sm lg:text-xl text-gray-200 mt-1">High-Speed Internet Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT - COMPACT SPACING */}
      <section className="bg-slate-50 py-2 px-3 flex flex-col justify-between font-sans min-h-[calc(100vh-160px)]">
        <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-start gap-4">
          
          {/* TOP HEADER: DYNAMIC WI-FI ICON & CLOCK (SHRUNK) */}
          <div className="text-center flex flex-col items-center gap-1.5 mt-1">
            <div className={`p-2.5 rounded-full transition-all duration-500 shadow-sm border ${
              isConnected 
                ? "bg-green-50 border-green-200 text-green-500 animate-pulse" 
                : "bg-slate-100 border-slate-200 text-slate-400"
            }`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2.5} 
                stroke="currentColor" 
                className="w-7 h-7 sm:w-9 sm:h-9"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 1 1-1.06 0 .75.75 0 0 1 1.06 0Z" />
              </svg>
            </div>
            
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isConnected ? "text-green-600" : "text-slate-400"
            }`}>
              {isConnected ? "Internet Active" : "No Active Session"}
            </span>

            <Clock />
          </div>

          {/* MAIN CONTROLS (COMPACT CARD & BUTTONS) */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col gap-3">
            <button className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-base font-bold text-white shadow-md active:scale-98 transition">
              🪙 Insert Coin
            </button>

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
              <p className="text-center text-[10px] font-bold tracking-wider text-slate-400 mb-2">
                OR LOGIN USING VOUCHER
              </p>
              <VoucherLogin onLoginSuccess={setSession} />
            </div>
          </div>

          {/* STATUS PANEL (GRID OVERVIEW - FIX NESTING & ALIGNMENT) */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* REMAINING TIME CARD */}
            <div className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-md text-white flex justify-between items-center">
              <div>
                <p className="uppercase tracking-wider text-sky-300 text-[10px] font-bold">
                  Remaining Time
                </p>
                <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                  {remaining || "00:00:00"}
                </h1>
              </div>
              <div className="bg-slate-700/50 p-2.5 rounded-xl text-lg">
                ⏳
              </div>
            </div>

            {/* STATUS CARD */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Status</p>
                <h2 className="font-bold text-sm text-slate-800 mt-0.5">
                  {isConnected ? "Connected" : "Disconnected"}
                </h2>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-slate-300"
              }`} />
            </div>

            {/* CREDIT CARD */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-center">
              <p className="text-xs text-slate-400 font-medium">Credit</p>
              <h3 className="text-sm sm:text-base font-bold text-green-600 mt-0.5">
                {isConnected ? "₱0.00 (Active)" : "₱0.00"}
              </h3>
            </div>

          </div>
        </div>
      </section>
      <Footer />
    </PortalLayout>
  );
}