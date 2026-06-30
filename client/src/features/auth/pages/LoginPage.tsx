import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-900 flex items-center justify-center p-6">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center bg-blue-700 text-white p-12">

          <h1 className="text-5xl font-extrabold">
            SkyGrid
          </h1>

          <p className="text-2xl mt-2">
            Vendo OS
          </p>

          <div className="mt-10 space-y-4 text-blue-100">

            <div>
              ✓ WiFi Vendo Management
            </div>

            <div>
              ✓ Real-time Dashboard
            </div>

            <div>
              ✓ Voucher Management
            </div>

            <div>
              ✓ Revenue Reports
            </div>

            <div>
              ✓ Machine Monitoring
            </div>

          </div>

          <p className="mt-auto text-sm text-blue-200">
            Powered by SkyGrid Tech Solutions
          </p>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-10 lg:p-14 flex items-center">

          <LoginForm />

        </div>

      </div>

    </div>
  );
}