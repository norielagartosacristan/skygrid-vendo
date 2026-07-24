import { useEffect, useRef, useState } from "react";

import PortalLayout from "../../layouts/PortalLayout";
import Footer from "../../components/portal/Footer";
import HeroCarousel from "../../components/portal/HeroCarousel";
import VoucherLogin from "../../components/portal/VoucherLogin";
import InsertCoinModal from "../../components/portal/InsertCoinModal";

import { useSound } from "../../hooks/useSound";

interface ClientInfo {
  ip: string;
  mac: string;
}

interface SessionInfo {
  success?: boolean;
  isActive?: boolean;
  internet?: boolean;
  remainingSeconds?: number;
  remainingTime?: string;
  expiresAt?: string;
  sessionId?: string;
  id?: string;
  [key: string]: any;
}

export default function Home() {

  const popup = useSound("/sounds/popup.mp3");
  const startup = useSound("/sounds/startup.mp3");
  const insertCoin = useSound("/sounds/insertcoin.mp3");
  const warning5 = useSound("/sounds/warning5.mp3");
  const warning1 = useSound("/sounds/warning1.mp3");
  const ambience = useSound("/sounds/ambience.mp3");

  const [showCoinModal, setShowCoinModal] =
    useState(false);

  const [client, setClient] =
    useState<ClientInfo>({
      ip: "",
      mac: "",
    });

  const [session, setSession] =
    useState<SessionInfo | null>(() => {

      try {

        const saved =
          localStorage.getItem(
            "skygrid_session"
          );

        return saved
          ? JSON.parse(saved)
          : null;

      } catch {

        return null;

      }

    });

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const [remainingTime, setRemainingTime] =
    useState("00:00:00");

  const [checkingSession, setCheckingSession] =
    useState(false);

  const [played5, setPlayed5] =
    useState(false);

  const [played1, setPlayed1] =
    useState(false);

  const pollingRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const coinPollingRef =
    useRef<ReturnType<typeof setInterval> | null>(null);


  /**
   * Format seconds
   */
  function formatTime(totalSeconds: number) {

    if (totalSeconds <= 0) {
      return "00:00:00";
    }

    const hours =
      Math.floor(
        totalSeconds / 3600
      );

    const minutes =
      Math.floor(
        (totalSeconds % 3600) / 60
      );

    const seconds =
      totalSeconds % 60;

    return [
      hours,
      minutes,
      seconds,
    ]
      .map(
        value =>
          String(value).padStart(2, "0")
      )
      .join(":");

  }


  /**
   * Apply session returned by server
   */
  function applySession(
    data: SessionInfo | null
  ) {

    /**
     * No active session
     */
    if (
      !data ||
      data.isActive === false ||
      data.internet === false ||
      !data.expiresAt
    ) {

      setSession(null);

      setRemainingSeconds(0);

      setRemainingTime(
        "00:00:00"
      );

      localStorage.removeItem(
        "skygrid_session"
      );

      return;

    }


    /**
     * Save session
     */
    setSession(data);

    localStorage.setItem(
      "skygrid_session",
      JSON.stringify(data)
    );


    /**
     * Use server remainingSeconds
     * when available
     */
    if (
      typeof data.remainingSeconds ===
      "number"
    ) {

      setRemainingSeconds(
        data.remainingSeconds
      );

      setRemainingTime(
        formatTime(
          data.remainingSeconds
        )
      );

      return;

    }


    /**
     * Fallback:
     * calculate using expiresAt
     */
    const diff =
      Math.max(
        0,
        Math.floor(
          (
            new Date(
              data.expiresAt
            ).getTime() -
            Date.now()
          ) / 1000
        )
      );

    setRemainingSeconds(diff);

    setRemainingTime(
      formatTime(diff)
    );

  }


  /**
   * Get session from server
   */
  async function refreshSession(
    ip: string,
    silent = true
  ) {

    if (!ip) {
      return null;
    }

    try {

      if (!silent) {
        setCheckingSession(true);
      }

      const res =
        await fetch(
          `/api/captive/session?ip=${encodeURIComponent(ip)}`,
          {
            cache: "no-store",
          }
        );

      if (!res.ok) {

        throw new Error(
          `Session request failed: ${res.status}`
        );

      }

      const data =
        await res.json();


      console.log(
        "SESSION STATUS:",
        data
      );


      /**
       * API returns success false
       */
      if (
        data?.success === false
      ) {

        applySession(null);

        return null;

      }


      /**
       * API returned active session
       */
      if (
        data?.isActive &&
        data?.expiresAt
      ) {

        applySession(data);

        return data;

      }


      /**
       * No active session
       */
      applySession(null);

      return null;

    } catch (err) {

      console.error(
        "SESSION CHECK ERROR:",
        err
      );

      return null;

    } finally {

      if (!silent) {
        setCheckingSession(false);
      }

    }

  }


  /**
   * Get current client IP/MAC
   */
  async function loadClient() {

    try {

      const res =
        await fetch(
          "/api/captive/client",
          {
            cache: "no-store",
          }
        );

      if (!res.ok) {
        throw new Error(
          "Unable to detect client."
        );
      }

      const data =
        await res.json();


      console.log(
        "CLIENT:",
        data
      );


      const newClient = {
        ip: data.ip || "",
        mac: data.mac || "",
      };


      setClient(
        newClient
      );


      return newClient;

    } catch (err) {

      console.error(
        "CLIENT DETECTION ERROR:",
        err
      );

      return null;

    }

  }


  /**
   * Initial startup
   */
  useEffect(() => {

    startup.play();

    ambience.play();

    loadClient();

  }, []);


  /**
   * Restore session once client IP is known
   */
  useEffect(() => {

    if (!client.ip) {
      return;
    }

    refreshSession(
      client.ip,
      false
    );

  }, [client.ip]);


  /**
   * Regular HTTP session polling
   *
   * This replaces the need for
   * WebSocket session updates.
   */
  useEffect(() => {

    if (!client.ip) {
      return;
    }


    /**
     * Check immediately
     */
    refreshSession(
      client.ip
    );


    /**
     * Check every 2 seconds
     */
    pollingRef.current =
      setInterval(() => {

        refreshSession(
          client.ip
        );

      }, 2000);


    return () => {

      if (
        pollingRef.current
      ) {

        clearInterval(
          pollingRef.current
        );

        pollingRef.current =
          null;

      }

    };

  }, [client.ip]);


  /**
   * Local countdown
   *
   * Server remains source of truth.
   * This only makes the display smooth.
   */
  useEffect(() => {

    if (!session?.expiresAt) {

      setRemainingSeconds(0);

      setRemainingTime(
        "00:00:00"
      );

      return;

    }


    const updateCountdown =
      () => {

        const diff = session.expiresAt
  ? Math.max(
      0,
      Math.floor(
        (
          new Date(session.expiresAt).getTime() -
          Date.now()
        ) / 1000
      )
    )
  : 0;

        setRemainingSeconds(
          diff
        );

        setRemainingTime(
          formatTime(diff)
        );


        /**
         * Session expired locally.
         * Immediately ask server again.
         */
        if (diff <= 0) {

          refreshSession(
            client.ip
          );

        }

      };


    updateCountdown();


    const timer =
      setInterval(
        updateCountdown,
        1000
      );


    return () => {

      clearInterval(
        timer
      );

    };

  }, [
    session?.expiresAt,
    client.ip,
  ]);


  /**
   * Warning sounds
   */
  useEffect(() => {

    if (
      remainingSeconds <= 0
    ) {

      return;

    }


    const minutes =
      Math.floor(
        remainingSeconds / 60
      );


    if (
      minutes <= 5 &&
      minutes > 1 &&
      !played5
    ) {

      warning5.play();

      setPlayed5(true);

    }


    if (
      minutes <= 1 &&
      !played1
    ) {

      warning1.play();

      setPlayed1(true);

    }

  }, [
    remainingSeconds,
    played5,
    played1,
  ]);


  /**
   * Reset warning sounds
   * when a new session starts
   */
  useEffect(() => {

    setPlayed5(false);

    setPlayed1(false);

  }, [
    session?.sessionId,
    session?.id,
    session?.expiresAt,
  ]);


  /**
   * Browser reconnect / focus
   */
  useEffect(() => {

    if (!client.ip) {
      return;
    }


    const reconnect =
      () => {

        console.log(
          "Rechecking session..."
        );

        refreshSession(
          client.ip
        );

      };


    const handleVisibility =
      () => {

        if (
          !document.hidden
        ) {

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
   * Stop coin polling
   */
  function stopCoinPolling() {

    if (
      coinPollingRef.current
    ) {

      clearInterval(
        coinPollingRef.current
      );

      coinPollingRef.current =
        null;

    }

  }


  /**
   * Start checking for newly-created
   * session after coin insertion.
   */
  function startCoinPolling() {

    stopCoinPolling();


    let attempts = 0;

    const maxAttempts = 60;


    coinPollingRef.current =
      setInterval(
        async () => {

          attempts++;


          console.log(
            `Checking coin session... ${attempts}/${maxAttempts}`
          );


          const result =
            await refreshSession(
              client.ip
            );


          /**
           * Session created
           */
          if (
            result?.isActive
          ) {

            console.log(
              "✅ COIN SESSION DETECTED"
            );


            stopCoinPolling();


            setShowCoinModal(
              false
            );


            popup.play();

            return;

          }


          /**
           * Timeout after 60 seconds
           */
          if (
            attempts >= maxAttempts
          ) {

            console.log(
              "Coin session polling timeout."
            );


            stopCoinPolling();

          }

        },
        1000
      );

  }


  /**
   * Insert Coin
   */
  async function handleInsertCoin() {

    console.log(
      "CLIENT =",
      client
    );


    if (!client.ip) {

      alert(
        "Unable to detect your device IP."
      );

      return;

    }


    if (!client.mac) {

      alert(
        "Unable to detect your device MAC address."
      );

      return;

    }


    try {

      const res =
        await fetch(
          "/api/coin/wait",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              clientIP:
                client.ip,

              clientMac:
                client.mac,

            }),

          }
        );


      const data =
        await res.json();


      console.log(
        "WAIT CLIENT:",
        data
      );


      if (!res.ok || !data.success) {

        alert(
          data.message ||
          "Unable to prepare coin payment."
        );

        return;

      }


      insertCoin.play();


      setShowCoinModal(
        true
      );


      /**
       * Start HTTP polling
       * immediately after waiting
       * for coin.
       */
      startCoinPolling();


    } catch (err) {

      console.error(
        "COIN WAIT ERROR:",
        err
      );


      alert(
        "Unable to prepare coin payment."
      );

    }

  }


  /**
   * Voucher login success
   */
  function handleVoucherSuccess(
    data: any
  ) {

    console.log(
      "VOUCHER SESSION:",
      data
    );


    applySession(
      data
    );

  }


  const isConnected =
    !!session &&
    session.isActive !== false &&
    session.internet !== false &&
    remainingSeconds > 0;


  return (

    <PortalLayout>

      {/* HERO */}

      <section className="relative w-full h-[350px] sm:h-[180px] lg:h-[400px] overflow-hidden">

        <HeroCarousel />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />

        <div className="absolute inset-0 flex items-center">

          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">

            <div className="max-w-2xl text-white">

              <h4 className="text-sky-400 text-sm sm:text-base lg:text-xl font-semibold">

                Welcome to

              </h4>

              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold leading-tight">

                BayanNet Wifi Vendo

              </h1>

              <p className="text-xs sm:text-sm lg:text-xl text-gray-200 mt-1">

                High-Speed Internet Access

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* MAIN */}

      <section className="bg-slate-50 py-2 px-3 flex flex-col justify-between font-sans min-h-[calc(100vh-160px)]">

        <div className="max-w-md mx-auto w-full flex-grow flex flex-col justify-start gap-4">


          {/* STATUS HEADER */}

          <div className="text-center flex flex-col items-center gap-1.5 mt-1">

            <div
              className={`p-2.5 rounded-full transition-all duration-500 shadow-sm border ${
                isConnected
                  ? "bg-green-50 border-green-200 text-green-500 animate-pulse"
                  : "bg-slate-100 border-slate-200 text-slate-400"
              }`}
            >

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-7 h-7 sm:w-9 sm:h-9"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 1 1-1.06 0 .75.75 0 0 1 1.06 0Z"
                />

              </svg>

            </div>


            <span
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isConnected
                  ? "text-green-600"
                  : "text-slate-400"
              }`}
            >

              {isConnected
                ? "Internet Active"
                : "No Active Session"}

            </span>

          </div>


          {/* STATUS PANEL */}

          <div className="grid grid-cols-2 gap-3">


            {/* STATUS */}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3.5 flex items-center justify-between">

              <div>

                <p className="text-xs text-slate-400 font-medium">

                  Status

                </p>

                <h2 className="font-bold text-sm text-slate-800 mt-0.5">

                  {isConnected
                    ? "Connected"
                    : "Disconnected"}

                </h2>

              </div>


              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected
                    ? "bg-green-500 animate-pulse"
                    : "bg-slate-300"
                }`}
              />

            </div>


            {/* CREDIT */}

            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-center">

              <p className="text-xs text-slate-400 font-medium">

                Credit

              </p>

              <h3 className="text-sm sm:text-base font-bold text-green-600 mt-0.5">

                {isConnected
                  ? "₱0.00 (Active)"
                  : "₱0.00"}

              </h3>

            </div>

          </div>


          {/* MAIN CONTROLS */}

          <div className="bg-white rounded-2xl shadow-md p-4 border border-slate-100 flex flex-col gap-3">


            {/* REMAINING TIME */}

            <div className="col-span-2 p-4 text-blue flex justify-between items-center">

              <div>

                <p className="uppercase tracking-wider text-sky-300 text-[10px] font-bold">

                  Remaining Time

                </p>

                <h1 className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">

                  {remainingTime}

                </h1>

              </div>

            </div>


            {/* INSERT COIN */}

            <button
              onClick={handleInsertCoin}
              disabled={
                checkingSession ||
                showCoinModal
              }
              className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-base font-bold text-white shadow-md active:scale-95 transition disabled:opacity-50"
            >

              {showCoinModal
                ? "Waiting for Coin..."
                : "Insert Coin"}

            </button>


            {/* VOUCHER */}

            <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">

              <p className="text-center text-[10px] font-bold tracking-wider text-slate-400 mb-2">

                OR LOGIN USING VOUCHER

              </p>


              <VoucherLogin
                onLoginSuccess={
                  handleVoucherSuccess
                }
              />

            </div>

          </div>

        </div>

      </section>


      <Footer />


      <InsertCoinModal
        open={showCoinModal}
        onClose={() => {

          setShowCoinModal(
            false
          );

          stopCoinPolling();

        }}
        stopPopup={
          popup.stop
        }
      />

    </PortalLayout>

  );

}