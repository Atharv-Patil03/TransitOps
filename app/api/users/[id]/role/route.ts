import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Verify the requester is an authenticated admin
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const requester = await verifyToken(token);
  if (!requester || requester.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden: Only admins can change roles" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const { role } = await req.json();

  const allowed = ["PASSENGER", "DRIVER", "ADMIN"];
  if (!role || !allowed.includes(role)) {
    return NextResponse.json(
      { error: `role must be one of: ${allowed.join(", ")}` },
      { status: 400 }
    );
  }

  // 2. Prevent admin from demoting themselves
  if (id === requester.userId && role !== "ADMIN") {
    return NextResponse.json(
      { error: "You cannot demote yourself" },
      { status: 400 }
    );
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(updated);
}
