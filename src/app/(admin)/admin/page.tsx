"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface Space {
  id: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  pricePerHour: number | string;
  imageUrl: string;
  isActive: boolean;
}

export default function AdminPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/spaces", {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudieron cargar los espacios.");
        return;
      }

      setSpaces(result.data);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSpaces();
  }, [loadSpaces]);

  async function toggleSpace(space: Space) {
    const action = space.isActive ? "desactivar" : "activar";

    if (!window.confirm(`¿Deseas ${action} este espacio?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/spaces/${space.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !space.isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudo actualizar el espacio.");
        return;
      }

      await loadSpaces();
    } catch {
      setError("No se pudo conectar con el servidor.");
    }
  }

  const activeSpaces = spaces.filter((space) => space.isActive);
  const inactiveSpaces = spaces.filter((space) => !space.isActive);

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#F4F1E8]">
        <p className="font-medium text-[#243D35]">
          Cargando administración...
        </p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F4F1E8] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="text-sm font-semibold uppercase tracking-widest text-[#A7B69A]">
              Administración
            </span>

            <h1 className="mt-3 text-4xl font-bold text-[#243D35]">
              Panel de CoSpace
            </h1>

            <p className="mt-3 text-[#243D35]/70">
              Gestiona los espacios disponibles en la plataforma.
            </p>
          </div>

          <Link
            href="/admin/espacios/nuevo"
            className="rounded-full bg-[#243D35] px-7 py-3 text-center font-semibold text-white transition hover:bg-[#36594D]"
          >
            + Crear espacio
          </Link>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#243D35]/60">Total de espacios</p>
            <p className="mt-2 text-3xl font-bold text-[#243D35]">
              {spaces.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#243D35]/60">Activos</p>
            <p className="mt-2 text-3xl font-bold text-green-700">
              {activeSpaces.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#243D35]/60">Inactivos</p>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {inactiveSpaces.length}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-[#243D35]">
            Gestión de espacios
          </h2>

          {spaces.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center">
              <p className="text-[#243D35]/60">
                Todavía no hay espacios registrados.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#243D35] text-sm text-white">
                    <tr>
                      <th className="px-6 py-4">Espacio</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4">Capacidad</th>
                      <th className="px-6 py-4">Precio/hora</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {spaces.map((space) => (
                      <tr
                        key={space.id}
                        className="border-b border-[#243D35]/10 last:border-0"
                      >
                        <td className="px-6 py-5 font-semibold text-[#243D35]">
                          {space.name}
                        </td>

                        <td className="px-6 py-5 text-sm text-[#243D35]/70">
                          {space.type}
                        </td>

                        <td className="px-6 py-5 text-sm text-[#243D35]/70">
                          {space.capacity} personas
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[#243D35]">
                          ${Number(space.pricePerHour).toLocaleString("es-CO")}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              space.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {space.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/espacios/${space.id}/editar`}
                              className="text-sm font-semibold text-[#243D35] hover:underline"
                            >
                              Editar
                            </Link>

                            <button
                              onClick={() => toggleSpace(space)}
                              className={`text-sm font-semibold ${
                                space.isActive
                                  ? "text-red-600"
                                  : "text-green-700"
                              }`}
                            >
                              {space.isActive ? "Desactivar" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}