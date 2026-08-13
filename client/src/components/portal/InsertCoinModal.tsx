import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    amountInserted: number;
    startedAt: string | null;
    expiresAt: string | null;
    onClose: () => void;
    stopPopup: () => void;
}

export default function InsertCoinModal({
    open,
    amountInserted,
    startedAt,
    expiresAt,
    onClose,
    stopPopup
}: Props) {

    const [remainingSeconds, setRemainingSeconds] =
        useState(0);


    // ==========================================
    // COUNTDOWN BASED ON SERVER expiresAt
    // ==========================================

    useEffect(() => {

        if (!open || !expiresAt) {

            setRemainingSeconds(0);

            return;

        }


        const updateCountdown = () => {

            const expires =
                new Date(
                    expiresAt
                ).getTime();

            const now =
                Date.now();

            const remaining =
                Math.max(
                    0,
                    Math.ceil(
                        (
                            expires -
                            now
                        ) / 1000
                    )
                );


            setRemainingSeconds(
                remaining
            );


            // ==================================
            // WAITING CLIENT EXPIRED
            // ==================================

            if (
                remaining <= 0
            ) {

                stopPopup();

                onClose();

            }

        };


        updateCountdown();


        const timer =
            window.setInterval(
                updateCountdown,
                1000
            );


        return () => {

            window.clearInterval(
                timer
            );

        };

    }, [
        open,
        expiresAt,
        onClose,
        stopPopup
    ]);


    // ==========================================
    // ESC KEY
    // ==========================================

    useEffect(() => {

        if (
            !open
        ) {

            return;

        }


        const handleEsc =
            (e: KeyboardEvent) => {

                if (
                    e.key === "Escape"
                ) {

                    stopPopup();

                    onClose();

                }

            };


        window.addEventListener(
            "keydown",
            handleEsc
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleEsc
            );

        };

    }, [
        open,
        onClose,
        stopPopup
    ]);


    if (
        !open
    ) {

        return null;

    }


    // ==========================================
    // PROGRESS
    // ==========================================
    const startTime =
    startedAt
        ? new Date(startedAt).getTime()
        : 0;

const endTime =
    expiresAt
        ? new Date(expiresAt).getTime()
        : 0;

const totalDuration =
    endTime - startTime;

const remainingDuration =
    Math.max(
        0,
        endTime - Date.now()
    );

const progress =
    totalDuration > 0
        ? Math.min(
            100,
            Math.max(
                0,
                (
                    remainingDuration /
                    totalDuration
                ) * 100
            )
        )
        : 0;


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden">


                {/* HEADER */}

                <div className="bg-sky-600 text-white text-center py-5">

                    <h2 className="text-xl font-bold">
                        Insert Coin
                    </h2>

                </div>


                {/* BODY */}

                <div className="p-8 text-center">


                    <div className="text-7xl animate-bounce">

                        🪙

                    </div>


                    <h3 className="mt-6 text-2xl font-bold text-slate-800">

                        Waiting for coin...

                    </h3>


                    <p className="mt-2 text-slate-500">

                        Please insert your coin into the machine.

                    </p>


                    {/* COUNTDOWN */}

                    <div className="mt-6">


                        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">

                            <span>
                                Session expires in
                            </span>

                            <span>
                                {remainingSeconds}s
                            </span>

                        </div>


                       <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">

                            <div
                                className="h-full bg-sky-500 transition-all duration-1000"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>


                    {/* AMOUNT */}

                    <div className="mt-8 rounded-2xl bg-slate-100 p-5">

                        <p className="text-xs uppercase tracking-widest text-slate-400">

                            Amount Inserted

                        </p>


                        <h1 className="mt-2 text-4xl font-black text-green-600">

                            ₱{amountInserted.toFixed(2)}

                        </h1>

                    </div>

                </div>


                {/* FOOTER */}

                <div className="border-t p-4">

                    <button
                        onClick={() => {

                            stopPopup();

                            onClose();

                        }}
                        className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
                    >

                        Cancel

                    </button>

                </div>

            </div>

        </div>

    );

}