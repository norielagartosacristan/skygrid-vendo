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

    const [loading, setLoading] = useState(false);

    async function generate() {

        if (!packageId) {

            alert("Please select a package.");

            return;

        }

        try {

            setLoading(true);

            await api.post("/vouchers/generate", {

                packageId,

                quantity,

            });

            alert("Voucher generated successfully.");

            onGenerated();

        } catch (err: any) {

            alert(err.response?.data?.message || err.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-5">

                Generate Vouchers

            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <select
                    className="border rounded-lg p-3"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                >

                    <option value="">
                        Select Package
                    </option>

                    {packages.map((pkg) => (

                        <option
                            key={pkg.id}
                            value={pkg.id}
                        >

                            {pkg.name} - ₱{pkg.price}

                        </option>

                    ))}

                </select>

                <input
                    type="number"
                    min={1}
                    value={quantity}
                    className="border rounded-lg p-3"
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                />

                <button
                    onClick={generate}
                    disabled={loading}
                    className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
                >

                    {loading ? "Generating..." : "Generate"}

                </button>

            </div>

        </div>

    );

}