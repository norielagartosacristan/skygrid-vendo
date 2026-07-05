import { useEffect, useState } from "react";
import api from "../../../services/api";
import VoucherForm from "../components/VoucherForm";
import VoucherTable from "../components/VoucherTable";

export default function VouchersPage() {

    const [packages, setPackages] = useState([]);
    const [vouchers, setVouchers] = useState([]);

    async function loadPackages() {

        const res = await api.get("/packages");

        setPackages(res.data.data);

    }

    async function loadVouchers() {

        const res = await api.get("/vouchers");

        setVouchers(res.data.data);

    }

    useEffect(() => {

        loadPackages();

        loadVouchers();

    }, []);

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-3xl font-bold">

                    Voucher Management

                </h1>

                <p className="text-gray-500">

                    Generate and manage internet vouchers.

                </p>

            </div>

            <VoucherForm

                packages={packages}

                onGenerated={loadVouchers}

            />

            <VoucherTable

                vouchers={vouchers}

            />

        </div>

    );

}