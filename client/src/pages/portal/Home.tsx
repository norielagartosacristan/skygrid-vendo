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
    if (remaining === "00:00:00" || (session && new Date(session.expiresAt) <= new Date())) {
      setSession(null);
    }
  }, [remaining, session]);

  return (
    <PortalLayout>
      {/*<Header />*/}

      {/* HERO SECTION - FULL WIDTH */}
      <section className="relative w-full h-[280px] lg:h-[520px] overflow-hidden">
        <HeroCarousel />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6">
            <div className="max-w-2xl text-white">
              <h4 className="text-sky-400 text-xl lg:text-2xl font-semibold mb-2">Welcome to</h4>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">SkyGrid Vendo</h1>
              <p className="mt-6 text-lg lg:text-2xl text-gray-200">High-Speed Internet Access</p>
              <p className="mt-3 text-gray-300">Fast • Secure • Reliable</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="min-h-screen bg-slate-50 py-6 flex flex-col justify-between font-sans">
        <div className="max-w-md mx-auto w-full px-4 flex-grow flex flex-col justify-center gap-6">
          
          {/* TOP HEADER: DYNAMIC WI-FI ICON & CLOCK */}
          <div className="text-center flex flex-col items-center gap-3">
            <div className={`p-4 rounded-full transition-all duration-500 shadow-sm border ${
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
                className="w-12 h-12"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 1 1-1.06 0 .75.75 0 0 1 1.06 0Z" />
              </svg>
            </div>
            
            <span className={`text-xs font-bold uppercase tracking-widest ${
              isConnected ? "text-green-600" : "text-slate-400"
            }`}>
              {isConnected ? "Internet Active" : "No Active Session"}
            </span>

            <Clock />
          </div>

          {/* MAIN CONTROLS (THE HERO CARD) */}
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-100 flex flex-col gap-4">
            <button className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-2xl py-5 text-2xl font-black shadow-lg shadow-sky-200 transition active:scale-[0.98] flex items-center justify-center gap-3">
              <span>🪙</span> INSERT COIN
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">OR ENTER CODE</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-100">
              <VoucherLogin onLoginSuccess={setSession} />
            </div>
          </div>

          {/* STATUS PANEL (GRID OVERVIEW) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-5 shadow-lg text-white flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Remaining Time</p>
                <h2 className="text-3xl font-black mt-1 text-sky-400 tracking-tight">
                  {remaining || "00:00:00"}
                </h2>
              </div>
              <div className="bg-slate-700/50 p-3 rounded-2xl">
                <span>⏳</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
              <p className="text-xs text-slate-400 font-medium">Status</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}></span>
                <h3 className="text-lg font-bold text-slate-700">
                  {isConnected ? "Connected" : "Disconnected"}
                </h3>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col justify-between">
              <p className="text-xs text-slate-400 font-medium">Credit</p>
              <h3 className="text-xl font-black text-green-600 mt-1">
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