import { useState } from "react";
import api from "../../services/api";
import { useSound } from "../../hooks/useSound";

interface Props {
    onLoginSuccess: (session: any) => void;
}

export default function VoucherLogin({ onLoginSuccess }: Props) {
    const [voucher, setVoucher] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const success = useSound("/sounds/success.mp3");


    async function handleLogin() {
        if (!voucher.trim()) {
            setMessage("Please enter your voucher.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const res = await api.post("/captive/login", {
                voucher: voucher.trim().toUpperCase(),
            });

            if (!res.data.success) {
                setMessage(res.data.message);
                return;
            }

            ambience.stop();


            success.play();

localStorage.setItem(
    "skygrid_session",
    JSON.stringify(res.data.session)
);

setTimeout(() => {
    onLoginSuccess(res.data.session);
    setVoucher("");
    setMessage("");
}, 500);

            localStorage.setItem(
    "skygrid_session",
    JSON.stringify(res.data.session)
);

onLoginSuccess(res.data.session);

setVoucher("");

setMessage("");
        } catch (err: any) {
            setMessage(
                err.response?.data?.message ??
                "Unable to connect."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6">

            <div className="flex flex-col sm:flex-row gap-3">

                <input
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Enter Voucher Code"
                    className="flex-1 border rounded-xl p-4 text-base focus:outline-none focus:ring-2 focus:ring-sky-500"
                />

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl px-6 py-4 font-semibold transition-colors whitespace-nowrap"
                >
                    {loading ? "Connecting..." : "Submit"}
                </button>

            </div>

            {message && (
                <p
                    className={`mt-4 rounded-xl p-3 text-center text-sm sm:text-base ${
                        message.startsWith("✅")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {message}
                </p>
            )}

        </div>
    );
}