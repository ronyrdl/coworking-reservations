
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const updateSpaceSchema = z.object({
  name: z.string().trim().min(3).max(100).optional(),
  description: z.string().trim().min(10).max(500).optional(),
  type: z.string().trim().min(2).max(50).optional(),
  capacity: z.number().int().min(1).max(100).optional(),
  pricePerHour: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Consultar detalle de un espacio (público).
export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    const { id } = await params;

    if (!id.trim()) {
      return NextResponse.json(
        { success: false, message: "ID de espacio inválido" },
        { status: 400 },
      );
    }

    const space = await prisma.space.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    if (!space) {
      return NextResponse.json(
        { success: false, message: "Espacio no encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: space,
    });
  } catch (error) {
    console.error("Get space error:", error);

    return NextResponse.json(
      { success: false, message: "Error al consultar el espacio" },
      { status: 500 },
    );
  }
}

// Actualizar un espacio (solo administrador).
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const body: unknown = await request.json();

    const validation = updateSpaceSchema.safeParse(body);

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

    if (Object.keys(validation.data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No hay datos para actualizar" },
        { status: 400 },
      );
    }

    if (validation.data.isActive === false) {
      const futureReservations = await prisma.reservation.count({
        where: {
          spaceId: id,
          status: "CONFIRMED",
          startAt: { gt: new Date() },
        },
      });

      if (futureReservations > 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "No puedes desactivar un espacio con reservas futuras confirmadas",
          },
          { status: 409 },
        );
      }
    }

    const space = await prisma.space.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json({
      success: true,
      message: "Espacio actualizado correctamente",
      data: space,
    });
  } catch (error) {
    console.error("Update space error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Error al actualizar el espacio",
      },
      { status: 500 },
    );
  }
}
