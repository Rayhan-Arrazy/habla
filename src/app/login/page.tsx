"use client";
import { useState } from "react";
import Link from "next/link";
import { login } from "../actions";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.error) {
      setError(res.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-md w-full">
        <h1 className="text-3xl font-black text-slate-800 mb-6 text-center">Log In</h1>
        {error && <p className="text-red-500 mb-4 text-center font-medium bg-red-50 p-2 rounded-lg">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-es-red-500 focus:ring-1 focus:ring-es-red-500"
              required 
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-es-red-500 focus:ring-1 focus:ring-es-red-500"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-es-red-600 text-white font-bold py-3 rounded-xl hover:bg-es-red-700 transition-colors">
            Log In
          </button>
        </form>
        <p className="mt-6 text-center text-slate-500">
          Don't have an account? <Link href="/register" className="text-es-red-600 font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
