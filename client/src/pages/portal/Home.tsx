import PortalLayout from "../../layouts/PortalLayout";
import Header from "../../components/portal/Header";
import Clock from "../../components/portal/Clock";
import HeroCarousel from "../../components/portal/HeroCarousel";
import VoucherLogin from "../../components/portal/VoucherLogin";

export default function Home() {
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

              <button className="mt-8 bg-sky-600 hover:bg-sky-700 px-8 py-4 rounded-2xl text-lg font-semibold transition">
                Connect Now
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="bg-slate-100 py-10">

        <div className="max-w-7xl mx-auto px-4">

          <Clock />

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <p className="text-gray-500">Balance</p>
              <h2 className="text-5xl font-bold text-green-600 mt-3">
                ₱0.00
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <p className="text-gray-500">Remaining Time</p>
              <h2 className="text-5xl font-bold mt-3">
                00:00:00
              </h2>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <p className="text-gray-500">Connection Status</p>
              <h2 className="text-4xl font-bold text-green-600 mt-3">
                Connected
              </h2>
            </div>

          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">

            {/* LEFT */}
            <div className="lg:col-span-8">

              <div className="bg-white rounded-3xl shadow-lg p-6">

                <h2 className="text-2xl font-bold mb-6">
                  Internet Packages
                </h2>

                <div className="space-y-4">

                  {[
                    { price: "₱5", time: "1 Hour" },
                    { price: "₱10", time: "3 Hours" },
                    { price: "₱20", time: "1 Day" },
                  ].map((pkg) => (

                    <div
                      key={pkg.price}
                      className="flex justify-between items-center bg-slate-100 rounded-2xl p-5 hover:bg-sky-50 transition"
                    >

                      <span className="text-2xl font-bold text-sky-600">
                        {pkg.price}
                      </span>

                      <span className="text-lg font-medium">
                        {pkg.time}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            </div>

            {/* RIGHT */}
          {/* RIGHT */}
<div className="lg:col-span-4 space-y-6">

    <VoucherLogin />

    <button className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-3xl py-6 text-2xl font-bold shadow-xl transition">
        🪙 INSERT COIN
    </button>

    <div className="bg-white rounded-3xl shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">
            Announcement
        </h2>

        <p className="text-gray-600">
            Welcome to SkyGrid Vendo.
        </p>

        <p className="text-gray-600 mt-2">
            Enjoy fast and reliable internet.
        </p>

    </div>

</div>
          </div>

        </div>

      </section>

    </PortalLayout>
  );
}