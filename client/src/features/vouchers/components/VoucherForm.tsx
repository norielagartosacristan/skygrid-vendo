
import { useState } from "react";
import api from "../../../services/api";

interface Package {
    id: string;
    name: string;
    price: number;
}

interface Props {
    packages: Package[];
    onGenerated: () => void;
}

export default function VoucherForm({
    packages,
    onGenerated,
}: Props) {
    const [packageId, setPackageId] = useState("");
    const [quantity, setQuantity] = useState(10);

    // Separate device setting from custom validity
    const [oneDevice, setOneDevice] = useState(true);
    const [customValidity, setCustomValidity] = useState(false);

    // Custom validity is MONTHS ONLY
    const [validityMonths, setValidityMonths] = useState(6);

    const [loading, setLoading] = useState(false);

    async function generate() {
        if (!packageId) {
            alert("Please select a package.");
            return;
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        if (
            customValidity &&
            (!Number.isInteger(validityMonths) ||
                validityMonths <= 0)
        ) {
            alert("Please enter a valid number of months.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/vouchers/generate", {
                packageId,
                quantity,
                oneDevice,

                validityValue: customValidity
                    ? validityMonths
                    : null,

                validityUnit: customValidity
                    ? "MONTH"
                    : null,
            });

            alert("Voucher generated successfully.");
            onGenerated();

        } catch (err: any) {
            alert(
                err.response?.data?.message ||
                err.message ||
                "Failed to generate vouchers."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-5">
                Generate Vouchers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* PACKAGE */}
                <select
                    className="border rounded-lg p-3"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                >
                    <option value="">Select Package</option>

                    {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - ₱{pkg.price}
                        </option>
                    ))}
                </select>

                {/* QUANTITY */}
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    className="border rounded-lg p-3"
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                />

                {/* ONE DEVICE */}
                <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={oneDevice}
                        onChange={(e) =>
                            setOneDevice(e.target.checked)
                        }
                    />
                    <span>One Device</span>
                </label>

                {/* CUSTOM VALIDITY */}
                <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={customValidity}
                        onChange={(e) =>
                            setCustomValidity(e.target.checked)
                        }
                    />
                    <span>Custom Validity</span>
                </label>

                {/* MONTHS ONLY */}
                {customValidity && (
                    <div className="md:col-span-4">
                        <label className="block text-sm font-medium mb-2">
                            Voucher Validity
                        </label>

                        <div className="flex gap-2">
                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={validityMonths}
                                className="w-1/2 border rounded-lg p-3"
                                onChange={(e) =>
                                    setValidityMonths(
                                        Number(e.target.value)
                                    )
                                }
                            />

                            <div className="w-1/2 border rounded-lg p-3 bg-gray-50 text-gray-700">
                                Months
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            Custom vouchers use months only.
                            Validity should begin upon first activation.
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={generate}
                disabled={loading}
                className="mt-4 w-full md:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg"
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </div>
    );
}
