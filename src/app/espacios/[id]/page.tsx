import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import ReservationForm from "@/components/reservations/ReservationForm";

export const instant = false;

interface SpaceDetailProps {
  params: Promise<{ id: string }>;
}

export default async function SpaceDetailPage({
  params,
}: SpaceDetailProps) {
  const { id } = await params;

  const space = await prisma.space.findFirst({
    where: {
      id,
      isActive: true,
    },
  });

  if (!space) {
    notFound();
  }

  const session = await getSession();

  return (
    <section className="min-h-screen bg-[#F4F1E8] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/espacios"
          className="text-sm font-semibold text-[#243D35] transition hover:text-[#A7B69A]"
        >
          ← Volver a los espacios
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="relative min-h-[350px] overflow-hidden rounded-3xl bg-[#A7B69A]/20">
            <Image
              src={space.imageUrl}
              alt={space.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <span className="w-fit rounded-full bg-[#A7B69A]/30 px-4 py-2 text-sm font-semibold text-[#243D35]">
              {space.type}
            </span>

            <h1 className="mt-5 text-4xl font-bold text-[#243D35] md:text-5xl">
              {space.name}
            </h1>

            <p className="mt-5 leading-7 text-[#243D35]/70">
              {space.description}
            </p>

            <div className="mt-8 rounded-2xl bg-white p-6">
              <p className="text-sm text-[#243D35]/60">
                Capacidad
              </p>

              <p className="mt-1 text-xl font-semibold text-[#243D35]">
                {space.capacity} personas
              </p>

              <div className="my-5 border-t border-[#243D35]/10" />

              <p className="text-sm text-[#243D35]/60">
                Precio por hora
              </p>

              <p className="mt-1 text-3xl font-bold text-[#243D35]">
                ${Number(space.pricePerHour).toLocaleString("es-CO")}
              </p>
            </div>

            {session ? (
              <ReservationForm
                spaceId={space.id}
                pricePerHour={Number(space.pricePerHour)}
              />
            ) : (
              <Link
                href="/login"
                className="mt-6 rounded-full bg-[#243D35] px-8 py-4 text-center font-semibold text-white transition hover:bg-[#36594D]"
              >
                Inicia sesión para reservar
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}