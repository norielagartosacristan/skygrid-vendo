interface Voucher {
    id: string;
    code: string;
    status: string;
    createdAt: string;

    package: {
        name: string;
        price: number;
    };
}

interface Props {
    vouchers: Voucher[];
}

export default function VoucherTable({
    vouchers,
}: Props) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="text-left p-3">
                            Voucher Code
                        </th>

                        <th className="text-left p-3">
                            Package
                        </th>

                        <th className="text-left p-3">
                            Price
                        </th>

                        <th className="text-left p-3">
                            Status
                        </th>

                        <th className="text-left p-3">
                            Created
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {vouchers.length === 0 ? (

                        <tr>

                            <td
                                className="p-6 text-center text-gray-400"
                                colSpan={5}
                            >

                                No vouchers found.

                            </td>

                        </tr>

                    ) : (

                        vouchers.map((voucher) => (

                            <tr
                                key={voucher.id}
                                className="border-t hover:bg-gray-50"
                            >

                                <td className="p-3 font-mono font-semibold">

                                    {voucher.code}

                                </td>

                                <td className="p-3">

                                    {voucher.package.name}

                                </td>

                                <td className="p-3">

                                    ₱{voucher.package.price}

                                </td>

                                <td className="p-3">

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            voucher.status === "ACTIVE"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >

                                        {voucher.status}

                                    </span>

                                </td>

                                <td className="p-3">

                                    {new Date(
                                        voucher.createdAt
                                    ).toLocaleString()}

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}