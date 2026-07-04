import { useState } from "react";
import api from "../../services/api";

export default function VoucherLogin() {
    const [voucher, setVoucher] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleLogin() {

        if (!voucher.trim()) {
            setMessage("Please enter your voucher.");
            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const res = await api.post("/captive/login", {
                voucher,
            });

            if (!res.data.success) {
                setMessage(res.data.message);
                return;
            }

            setMessage("✅ Connected successfully.");

            setTimeout(() => {
                window.location.href = "https://google.com";
            }, 1500);

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
        <div className="bg-white rounded-3xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-5">
                Voucher Login
            </h2>

            <input
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                placeholder="Enter Voucher Code"
                className="w-full border rounded-xl p-4"
            />

            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-4 font-semibold"
            >
                {loading ? "Connecting..." : "Connect"}
            </button>

            {message && (
                <p className="mt-4 text-center">
                    {message}
                </p>
            )}

        </div>
    );
}