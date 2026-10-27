
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const spaceSchema = z.object({
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10).max(500),
  type: z.string().trim().min(2).max(50),
  capacity: z.number().int().min(1).max(100),
  pricePerHour: z.number().positive(),
  imageUrl: z.string().url(),
});


export async function GET() {
  try {
    const { error } = await requireAdmin();

    const spaces = await prisma.space.findMany({
      where: error ? { isActive: true } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: spaces,
    });
  } catch (error) {
    console.error("Get spaces error:", error);

    return NextResponse.json(
      { success: false, message: "Error al obtener espacios" },
      { status: 500 },
    );
  }
}


export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();

  if (error) {
    return error;
  }

  try {
    const body: unknown = await request.json();
    const validation = spaceSchema.safeParse(body);

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

    const space = await prisma.space.create({
      data: validation.data,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Espacio creado correctamente",
        data: space,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create space error:", error);

    return NextResponse.json(
      { success: false, message: "Error al crear espacio" },
      { status: 500 },
    );
  }
}
