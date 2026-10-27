
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const reservationSchema = z.object({
  spaceId: z.string().min(1),
  startAt: z.string().datetime({ offset: true }),
  durationHours: z.number().int().min(1).max(4),
});

function getBogotaTime(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  return {
    hour: Number(parts.find((part) => part.type === "hour")?.value),
    minute: Number(parts.find((part) => part.type === "minute")?.value),
  };
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const reservations = await prisma.reservation.findMany({
      where: { userId: session.userId },
      include: { space: true },
      orderBy: { startAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: reservations,
    });
  } catch (error) {
    console.error("Get reservations error:", error);

    return NextResponse.json(
      { success: false, message: "Error al obtener las reservas" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
 let spaceIdFromRequest = "";
let startAtFromRequest = 0;
let endAtFromRequest = 0;
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "No autenticado" },
      { status: 401 },
    );
  }

  const idempotencyKey = request.headers.get("Idempotency-Key")?.trim();

  if (
    !idempotencyKey ||
    idempotencyKey.length < 8 ||
    idempotencyKey.length > 128
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Debes enviar una clave Idempotency-Key válida",
      },
      { status: 400 },
    );
  }

  try {
    const body: unknown = await request.json();
    const validation = reservationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Datos inválidos",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { spaceId, startAt: startAtString, durationHours } = validation.data;

    const startAt = new Date(startAtString);
    const endAt = new Date(
      startAt.getTime() + durationHours * 60 * 60 * 1000,
    );
     spaceIdFromRequest = spaceId; 
     startAtFromRequest = startAt.getTime();
     endAtFromRequest = endAt.getTime();

    // Comprobar si la operación ya fue realizada.
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        userId: session.userId,
        idempotencyKey,
      },
      include: { space: true },
    });

    if (existingReservation) {
      if (
        existingReservation.spaceId !== spaceId ||
        existingReservation.startAt.getTime() !== startAt.getTime() ||
        existingReservation.endAt.getTime() !== endAt.getTime()
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "La clave ya fue utilizada con otros datos",
          },
          { status: 409 },
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Esta reserva ya había sido creada",
          data: existingReservation,
        },
        { status: 200 },
      );
    }

    const now = new Date();
    const maximumDate = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    const { hour, minute } = getBogotaTime(startAt);
    const endTime = getBogotaTime(endAt);

    if (startAt <= now || startAt > maximumDate) {
      return NextResponse.json(
        {
          success: false,
          message: "La reserva debe estar dentro de los próximos 30 días",
        },
        { status: 400 },
      );
    }

    if (
      minute !== 0 ||
      endTime.minute !== 0 ||
      hour < 7 ||
      endTime.hour > 21
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "El horario permitido es de 07:00 a 21:00, en horas enteras",
        },
        { status: 400 },
      );
    }

    const reservation = await prisma.$transaction(async (tx) => {
      const space = await tx.space.findUnique({
        where: { id: spaceId },
      });

      if (!space || !space.isActive) {
        throw new Error("SPACE_NOT_AVAILABLE");
      }

      const overlappingSpaceReservation =
        await tx.reservation.findFirst({
          where: {
            spaceId,
            status: "CONFIRMED",
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
        });

      if (overlappingSpaceReservation) {
        throw new Error("SPACE_TIME_CONFLICT");
      }

      const overlappingUserReservation =
        await tx.reservation.findFirst({
          where: {
            userId: session.userId,
            status: "CONFIRMED",
            startAt: { lt: endAt },
            endAt: { gt: startAt },
          },
        });

      if (overlappingUserReservation) {
        throw new Error("USER_TIME_CONFLICT");
      }

      const futureReservations = await tx.reservation.count({
        where: {
          userId: session.userId,
          status: "CONFIRMED",
          startAt: { gt: now },
        },
      });

      if (futureReservations >= 3) {
        throw new Error("RESERVATION_LIMIT");
      }

      const totalPrice = space.pricePerHour.mul(durationHours);

      return tx.reservation.create({
        data: {
          userId: session.userId,
          spaceId,
          startAt,
          endAt,
          totalPrice,
          idempotencyKey,
        },
        include: { space: true },
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reserva creada correctamente",
        data: reservation,
      },
      { status: 201 },
    );
  } catch (error) {
    // Si dos peticiones simultáneas usan la misma clave.
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const existingReservation = await prisma.reservation.findFirst({
        where: {
          userId: session.userId,
          idempotencyKey,
        },
        include: { space: true },
      });

      if (existingReservation) {
        if (
          existingReservation.spaceId !== spaceIdFromRequest ||
          existingReservation.startAt.getTime() !== startAtFromRequest ||
          existingReservation.endAt.getTime() !== endAtFromRequest
        ) {
          return NextResponse.json(
            {
              success: false,
              message: "La clave ya fue utilizada con otros datos",
            },
            { status: 409 },
          );
        }

        return NextResponse.json(
          {
            success: true,
            message: "Esta reserva ya había sido creada",
            data: existingReservation,
          },
          { status: 200 },
        );
      }
    }

    const errors: Record<string, { status: number; message: string }> = {
      SPACE_NOT_AVAILABLE: {
        status: 404,
        message: "El espacio no existe o está desactivado",
      },
      SPACE_TIME_CONFLICT: {
        status: 409,
        message: "El espacio ya está reservado en ese horario",
      },
      USER_TIME_CONFLICT: {
        status: 409,
        message: "Ya tienes otra reserva en ese horario",
      },
      RESERVATION_LIMIT: {
        status: 409,
        message: "Ya tienes 3 reservas futuras confirmadas",
      },
    };

    if (error instanceof Error && errors[error.message]) {
      const knownError = errors[error.message];

      return NextResponse.json(
        { success: false, message: knownError.message },
        { status: knownError.status },
      );
    }

    console.error("Create reservation error:", error);

    return NextResponse.json(
      { success: false, message: "Error al crear la reserva" },
      { status: 500 },
    );
  }
}
