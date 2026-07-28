import { useEffect, useState } from "react";

interface Props {
    open: boolean;
    amountInserted: number;
    onClose: () => void;
    stopPopup: () => void;
}

const WAITING_TIME = 30;

export default function InsertCoinModal({
    open,
    amountInserted,
    onClose,
    stopPopup
}: Props) {

    const [remainingSeconds, setRemainingSeconds] =
        useState(WAITING_TIME);


    // ==========================================
    // RESET COUNTDOWN WHEN MODAL OPENS
    // ==========================================

    useEffect(() => {

        if (!open) {
            return;
        }

        setRemainingSeconds(
            WAITING_TIME
        );

    }, [open]);


    // ==========================================
    // AUTO CLOSE WHEN COIN IS INSERTED
    // ==========================================

    useEffect(() => {

        if (!open) {
            return;
        }

        if (amountInserted > 0) {

            stopPopup();

            onClose();

        }

    }, [
        amountInserted,
        open,
        onClose,
        stopPopup
    ]);


    // ==========================================
    // COUNTDOWN
    // ==========================================

    useEffect(() => {

        if (!open) {
            return;
        }

        // Kapag may coin na,
        // huwag nang mag-countdown.
        if (amountInserted > 0) {
            return;
        }

        if (remainingSeconds <= 0) {

            stopPopup();

            onClose();

            return;
        }


        const timer =
            window.setTimeout(() => {

                setRemainingSeconds(
                    previous =>
                        previous - 1
                );

            }, 1000);


        return () => {

            window.clearTimeout(
                timer
            );

        };

    }, [
        open,
        amountInserted,
        remainingSeconds,
        onClose,
        stopPopup
    ]);


    // ==========================================
    // ESC KEY
    // ==========================================

    useEffect(() => {

        if (!open) {
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


    if (!open) {
        return null;
    }


    // ==========================================
    // PROGRESS
    // ==========================================

    const progress =
        (
            remainingSeconds /
            WAITING_TIME
        ) * 100;


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]">


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

                        {amountInserted > 0
                            ? "Coin Received!"
                            : "Waiting for coin..."
                        }

                    </h3>


                    <p className="mt-2 text-slate-500">

                        {amountInserted > 0
                            ? "Coin received successfully."
                            : "Please insert your coin into the machine."
                        }

                    </p>


                    {/* COUNTDOWN */}

                    {amountInserted === 0 && (

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
                                        width:
                                            `${progress}%`
                                    }}
                                />

                            </div>

                        </div>

                    )}


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