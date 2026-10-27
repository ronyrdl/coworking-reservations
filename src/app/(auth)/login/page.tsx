
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No fue posible iniciar sesión.");
        return;
      }

      router.push(
        result.user.role === "ADMIN" ? "/admin" : "/dashboard"
      );

      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-[#F4F1E8] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm md:p-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#243D35]">
            ¡Bienvenido de nuevo!
          </h1>

          <p className="mt-3 text-sm text-[#243D35]/60">
            Ingresa a tu cuenta para continuar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243D35]">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#A7B69A]/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#243D35]">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Tu contraseña"
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none transition focus:border-[#243D35] focus:ring-2 focus:ring-[#A7B69A]/30"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#243D35] py-3.5 font-semibold text-white transition hover:bg-[#36594D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-[#243D35]/65">
          ¿Todavía no tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#243D35] underline underline-offset-4"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
