"use client";

import { useCallback, useEffect, useState } from "react";

interface Reservation {
  id: string;
  startAt: string;
  endAt: string;
  totalPrice: string | number;
  status: "CONFIRMED" | "CANCELLED";
  space: {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
  };
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/reservations", {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudieron cargar tus reservas.");
        return;
      }

      setReservations(result.data);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  async function cancelReservation(id: string) {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas cancelar esta reserva?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        window.alert(result.message || "No se pudo cancelar la reserva.");
        return;
      }

      await loadReservations();
    } catch {
      window.alert("No se pudo conectar con el servidor.");
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("es-CO", {
      dateStyle: "long",
      timeZone: "America/Bogota",
    }).format(new Date(date));
  }

  function formatTime(date: string) {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "America/Bogota",
    }).format(new Date(date));
  }

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  );

  const cancelledReservations = reservations.filter(
    (reservation) => reservation.status === "CANCELLED",
  );

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#F4F1E8]">
        <p className="font-medium text-[#243D35]">
          Cargando tus reservas...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F4F1E8] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#A7B69A]">
            Mi cuenta
          </span>
          <h1 className="mt-3 text-4xl font-bold text-[#243D35]">
            Mis reservas
          </h1>
          <p className="mt-3 text-[#243D35]/70">
            Consulta y administra tus espacios reservados.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#243D35]/60">Reservas confirmadas</p>
            <p className="mt-2 text-3xl font-bold text-[#243D35]">
              {confirmedReservations.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#243D35]/60">Reservas canceladas</p>
            <p className="mt-2 text-3xl font-bold text-[#243D35]">
              {cancelledReservations.length}
            </p>
          </div>
        </div>

        {reservations.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-[#243D35]">
              Todavía no tienes reservas
            </h2>
            <p className="mt-3 text-[#243D35]/60">
              Explora nuestros espacios y encuentra el lugar ideal para ti.
            </p>
            <a
              href="/espacios"
              className="mt-6 inline-flex rounded-full bg-[#243D35] px-7 py-3 font-semibold text-white transition hover:bg-[#36594D]"
            >
              Explorar espacios
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {reservations.map((reservation) => (
              <article
                key={reservation.id}
                className="flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm md:flex-row md:items-center"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-bold text-[#243D35]">
                      {reservation.space.name}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        reservation.status === "CONFIRMED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {reservation.status === "CONFIRMED"
                        ? "Confirmada"
                        : "Cancelada"}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#243D35]/60">
                    {reservation.space.type}
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[#243D35]/50">Fecha</p>
                      <p className="font-medium text-[#243D35]">
                        {formatDate(reservation.startAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-[#243D35]/50">Horario</p>
                      <p className="font-medium text-[#243D35]">
                        {formatTime(reservation.startAt)} -{" "}
                        {formatTime(reservation.endAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#243D35]/10 pt-4 md:min-w-48 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  <div>
                    <p className="text-xs text-[#243D35]/50">Total</p>
                    <p className="text-2xl font-bold text-[#243D35]">
                      ${Number(reservation.totalPrice).toLocaleString("es-CO")}
                    </p>
                  </div>

                  {reservation.status === "CONFIRMED" && (
                    <button
                      onClick={() => cancelReservation(reservation.id)}
                      className="rounded-full border border-red-200 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Cancelar reserva
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}