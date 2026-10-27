
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "No autenticado" },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { success: false, message: "Reserva no encontrada" },
        { status: 404 },
      );
    }

    // Un usuario solo puede cancelar sus propias reservas.
    if (
      session.role !== "ADMIN" &&
      reservation.userId !== session.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes permisos para cancelar esta reserva",
        },
        { status: 403 },
      );
    }

    if (reservation.status === "CANCELLED") {
      return NextResponse.json(
        { success: false, message: "La reserva ya está cancelada" },
        { status: 409 },
      );
    }

    const now = new Date();

    const hoursUntilReservation =
      (reservation.startAt.getTime() - now.getTime()) /
      (1000 * 60 * 60);

    // Los administradores pueden cancelar en cualquier momento.
    if (
      session.role !== "ADMIN" &&
      hoursUntilReservation < 2
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Solo puedes cancelar hasta 2 horas antes de la reserva",
        },
        { status: 409 },
      );
    }

    const cancelledReservation = await prisma.reservation.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: now,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Reserva cancelada correctamente",
      data: cancelledReservation,
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);

    return NextResponse.json(
      { success: false, message: "Error al cancelar la reserva" },
      { status: 500 },
    );
  }
}
