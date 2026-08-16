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

type ValidityUnit =
    | "DAY"
    | "MONTH"
    | "YEAR";

export default function VoucherForm({
    packages,
    onGenerated,
}: Props) {

    const [packageId, setPackageId] =
        useState("");

    const [quantity, setQuantity] =
        useState(10);

    const [longTerm, setLongTerm] =
        useState(false);

    const [validityValue, setValidityValue] =
        useState(6);

    const [validityUnit, setValidityUnit] =
        useState<ValidityUnit>("MONTH");

    const [loading, setLoading] =
        useState(false);


    async function generate() {

        if (!packageId) {

            alert(
                "Please select a package."
            );

            return;
        }


        if (
            longTerm &&
            (
                !Number.isInteger(
                    validityValue
                ) ||
                validityValue <= 0
            )
        ) {

            alert(
                "Please enter a valid voucher duration."
            );

            return;
        }


        try {

            setLoading(true);


            await api.post(
                "/vouchers/generate",
                {

                    packageId,

                    quantity,

                    validityValue:
                        longTerm
                            ? validityValue
                            : null,

                    validityUnit:
                        longTerm
                            ? validityUnit
                            : null

                }
            );


            alert(
                "Voucher generated successfully."
            );


            onGenerated();

        } catch (err: any) {

            alert(
                err.response?.data?.message ||
                err.message
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
                    onChange={(e) =>
                        setPackageId(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        Select Package
                    </option>


                    {packages.map(
                        (pkg) => (

                            <option
                                key={pkg.id}
                                value={pkg.id}
                            >

                                {pkg.name}
                                {" - ₱"}
                                {pkg.price}

                            </option>

                        )
                    )}

                </select>


                {/* QUANTITY */}
                <input
                    type="number"
                    min={1}
                    value={quantity}
                    className="border rounded-lg p-3"
                    onChange={(e) =>
                        setQuantity(
                            Number(
                                e.target.value
                            )
                        )
                    }
                />


                {/* LONG TERM TOGGLE */}
                <label className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer">

                    <input
                        type="checkbox"
                        checked={longTerm}
                        onChange={(e) =>
                            setLongTerm(
                                e.target.checked
                            )
                        }
                    />

                    <span>
                        One Device
                    </span>

                </label>


                {/* DURATION */}
                <div className="flex gap-2">

                    <input
                        type="number"
                        min={1}
                        disabled={!longTerm}
                        value={validityValue}
                        className="w-1/2 border rounded-lg p-3"
                        onChange={(e) =>
                            setValidityValue(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                    />

                    <select
                        disabled={!longTerm}
                        className="w-1/2 border rounded-lg p-3"
                        value={validityUnit}
                        onChange={(e) =>
                            setValidityUnit(
                                e.target.value as ValidityUnit
                            )
                        }
                    >

                        <option value="DAY">
                            Days
                        </option>

                        <option value="MONTH">
                            Months
                        </option>

                        <option value="YEAR">
                            Years
                        </option>

                    </select>

                </div>

            </div>


            <button
                onClick={generate}
                disabled={loading}
                className="mt-4 w-full md:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg"
            >

                {loading
                    ? "Generating..."
                    : "Generate"}

            </button>

        </div>

    );

}