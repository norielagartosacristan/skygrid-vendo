import VoucherForm from "../components/VoucherForm";
import VoucherTable from "../components/VoucherTable";

export default function VouchersPage() {
    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <div>

                    <h1 className="text-3xl font-bold">
                        Voucher Management
                    </h1>

                    <p className="text-gray-500">
                        Generate and manage internet vouchers.
                    </p>

                </div>

            </div>

            <VoucherForm />

            <VoucherTable />

        </div>
    );
}