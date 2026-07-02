import { useEffect, useState } from "react";
import {
  getGeneralSettings,
  saveGeneralSettings,
} from "../services/network.api";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    systemName: "",
    companyName: "",
    country: "Philippines",
    timezone: "Asia/Manila",
    currency: "PHP",
    language: "English",
    supportEmail: "",
    supportPhone: "",
    machinePrefix: "SGV",
    voucherPrefix: "SKY",
    primaryDNS: "8.8.8.8",
    secondaryDNS: "1.1.1.1",
    autoRestart: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await getGeneralSettings();

      if (res.data) {
        setForm(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      await saveGeneralSettings(form);

      alert("Settings saved successfully!");

    } catch (err) {

      console.log(err);

      alert("Unable to save settings.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      <h1 className="text-3xl font-bold">
        General Network Settings
      </h1>

      <p className="text-gray-500 mb-8">
        Configure global network defaults.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow border p-8 space-y-6"
      >

        <div className="grid grid-cols-2 gap-6">

          <div>
            <label className="font-medium">
              System Name
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.systemName}
              onChange={(e) =>
                setForm({
                  ...form,
                  systemName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Company Name
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.companyName}
              onChange={(e) =>
                setForm({
                  ...form,
                  companyName: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Country
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.country}
              onChange={(e) =>
                setForm({
                  ...form,
                  country: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Timezone
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.timezone}
              onChange={(e) =>
                setForm({
                  ...form,
                  timezone: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Primary DNS
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.primaryDNS}
              onChange={(e) =>
                setForm({
                  ...form,
                  primaryDNS: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="font-medium">
              Secondary DNS
            </label>

            <input
              className="w-full border rounded-lg p-3 mt-2"
              value={form.secondaryDNS}
              onChange={(e) =>
                setForm({
                  ...form,
                  secondaryDNS: e.target.value,
                })
              }
            />
          </div>

        </div>

        <button
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg"
        >
          {loading
            ? "Saving..."
            : "Save Settings"}
        </button>

      </form>

    </div>
  );
}