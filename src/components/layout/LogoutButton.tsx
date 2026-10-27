
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("No se pudo cerrar la sesión");
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("No fue posible cerrar la sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full bg-[#243D35] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#36594D] disabled:opacity-50"
    >
      {loading ? "Saliendo..." : "Cerrar sesión"}
    </button>
  );
}
