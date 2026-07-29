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
  isPaused?: boolean;
  internet?: boolean;
  remainingSeconds?: number;
  remainingTime?: string;
  expiresAt?: string | null;
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
  //const ambience = useSound("/sounds/ambience.mp3");
  const success = useSound("/sounds/success.mp3");

  const [isPaused, setIsPaused] =
    useState(false);

const [pausing, setPausing] =
    useState(false);

  const [waitingStartedAt, setWaitingStartedAt] =
  useState<string | null>(null);
  const [waitingExpiresAt, setWaitingExpiresAt] =
  useState<string | null>(null);

  const [showCoinModal, setShowCoinModal] =
    useState(false);

  const [amountInserted, setAmountInserted] =
  useState(0);

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

  // Walang session talaga
  if (
    !data ||
    data.isActive === false
  ) {

    setSession(null);

    setIsPaused(false);

    setRemainingSeconds(0);

    setRemainingTime(
      "00:00:00"
    );

    localStorage.removeItem(
      "skygrid_session"
    );

    return;
  }


  // May valid session
  setSession(data);

  setIsPaused(
    data.isPaused === true
  );

  localStorage.setItem(
    "skygrid_session",
    JSON.stringify(data)
  );


  // ==============================
  // PAUSED SESSION
  // ==============================

  if (
    data.isPaused === true
  ) {

    const pausedRemaining =
      data.remainingSeconds ?? 0;

    setRemainingSeconds(
      pausedRemaining
    );

    setRemainingTime(
      formatTime(
        pausedRemaining
      )
    );

    return;
  }


  // ==============================
  // ACTIVE SESSION
  // ==============================

  if (
    data.expiresAt
  ) {

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

    setRemainingSeconds(
      diff
    );

    setRemainingTime(
      formatTime(diff)
    );

    return;
  }


  // Invalid session
  setRemainingSeconds(0);

  setRemainingTime(
    "00:00:00"
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
  data?.isActive
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

    //ambience.play();

    loadClient();

  }, []);


  /**
   * Restore session once client IP is known
   */
