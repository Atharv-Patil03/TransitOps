import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const routes = await prisma.route.findMany({
      include: { stops: { orderBy: { order: "asc" } }, trips: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(routes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch routes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, origin, destination, stops } = body;

    if (!name || !origin || !destination) {
      return NextResponse.json(
        { error: "name, origin, destination are required" },
        { status: 400 }
      );
    }

    const route = await prisma.route.create({
      data: {
        name,
        origin,
        destination,
        stops: stops
          ? {
              create: stops.map((s: { name: string; latitude: number; longitude: number; order: number }) => ({
                name: s.name,
                latitude: s.latitude,
                longitude: s.longitude,
                order: s.order,
              })),
            }
          : undefined,
      },
      include: { stops: true },
    });
    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create route" }, { status: 500 });
  }
}
