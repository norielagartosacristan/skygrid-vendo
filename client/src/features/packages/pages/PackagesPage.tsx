import PackageTable from "../components/PackageTable";

export default function PackagesPage() {
  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Internet Packages
          </h1>

          <p className="text-gray-500">
            Manage your internet packages.
          </p>

        </div>

        <button className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-xl">
          + Add Package
        </button>

      </div>

      <PackageTable />

    </div>
  );
}