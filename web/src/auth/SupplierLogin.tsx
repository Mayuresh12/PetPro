import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function SupplierLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    console.log("----> Login button clicked");
    console.log("----> Email:", email);

    setError("");

    console.log("----> Calling supabase.auth.signInWithPassword");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("----> Login FAILED:", error.message);
      setError(error.message);
      return;
    }

    console.log("----> Login SUCCESS");
    console.log("----> User ID:", data.user?.id);
    console.log("----> Navigating to /supplier/dashboard");

    navigate("/supplier/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-purple-700 mb-6">
          Supplier Login
        </h2>

        {error && (
          <p className="mb-4 text-red-600 text-sm">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded-lg"
          value={email}
          onChange={(e) => {
            console.log("----> Email changed:", e.target.value);
            setEmail(e.target.value);
          }}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded-lg"
          value={password}
          onChange={(e) => {
            console.log("----> Password changed");
            setPassword(e.target.value);
          }}
        />

        <button
          onClick={login}
          className="w-full bg-purple-700 text-white py-3 rounded-xl font-bold hover:bg-purple-800 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}