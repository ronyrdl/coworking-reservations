"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No fue posible crear la cuenta.");
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-[#F4F1E8] px-6 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#A7B69A]">
            Únete a CoSpace
          </span>

          <h1 className="mt-3 text-3xl font-bold text-[#243D35]">
            Crea tu cuenta
          </h1>

          <p className="mt-3 text-sm text-[#243D35]/60">
            Regístrate y encuentra el espacio ideal para trabajar.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              placeholder="Tu nombre"
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none transition focus:border-[#A7B69A] focus:ring-2 focus:ring-[#A7B69A]/20"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="correo@ejemplo.com"
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none transition focus:border-[#A7B69A] focus:ring-2 focus:ring-[#A7B69A]/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none transition focus:border-[#A7B69A] focus:ring-2 focus:ring-[#A7B69A]/20"
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
            className="w-full rounded-full bg-[#243D35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#36594D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#243D35]/70">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-semibold text-[#243D35] hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}