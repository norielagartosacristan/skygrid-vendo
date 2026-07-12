import { useEffect, useState } from "react";

import PortalLayout from "../../layouts/PortalLayout";
import Footer from "../../components/portal/Footer";
import HeroCarousel from "../../components/portal/HeroCarousel";
import VoucherLogin from "../../components/portal/VoucherLogin";
import { useCountdown } from "../../hooks/useCountdown";
import InsertCoinModal from "../../components/portal/InsertCoinModal";




export default function Home() {

const popupSound = new Audio("/sounds/popup.mp3");
const coinSound = new Audio("/sounds/coin.mp3");

const playPopup = () => {
    popupSound.currentTime = 0;
    popupSound.play().catch(() => {});
};

const playCoin = () => {
    coinSound.currentTime = 0;
    coinSound.play().catch(() => {});
};

  const [showCoinModal, setShowCoinModal] = useState(false);

    const [client, setClient] = useState({
        ip: "",
        mac: ""
    });

    const [session, setSession] = useState<any>(() => {

        const saved = localStorage.getItem("skygrid_session");

        return saved
            ? JSON.parse(saved)
            : null;

    });

    const isConnected = !!session;

    const remaining =
        useCountdown(session?.expiresAt);

    /**
     * Restore active session
     */
    async function restoreSession(ip: string) {

        try {

            console.log("Checking active session...");

            const res =
                await fetch(`/api/captive/session?ip=${ip}`);

            const data =
                await res.json();

            console.log("RESTORE RESULT:", data);

            if (!data) {

                localStorage.removeItem(
                    "skygrid_session"
                );

                setSession(null);

                return;

            }

            localStorage.setItem(
                "skygrid_session",
                JSON.stringify(data)
            );

setSession(data);
setSession(data);

        } catch (err) {

            console.error(err);

        }

    }

    /**
     * Get current client
     */
    useEffect(() => {

        fetch("/api/captive/client")
            .then(res => res.json())
            .then(data => {

                console.log("CLIENT:", data);

                setClient({

                    ip: data.ip,
                    mac: data.mac

                });

            });

    }, []);

    /**
     * Restore session when IP becomes available
     */
    useEffect(() => {

        if (!client.ip)
            return;

        restoreSession(client.ip);

    }, [client.ip]);

    /**
     * Recheck session when browser comes back
     */
    useEffect(() => {

        if (!client.ip)
            return;

        const reconnect = () => {

            console.log("Rechecking session...");

            restoreSession(client.ip);

        };

        const handleVisibility = () => {

            if (!document.hidden) {

                reconnect();

            }

        };

        window.addEventListener(
            "focus",
            reconnect
        );

        window.addEventListener(
            "online",
            reconnect
        );

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        );

        return () => {

            window.removeEventListener(
                "focus",
                reconnect
            );

            window.removeEventListener(
                "online",
                reconnect
            );

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            );

        };

    }, [client.ip]);

    /**
     * WebSocket realtime updates
     */
    useEffect(() => {

        if (!client.ip)
            return;

        const protocol =
            window.location.protocol === "https:"
                ? "wss"
                : "ws";

        const socket =
            new WebSocket(
                `${protocol}://${window.location.host}/ws/session?ip=${client.ip}`
            );

        socket.onopen = () => {

            console.log("✅ Session WebSocket Connected");

        };

        socket.onmessage = (event) => {

            const data =
                JSON.parse(event.data);

            console.log("WS:", data);

            switch (data.type) {

                case "session.created":

                case "session.updated":

                    localStorage.setItem(
                        "skygrid_session",
                        JSON.stringify(data.payload)
                    );

                    setSession(data.payload);

                    break;

                case "session.expired":

                    console.log("SESSION EXPIRED");

                    localStorage.removeItem(
                        "skygrid_session"
                    );

                    setSession(null);

                    break;

            }

        };

        socket.onerror = (err) => {

            console.error(err);

        };

        socket.onclose = () => {

            console.log("❌ Session WebSocket Closed");

        };

        return () => {

            socket.close();

        };

    }, [client.ip]);


  return (
    <PortalLayout>
      {/* HERO SECTION - REDUCED HEIGHT FOR MOBILE */}
      <section className="relative w-full h-[350px] sm:h-[180px] lg:h-[400px] overflow-hidden">
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
           
          </div>

               {/* STATUS PANEL (GRID OVERVIEW - FIX NESTING & ALIGNMENT) */}
          <div className="grid grid-cols-2 gap-3">
            
           
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

          {/* MAIN CONTROLS (COMPACT CARD & BUTTONS) */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col gap-3">
              {/* REMAINING TIME CARD */}
             <div className="col-span-2 p-4 text-blue flex justify-between items-center">
              <div>
                <p className="uppercase tracking-wider text-sky-300 text-[10px] font-bold">
                  Remaining Time
                </p>
                <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">
                  {remaining || "00:00:00"}
                </h1>
              </div>
            </div>
           <button
                onClick={() => {
                    playPopup();
                    playCoin();
                    setShowCoinModal(true);
                }}
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-base font-bold text-white shadow-md active:scale-95 transition"
            >
                🪙 Insert Coin
            </button>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
              <p className="text-center text-[10px] font-bold tracking-wider text-slate-400 mb-2">
                OR LOGIN USING VOUCHER
              </p>
              <VoucherLogin onLoginSuccess={setSession} />
            </div>
          </div>
        </div>
      </section>
      <Footer />
       <InsertCoinModal
    open={showCoinModal}
    onClose={() => setShowCoinModal(false)}
/>
    </PortalLayout>
  );
}