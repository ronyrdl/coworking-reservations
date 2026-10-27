
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  setAuthCookies,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const oldToken = request.cookies.get("refreshToken")?.value;

    if (!oldToken) {
      return NextResponse.json(
        { success: false, message: "No hay sesión activa" },
        { status: 401 },
      );
    }

    const tokenHash = hashToken(oldToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Sesión inválida o expirada" },
        { status: 401 },
      );
    }

    const newRefreshToken = createRefreshToken();

    await prisma.$transaction([
      prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      }),
      prisma.refreshToken.create({
        data: {
          tokenHash: hashToken(newRefreshToken),
          userId: storedToken.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const accessToken = await createAccessToken(
      storedToken.user.id,
      storedToken.user.role,
    );

    const response = NextResponse.json({
      success: true,
      message: "Sesión renovada correctamente",
    });

    setAuthCookies(response, accessToken, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Refresh error:", error);

    return NextResponse.json(
      { success: false, message: "Error al renovar la sesión" },
      { status: 500 },
    );
  }
}
