import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await getCurrentUser()

  if (!user || !user.workspaceId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const members = await prisma.user.findMany({
      where: {
        workspaceId: user.workspaceId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching team members:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data anggota tim" },
      { status: 500 }
    )
  }
}