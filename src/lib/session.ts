
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth";

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  return await verifyAccessToken(accessToken);
}

export async function requireAuth() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "No autenticado" },
        { status: 401 },
      ),
    };
  }

  return { session, error: null };
}

export async function requireAdmin() {
  const result = await requireAuth();

  if (result.error) {
    return result;
  }

  if (result.session.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json(
        { success: false, message: "No tienes permisos" },
        { status: 403 },
      ),
    };
  }

  return result;
}
