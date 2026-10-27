"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

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

interface EditSpacePageProps {
  params: Promise<{ id: string }>;
}

export default function EditSpacePage({ params }: EditSpacePageProps) {
  const router = useRouter();

  const [spaceId, setSpaceId] = useState("");
  const [space, setSpace] = useState<Space | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Escritorio");
  const [capacity, setCapacity] = useState("1");
  const [pricePerHour, setPricePerHour] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getSpaceId() {
      const { id } = await params;
      setSpaceId(id);
    }

    void getSpaceId();
  }, [params]);

  const loadSpace = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`/api/spaces/${spaceId}`, {
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "No se pudo cargar el espacio.");
        return;
      }

      const data: Space = result.data;

      setSpace(data);
      setName(data.name);
      setDescription(data.description);
      setType(data.type);
      setCapacity(String(data.capacity));
      setPricePerHour(String(data.pricePerHour));
      setImageUrl(data.imageUrl);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [spaceId]);

  useEffect(() => {
    if (!spaceId) return;

    void loadSpace();
  }, [spaceId, loadSpace]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
      const response = await fetch(`/api/spaces/${spaceId}`, {
        method: "PATCH",
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
        setError(result.message || "No se pudo actualizar el espacio.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#F4F1E8]">
        <p className="font-medium text-[#243D35]">
          Cargando espacio...
        </p>
      </section>
    );
  }

  if (!space) {
    return (
      <section className="min-h-[70vh] bg-[#F4F1E8] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8">
          <p className="text-red-600">
            {error || "No se encontró el espacio."}
          </p>

          <Link
            href="/admin"
            className="mt-4 inline-block font-semibold text-[#243D35]"
          >
            Volver al panel
          </Link>
        </div>
      </section>
    );
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
            Editar espacio
          </h1>

          <p className="mt-3 text-[#243D35]/70">
            Actualiza la información de {space.name}.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl bg-white p-8 shadow-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#243D35]"
            >
              Nombre del espacio
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-[#243D35]"
            >
              Descripción
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={4}
              className="w-full resize-none rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-semibold text-[#243D35]"
            >
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
              <label
                htmlFor="capacity"
                className="mb-2 block text-sm font-semibold text-[#243D35]"
              >
                Capacidad
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
              <label
                htmlFor="price"
                className="mb-2 block text-sm font-semibold text-[#243D35]"
              >
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
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="imageUrl"
              className="mb-2 block text-sm font-semibold text-[#243D35]"
            >
              URL de la imagen
            </label>

            <input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              required
              className="w-full rounded-xl border border-[#243D35]/15 px-4 py-3 text-[#243D35] outline-none focus:border-[#A7B69A]"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin"
              className="rounded-full border border-[#243D35]/20 px-7 py-3 text-center font-semibold text-[#243D35] hover:bg-[#F4F1E8]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#243D35] px-7 py-3 font-semibold text-white transition hover:bg-[#36594D] disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}