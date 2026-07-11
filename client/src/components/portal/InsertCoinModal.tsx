import { useEffect } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function InsertCoinModal({
    open,
    onClose,
}: Props) {

    useEffect(() => {

        if (!open) return;

        const handleEsc = (e: KeyboardEvent) => {

            if (e.key === "Escape") {

                onClose();

            }

        };

        window.addEventListener("keydown", handleEsc);

        return () => {

            window.removeEventListener("keydown", handleEsc);

        };

    }, [open, onClose]);

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

            <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-[fadeIn_.2s_ease]">

                {/* Header */}

                <div className="bg-sky-600 text-white text-center py-5">

                    <h2 className="text-xl font-bold">
                        Insert Coin
                    </h2>

                </div>

                {/* Body */}

                <div className="p-8 text-center">

                    <div className="text-7xl animate-bounce">
                        🪙
                    </div>

                    <h3 className="mt-6 text-2xl font-bold text-slate-800">
                        Waiting for coin...
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Please insert coin into the machine.
                    </p>

                    <div className="mt-8 rounded-2xl bg-slate-100 p-5">

                        <p className="text-xs uppercase tracking-widest text-slate-400">
                            Amount Inserted
                        </p>

                        <h1 className="mt-2 text-4xl font-black text-green-600">
                            ₱0.00
                        </h1>

                    </div>

                </div>

                {/* Footer */}

                <div className="border-t p-4">

                    <button
                        onClick={onClose}
                        className="w-full rounded-xl bg-red-500 py-3 font-semibold text-white hover:bg-red-600 transition"
                    >
                        Cancel
                    </button>

                </div>

            </div>

        </div>

    );

}