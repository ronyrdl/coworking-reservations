
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const instant = false;

export default async function SpacesPage() {
  const spaces = await prisma.space.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="min-h-screen bg-[#F4F1E8] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <span className="text-sm font-semibold uppercase tracking-widest text-[#A7B69A]">
            Nuestros espacios
          </span>

          <h1 className="mt-3 text-4xl font-bold text-[#243D35] md:text-5xl">
            Encuentra tu lugar ideal
          </h1>

          <p className="mt-4 max-w-2xl text-[#243D35]/70">
            Espacios diseñados para trabajar, crear y colaborar.
            Elige el que mejor se adapte a ti.
          </p>
        </div>

        {spaces.length === 0 ? (
          <p className="rounded-2xl bg-white p-10 text-center text-[#243D35]/70">
            No hay espacios disponibles por el momento.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <article
                key={space.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-56 w-full bg-[#A7B69A]/20">
                  <Image
                    src={space.imageUrl}
                    alt={space.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <span className="rounded-full bg-[#A7B69A]/25 px-3 py-1 text-xs font-semibold text-[#243D35]">
                    {space.type}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-[#243D35]">
                    {space.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#243D35]/65">
                    {space.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[#243D35]/50">
                        Precio por hora
                      </p>
                      <p className="text-lg font-bold text-[#243D35]">
                        ${Number(space.pricePerHour).toLocaleString("es-CO")}
                      </p>
                    </div>

                    <Link
                      href={`/espacios/${space.id}`}
                      className="rounded-full bg-[#243D35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#36594D]"
                    >
                      Ver espacio
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
