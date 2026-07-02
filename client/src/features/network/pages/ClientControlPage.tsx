import { useEffect, useState } from "react";
import {
  getClientControl,
  saveClientControl,
} from "../services/clientControl.api";

export default function ClientControlPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    defaultDownload: 15,
    defaultUpload: 15,

    maxClients: 100,

    idleTimeout: 5,
    sessionTimeout: 24,

    macLock: true,
    deviceIsolation: false,
    autoDisconnect: true,

    reconnectDelay: 10,

    queueType: "PCQ",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await getClientControl();

      if (res.data) {
        setForm(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await saveClientControl(form);

      alert("Client Control settings saved!");

    } catch (err) {

      console.log(err);

      alert("Unable to save settings.");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="max-w-6xl mx-auto">

      <h1 className="text-3xl font-bold">
        Client Control
      </h1>

      <p className="text-gray-500 mb-8">
        Configure default bandwidth and security for connected clients.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Default Speed */}

        <div className="bg-white border rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Default Client Speed
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 font-medium">
                Download (Mbps)
              </label>

              <input
                type="number"
                value={form.defaultDownload}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultDownload: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block mb-2 font-medium">
                Upload (Mbps)
              </label>

              <input
                type="number"
                value={form.defaultUpload}
                onChange={(e) =>
                  setForm({
                    ...form,
                    defaultUpload: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

        </div>

        {/* Limits */}

        <div className="bg-white border rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Client Limits
          </h2>

          <div className="grid grid-cols-3 gap-6">

            <div>

              <label className="block mb-2">
                Maximum Clients
              </label>

              <input
                type="number"
                value={form.maxClients}
                onChange={(e) =>
                  setForm({
                    ...form,
                    maxClients: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block mb-2">
                Idle Timeout (minutes)
              </label>

              <input
                type="number"
                value={form.idleTimeout}
                onChange={(e) =>
                  setForm({
                    ...form,
                    idleTimeout: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="block mb-2">
                Session Timeout (hours)
              </label>

              <input
                type="number"
                value={form.sessionTimeout}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sessionTimeout: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

        </div>

        {/* Security */}

        <div className="bg-white border rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Security
          </h2>

          <div className="space-y-4">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.macLock}
                onChange={(e) =>
                  setForm({
                    ...form,
                    macLock: e.target.checked,
                  })
                }
              />

              Enable MAC Lock
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.deviceIsolation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deviceIsolation: e.target.checked,
                  })
                }
              />

              Enable Device Isolation
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.autoDisconnect}
                onChange={(e) =>
                  setForm({
                    ...form,
                    autoDisconnect: e.target.checked,
                  })
                }
              />

              Auto Disconnect
            </label>

          </div>

        </div>

        {/* Queue */}

        <div className="bg-white border rounded-xl shadow p-6">

          <h2 className="text-xl font-semibold mb-6">
            Queue Settings
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <div>

              <label className="block mb-2">
                Queue Type
              </label>

              <select
                value={form.queueType}
                onChange={(e) =>
                  setForm({
                    ...form,
                    queueType: e.target.value,
                  })
                }
                className="w-full border rounded-lg p-3"
              >

                <option value="PCQ">
                  PCQ
                </option>

                <option value="SIMPLE_QUEUE">
                  Simple Queue
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2">
                Reconnect Delay (seconds)
              </label>

              <input
                type="number"
                value={form.reconnectDelay}
                onChange={(e) =>
                  setForm({
                    ...form,
                    reconnectDelay: Number(e.target.value),
                  })
                }
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

        </div>

        <button
          disabled={loading}
          className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-lg font-semibold"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>

      </form>

    </div>
  );
}