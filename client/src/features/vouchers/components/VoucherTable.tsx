export default function VoucherTable() {

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

                            Status

                        </th>

                        <th className="text-left p-3">

                            Created

                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        <td
                            className="p-3 text-gray-400 text-center"
                            colSpan={4}
                        >

                            No vouchers generated.

                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    );

}