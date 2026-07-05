import { useState } from "react";

export default function VoucherForm() {

    const [packageId, setPackageId] = useState("");

    const [quantity, setQuantity] = useState(10);

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

                </select>

                <input
                    type="number"
                    min={1}
                    className="border rounded-lg p-3"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                />

                <button
                    className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
                >

                    Generate

                </button>

            </div>

        </div>

    );

}