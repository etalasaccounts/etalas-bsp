import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20, // Limit to recent 20 notifications
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil notifikasi" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { notificationId, action } = await request.json()

    if (action === "markAsRead") {
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: user.id, // Ensure user owns this notification
        },
        data: {
          read: true,
        },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { message: "Action tidak valid" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui notifikasi" },
      { status: 500 }
    )
  }
}