"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewSpacePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Escritorio");
  const [capacity, setCapacity] = useState("1");
  const [pricePerHour, setPricePerHour] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          type,
          capacity: Number(capacity),
          pricePerHour: Number(pricePerHour),
          imageUrl,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudo crear el espacio.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#F4F1E8] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/admin"
          className="text-sm font-semibold text-[#243D35] hover:underline"
        >
          ← Volver al panel
        </Link>

        <div className="mb-8 mt-8">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#A7B69A]">
            Administración
          </span>

          <h1 className="mt-3 text-4xl font-bold text-[#243D35]">
            Crear espacio
          </h1>

          <p className="mt-3 text-[#243D35]/70">
            Registra un nuevo espacio para ofrecerlo en CoSpace.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-white p-8 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Nombre del espacio
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
              placeholder="Ej. Escritorio Premium"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
              placeholder="Describe las características del espacio..."
            />
          </div>

          <div>
            <label htmlFor="type" className="mb-2 block text-sm font-semibold text-[#243D35]">
              Tipo de espacio
            </label>
            <select
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
            >
              <option value="Escritorio">Escritorio</option>
              <option value="Sala de reuniones">Sala de reuniones</option>
              <option value="Cabina">Cabina</option>
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="capacity" className="mb-2 block text-sm font-semibold text-[#243D35]">
                Capacidad (personas)
              </label>
              <input
                id="capacity"
                type="number"
                min="1"
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                required
                className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
              />
            </div>

            <div>
              <label htmlFor="price" className="mb-2 block text-sm font-semibold text-[#243D35]">
                Precio por hora (COP)
              </label>
              <input
                id="price"
                type="number"
                min="1"
                step="0.01"
                value={pricePerHour}
                onChange={(event) => setPricePerHour(event.target.value)}
                required
                className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
                placeholder="Ej. 15000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-semibold text-[#243D35]">
              URL de la imagen
            </label>
            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="mt-2 text-xs text-[#243D35]/50">
              Introduce una URL pública de una imagen.
            </p>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin"
              className="rounded-full border border-[#243D35]/20 px-7 py-3 text-center font-semibold text-[#243D35] transition hover:bg-[#F4F1E8]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#243D35] px-7 py-3 font-semibold text-white transition hover:bg-[#36594D] disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Crear espacio"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}