useEffect(() => {

  if (!client.ip) {
    return;
  }

  if (showCoinModal) {
    console.log(
      "[SESSION POLL] Paused because coin modal is open."
    );

    return;
  }

  console.log(
    "[SESSION POLL] Starting regular session polling."
  );

  refreshSession(
    client.ip
  );

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

}, [
  client.ip,
  showCoinModal
]);

  /**
   * Local countdown
   *
   * Server remains source of truth.
   * This only makes the display smooth.
   */
  useEffect(() => {

  /**
   * No session
   */
  if (!session) {

    setRemainingSeconds(0);

    setRemainingTime(
      "00:00:00"
    );

    return;

  }


  /**
   * PAUSED SESSION
   *
   * Do NOT countdown.
   */
  if (
    session.isPaused === true
  ) {

    const pausedRemaining =
      session.remainingSeconds || 0;

    setRemainingSeconds(
      pausedRemaining
    );

    setRemainingTime(
      formatTime(
        pausedRemaining
      )
    );

    return;

  }


  /**
   * ACTIVE SESSION
   */
  if (
    !session.expiresAt
  ) {

    return;

  }


  const updateCountdown =
    () => {

      const diff =
        Math.max(
          0,
          Math.floor(
            (
              new Date(
                session.expiresAt!
              ).getTime() -
              Date.now()
            ) / 1000
          )
        );


      setRemainingSeconds(
        diff
      );

      setRemainingTime(
        formatTime(diff)
      );


      if (
        diff <= 0
      ) {

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
  session,
  client.ip
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
function startCoinPolling(
  previousExpiresAt?: string
) {

  stopCoinPolling();

  let attempts = 0;

  const maxAttempts = 120;

  const previousExpiry =
    previousExpiresAt
      ? new Date(previousExpiresAt).getTime()
      : 0;

  console.log(
    "========== COIN POLLING START =========="
  );

  console.log(
    "Client IP:",
    client.ip
  );

  console.log(
    "Previous expiresAt:",
    previousExpiresAt
  );

  console.log(
    "Previous expiry timestamp:",
    previousExpiry
  );

  coinPollingRef.current =
    setInterval(
      async () => {

        attempts++;

        console.log(
          `[COIN POLL] ${attempts}/${maxAttempts}`
        );

        try {

          const url =
            `/api/captive/session?ip=${encodeURIComponent(
              client.ip
            )}&_t=${Date.now()}`;

          console.log(
            "[COIN POLL] Request:",
            url
          );

          const res =
            await fetch(
              url,
              {
                method: "GET",
                cache: "no-store",
                headers: {
                  "Cache-Control":
                    "no-cache",
                  "Pragma":
                    "no-cache",
                },
              }
            );

          console.log(
            "[COIN POLL] HTTP:",
            res.status
          );

          if (!res.ok) {

            console.log(
              "[COIN POLL] HTTP ERROR"
            );

            return;

          }

          const result =
            await res.json();

          console.log(
            "[COIN POLL] RESULT:",
            result
          );

          if (
            result?.isActive &&
            result?.expiresAt
          ) {

            const newExpiry =
              new Date(
                result.expiresAt
              ).getTime();

            console.log(
              "[COIN POLL] Previous expiry:",
              previousExpiry
            );

            console.log(
              "[COIN POLL] New expiry:",
              newExpiry
            );

            if (
              newExpiry >
              previousExpiry
            ) {

              console.log(
                "================================"
              );

              console.log(
                "✅ COIN PAYMENT DETECTED"
              );

              console.log(
                "OLD:",
                previousExpiresAt
              );

              console.log(
                "NEW:",
                result.expiresAt
              );

              console.log(
                "================================"
              );

              stopCoinPolling();

              applySession(
                result
              );

              setShowCoinModal(
                false
              );

              success.play();

              return;

            }

          }

          if (
            attempts >=
            maxAttempts
          ) {

            console.log(
              "⏰ COIN POLLING TIMEOUT"
            );

            stopCoinPolling();

            setShowCoinModal(
              false
            );

          }

        } catch (err) {

          console.error(
            "[COIN POLL] ERROR:",
            err
          );

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

    setAmountInserted(0);

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

    if (
  !res.ok ||
  !data.success
) {
  alert(
    data.message ||
    "Unable to prepare coin payment."
  );

  return;
}

setWaitingStartedAt(
  data.createdAt
);

setWaitingExpiresAt(
  data.expiresAt
);

    insertCoin.play();

    setShowCoinModal(true);

// Get current session before waiting for coin
const baselineSession =
  await fetch(
    `/api/captive/session?ip=${encodeURIComponent(
      client.ip
    )}&_t=${Date.now()}`,
    {
      cache: "no-store",
    }
  ).then(
    res => res.json()
  );

console.log(
  "[COIN] BASELINE SESSION:",
  baselineSession
);

startCoinPolling(
  baselineSession?.expiresAt
);

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


  async function handlePause() {

    if (!client.ip) {
        return;
    }

    try {

        setPausing(true);

        const res =
            await fetch(
                "/api/captive/session/pause",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        clientIP:
                            client.ip
                    })
                }
            );


        const data =
            await res.json();


        if (!res.ok ||
            !data.success
        ) {

            alert(
                data.message ||
                "Unable to pause session."
            );

            return;

        }


        setIsPaused(true);


        // Refresh session
        await refreshSession(
            client.ip,
            false
        );


    } catch (err) {

        console.error(
            "PAUSE ERROR:",
            err
        );

        alert(
            "Unable to pause session."
        );

    } finally {

        setPausing(false);

    }

}

async function handleResume() {

  if (!client.ip) {
    alert("Unable to detect client IP.");
    return;
  }

  try {

    console.log(
      "[RESUME] Resuming session for:",
      client.ip
    );

    const res = await fetch(
      "/api/captive/session/resume",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          clientIP: client.ip,
        }),
      }
    );

    const data = await res.json();

    console.log(
      "[RESUME RESPONSE]:",
      data
    );

    if (!res.ok || !data.success) {

      alert(
        data.message ||
        "Unable to resume session."
      );

      return;

    }

    /**
     * Update frontend session
     */
    if (data.session) {

      applySession(
        data.session
      );

    }

    /**
     * Refresh session from server
     * to get the latest expiresAt
     */
    await refreshSession(
      client.ip,
      false
    );

  } catch (error) {

    console.error(
      "[RESUME ERROR]:",
      error
    );

    alert(
      "Unable to resume session."
    );

  }

}


const hasActiveSession =
  !!session &&
  session.isActive !== false &&
  (
    isPaused ||
    remainingSeconds > 0
  );


const isConnected =
  hasActiveSession &&
  !isPaused;

  return (

  <PortalLayout>

    {/* =========================================
        HERO / BANNER
    ========================================= */}

   <section className="relative w-full h-[280px] sm:h-[230px] overflow-hidden">

  <HeroCarousel />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/35 pointer-events-none" />

  {/* Welcome */}
  <div className="absolute inset-0 flex items-start justify-center text-center px-4 pt-1 sm:pt-1 pointer-events-none">

    <div className="text-white">

      <p className="text-sm sm:text-base font-semibold opacity-90">
        Welcome to
      </p>

      <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
        BayanNet Wifi Vendo
      </h1>

      <p className="mt-1 text-xs sm:text-sm opacity-90">
        Fast • Reliable • Affordable Internet
      </p>

    </div>

  </div>

</section>


    {/* =========================================
        MAIN CONTENT
    ========================================= */}

    <main className="bg-slate-100 min-h-[calc(100vh-180px)]">

      <div className="max-w-md mx-auto px-4 py-5">


        {/* =====================================
            CONNECTION STATUS
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">


          {/* WIFI ICON */}

          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isConnected
                ? "bg-green-100 text-green-600"
                : "bg-slate-100 text-slate-400"
            }`}
          >

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-9 h-9"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22a.75.75 0 1 1-1.06 0 .75.75 0 0 1 1.06 0Z"
              />

            </svg>

          </div>


          {/* STATUS */}

         <h2
          className={`mt-1 text-lg sm:text-xl md:text-2xl font-black ${
            isConnected
              ? "text-green-600"
              : "text-slate-400"
          }`}
        >
          {isConnected
            ? "Connected"
            : "Disconnected"}
        </h2>


          {/* IP / MAC */}

          <div className="d-flex mt-2 text-xs sm:text-sm text-slate-500 space-y-1">

            <p>

              <span className="font-semibold">
                IP:
              </span>{" "}

              {client.ip || "Detecting..."}

            </p>


            <p>

              <span className="font-semibold">
                MAC:
              </span>{" "}

              {client.mac || "Detecting..."}

            </p>

          </div>

        </div>


        {/* =====================================
            ACCOUNT INFO
        ===================================== */}

        <div className="grid grid-cols-2 gap-3 mt-4">


          {/* CREDIT */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">

              Account Credits

            </p>


            <p className="mt-2 text-2xl font-black text-green-600">

              ₱0.00

            </p>

          </div>


          {/* POINTS */}

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 text-center">

            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">

              CPoints

            </p>


            <p className="mt-2 text-2xl font-black text-sky-600">

              0

            </p>

          </div>

        </div>


        {/* =====================================
            REMAINING TIME
        ===================================== */}

        <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 text-center">


          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">

            Remaining Time

          </p>


          <div
            className={`mt-2 text-4xl sm:text-5xl font-black tracking-tight ${
              isConnected
                ? "text-sky-600"
                : "text-slate-400"
            }`}
          >

            {remainingTime}

          </div>


          <p className="mt-2 text-xs text-slate-400">

            {isConnected
              ? "Your internet session is active."
              : "Insert money to start your internet session."}

          </p>

        </div>


        {/* =====================================
            MAIN BUTTONS
        ===================================== */}

        <div className="mt-4 space-y-3">


          {/* INSERT MONEY */}

          <button
            onClick={handleInsertCoin}
            disabled={
              checkingSession ||
              showCoinModal
            }
            className="w-full rounded-xl bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all py-4 text-lg font-bold text-white shadow-md disabled:opacity-50"
          >

            {showCoinModal
              ? "Waiting for Coin..."
              : "Insert Money"}

          </button>


          {/* PAUSE TIME */}

       {hasActiveSession && (
        <button
          onClick={
            isPaused
              ? handleResume
              : handlePause
          }
          disabled={pausing}
          className={`w-full rounded-xl py-4 text-lg font-bold text-white shadow-md active:scale-[0.98] transition-all disabled:opacity-40 ${
            isPaused
              ? "bg-blue-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {pausing
            ? "Please wait..."
            : isPaused
              ? "Resume Time"
              : "Pause Time"
          }
        </button>
      )}


          {/* WIFI RATES */}

          <button
            className="w-full rounded-xl bg-gray-500 hover:bg-blue-600 active:scale-[0.98] transition-all py-4 text-lg font-bold text-white shadow-md"
          >

            WiFi Rates

          </button>

        </div>


        {/* =====================================
            COLOR SEPARATOR
        ===================================== */}

        <div className="flex h-2 rounded-full overflow-hidden mt-6">

          <div className="flex-1 bg-lime-400" />

          <div className="flex-1 bg-yellow-400" />

          <div className="flex-1 bg-orange-400" />

          <div className="flex-1 bg-red-400" />

          <div className="flex-1 bg-purple-400" />

          <div className="flex-1 bg-blue-400" />

          <div className="flex-1 bg-cyan-400" />

        </div>


        {/* =====================================
            REDEEM CPOINTS
        ===================================== */}

        <div className="mt-6 text-center">


          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">

            Redeem CPoints

          </p>


          {/* SPIN WHEEL */}

          <button
            className="mt-3 w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all py-4 text-lg font-bold text-white shadow-md"
          >

            🎡 Spin The Wheel

          </button>

        </div>


        {/* =====================================
            VOUCHER
        ===================================== */}

        <div className="mt-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-4">


          <p className="text-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">

            Login Using Voucher

          </p>


          <VoucherLogin
            onLoginSuccess={
              handleVoucherSuccess
            }
          />

        </div>


        {/* =====================================
            COLOR SEPARATOR
        ===================================== */}

        <div className="flex h-2 rounded-full overflow-hidden mt-6">

          <div className="flex-1 bg-lime-400" />

          <div className="flex-1 bg-yellow-400" />

          <div className="flex-1 bg-orange-400" />

          <div className="flex-1 bg-red-400" />

          <div className="flex-1 bg-purple-400" />

          <div className="flex-1 bg-blue-400" />

          <div className="flex-1 bg-cyan-400" />

        </div>


      </div>

    </main>


    {/* =========================================
        FOOTER
    ========================================= */}

    <Footer />


    {/* =========================================
        INSERT COIN MODAL
    ========================================= */}

    <InsertCoinModal
    open={showCoinModal}
    amountInserted={amountInserted}
    startedAt={waitingStartedAt}
    expiresAt={waitingExpiresAt}
    onClose={() => {
        setShowCoinModal(false);
        stopCoinPolling();
    }}
    stopPopup={popup.stop}
/>

  </PortalLayout>

);

}