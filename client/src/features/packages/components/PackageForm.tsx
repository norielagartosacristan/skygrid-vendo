import { useState } from "react";

export default function PackageForm() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    speed: "",
    status: "ACTIVE",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log(form);

    // TODO:
    // POST /api/packages
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2 font-medium">
          Package Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
          placeholder="Basic Package"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Price
        </label>

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
          placeholder="5"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Duration
        </label>

        <input
          type="text"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
          placeholder="1 Hour"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Speed
        </label>

        <input
          type="text"
          name="speed"
          value={form.speed}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
          placeholder="100 Mbps"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Status
        </label>

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border rounded-xl p-3"
        >
          <option value="ACTIVE">
            Active
          </option>

          <option value="DISABLED">
            Disabled
          </option>
        </select>
      </div>

      <button
        className="w-full bg-sky-600 hover:bg-sky-700 text-white rounded-xl py-3 font-semibold"
      >
        Save Package
      </button>
    </form>
  );
}