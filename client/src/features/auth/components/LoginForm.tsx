import { useState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";
import api from "../../../services/api";

export default function LoginForm() {

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    console.log(response.data);

  } catch (error) {
    console.error(error);
  }
};

  return (

    <div className="w-full">

      <h2 className="text-4xl font-bold text-gray-800">
        Welcome Back
      </h2>

      <p className="text-gray-500 mt-2">
        Sign in to your admin account.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >

        {/* Email */}

        <div>

          <label className="block text-sm font-semibold mb-2">
            Email
          </label>

          <div className="flex items-center border rounded-xl px-4">

            <Mail size={20} className="text-gray-400" />

            <input
              type="email"
              required
              placeholder="admin@skygrid.com"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full p-4 outline-none"
            />

          </div>

        </div>

        {/* Password */}

        <div>

          <label className="block text-sm font-semibold mb-2">
            Password
          </label>

          <div className="flex items-center border rounded-xl px-4">

            <Lock size={20} className="text-gray-400" />

            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full p-4 outline-none"
            />

          </div>

        </div>

        <button type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-4 font-bold flex justify-center items-center gap-2 transition"
        >

          <LogIn size={20} />

          Login

        </button>

      </form>

    </div>

  );

}