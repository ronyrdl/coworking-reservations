"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReservationFormProps {
  spaceId: string;
  pricePerHour: number;
}

export default function ReservationForm({
  spaceId,
  pricePerHour,
}: ReservationFormProps) {
  const router = useRouter();

  const [startAt, setStartAt] = useState("");
  const [durationHours, setDurationHours] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!startAt) {
      setError("Selecciona la fecha y hora de tu reserva.");
      return;
    }

    const selectedDate = new Date(startAt);

    if (selectedDate <= new Date()) {
      setError("La reserva debe ser en una fecha futura.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          spaceId,
          startAt: selectedDate.toISOString(),
          durationHours: Number(durationHours),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudo crear la reserva.");
        return;
      }

      setSuccess(true);
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-[#243D35]">
        Reserva este espacio
      </h2>

      <p className="mt-2 text-sm text-[#243D35]/60">
        Selecciona cuándo quieres utilizarlo.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="startAt"
            className="mb-2 block text-sm font-semibold text-[#243D35]"
          >
            Fecha y hora de inicio
          </label>

          <input
            id="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(event) => setStartAt(event.target.value)}
            required
            className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="mb-2 block text-sm font-semibold text-[#243D35]"
          >
            Duración
          </label>

          <select
            id="duration"
            value={durationHours}
            onChange={(event) => setDurationHours(event.target.value)}
            className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
          >
            <option value="1">1 hora</option>
            <option value="2">2 horas</option>
            <option value="3">3 horas</option>
            <option value="4">4 horas</option>
          </select>
        </div>

        <div className="rounded-xl bg-[#F4F1E8] p-4">
          <p className="text-sm text-[#243D35]/60">
            Precio estimado
          </p>
          <p className="mt-1 text-2xl font-bold text-[#243D35]">
            ${(pricePerHour * Number(durationHours)).toLocaleString("es-CO")}
          </p>
          <p className="mt-1 text-xs text-[#243D35]/50">
            El precio definitivo será calculado por el servidor.
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <div className="rounded-xl bg-green-50 p-3 text-sm text-green-700">
            ¡Tu reserva fue creada correctamente!
            <Link
              href="/dashboard"
              className="ml-1 font-semibold underline"
            >
              Ver mis reservas
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#243D35] px-6 py-3.5 font-semibold text-white transition hover:bg-[#36594D] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Procesando..." : "Confirmar reserva"}
        </button>
      </form>
    </div>
  );
}