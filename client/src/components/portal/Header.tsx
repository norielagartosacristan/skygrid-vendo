import { Wifi, Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            SkyGrid Vendo
          </h1>

          <p className="text-gray-200 text-sm">
            Powered by SkyGrid Tech Solutions
          </p>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex gap-8 text-white font-medium">

          <a href="#">Home</a>

          <a href="#packages">Packages</a>

          <a href="#">Contact</a>

        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">

          <div className="hidden lg:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">

            <Wifi size={18} />

            <span>Online</span>

          </div>

          <button className="lg:hidden text-white">
            <Menu />
          </button>

        </div>

      </div>
    </header>
  );
}