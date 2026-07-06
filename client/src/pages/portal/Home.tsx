import PortalLayout from "../../layouts/PortalLayout";
import Header from "../../components/portal/Header";
import Footer from "../../components/portal/Footer";
import Clock from "../../components/portal/Clock";
import HeroCarousel from "../../components/portal/HeroCarousel";
import VoucherLogin from "../../components/portal/VoucherLogin";
import { useState } from "react";
import { useCountdown } from "../../hooks/useCountdown";




export default function Home() {
  
  const [session, setSession] = useState<any>(null);

    const remaining = useCountdown(
        session?.expiresAt
    );
  
  return (
    <PortalLayout>
      <Header />

      {/* HERO SECTION - FULL WIDTH */}
      <section className="relative w-full h-[280px] lg:h-[520px] overflow-hidden">
       
        <HeroCarousel />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6">

            <div className="max-w-2xl text-white">

              <h4 className="text-sky-400 text-xl lg:text-2xl font-semibold mb-2">
                Welcome to
              </h4>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                SkyGrid Vendo
              </h1>

              <p className="mt-6 text-lg lg:text-2xl text-gray-200">
                High-Speed Internet Access
              </p>

              <p className="mt-3 text-gray-300">
                Fast • Secure • Reliable
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-slate-100 py-3">

        <div className="max-w-7xl mx-auto px-4">

          <Clock />

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <p className="text-gray-500">Connection Status</p>
              <h2 className="text-4xl font-bold text-green-600 mt-3">
                Connected
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <p className="text-gray-500">Credit Balance</p>
              <h2 className="text-5xl font-bold text-green-600 mt-3">
                ₱0.00
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">

    <p className="text-gray-500">

        Remaining Time

    </p>

    <h2 className="text-5xl font-bold mt-3">

        {remaining}

    </h2>

</div>

            <VoucherLogin
    onLoginSuccess={setSession}
/>
             <button className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-3xl py-6 text-2xl font-bold shadow-xl transition">
                🪙 INSERT COIN
            </button>

          </div>
        </div>

      </section>
      <Footer />
    </PortalLayout>
  );
}