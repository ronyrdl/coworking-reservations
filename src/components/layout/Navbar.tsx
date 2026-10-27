
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#243D35]/10 bg-[#F4F1E8]/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#243D35] text-xl font-bold text-white">
            C
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#243D35]">
            CoSpace<span className="text-[#A7B69A]">.</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-[#243D35] transition hover:text-[#A7B69A]"
          >
            Inicio
          </Link>

          <Link
            href="/espacios"
            className="text-sm font-medium text-[#243D35] transition hover:text-[#A7B69A]"
          >
            Espacios
          </Link>

          <a
            href="/#nosotros"
            className="text-sm font-medium text-[#243D35] transition hover:text-[#A7B69A]"
          >
            Nosotros
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full px-5 py-2.5 text-sm font-semibold text-[#243D35] transition hover:bg-[#A7B69A]/20 sm:inline-flex"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="rounded-full bg-[#243D35] px-5 py-2.5 text-sm  font-semibold text-white shadow-sm transition hover:bg-[#36594D]"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
}
