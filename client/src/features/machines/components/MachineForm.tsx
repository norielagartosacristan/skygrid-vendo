import { useState } from "react";

export default function MachineForm() {

  const [form, setForm] = useState({
    name: "",
    ip: "",
    mac: "",
    vendor: "",
    location: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    console.log(form);
  }

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >

      <input
        name="name"
        placeholder="Machine Name"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />

      <input
        name="ip"
        placeholder="IP Address"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />

      <input
        name="mac"
        placeholder="MAC Address"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />

      <input
        name="vendor"
        placeholder="Vendor"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />

      <input
        name="location"
        placeholder="Location"
        onChange={handleChange}
        className="w-full border rounded-xl p-3"
      />

      <button
        className="bg-sky-600 text-white rounded-xl py-3 w-full"
      >
        Save Machine
      </button>

    </form>

  );

}