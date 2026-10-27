
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#243D35] text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="text-2xl font-bold">
              CoSpace<span className="text-[#A7B69A]">.</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              Encuentra el espacio ideal para trabajar, crear y llevar tus
              ideas más lejos.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Explora</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li>
                <Link href="/" className="transition hover:text-white">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/espacios" className="transition hover:text-white">
                  Nuestros espacios
                </Link>
              </li>
              <li>
                <Link href="/login" className="transition hover:text-white">
                  Mi cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">CoSpace</h3>
            <p className="mt-4 text-sm leading-6 text-white/65">
              Tu lugar para concentrarte, colaborar y crecer.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-6 text-center text-xs text-white/50">
          © CoSpace. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
