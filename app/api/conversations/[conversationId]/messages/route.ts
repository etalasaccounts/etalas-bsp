import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { content } = await request.json()

    // Check if user has access to this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.conversationId,
        workspaceId: user.workspaceId,
        ...(user.role === "karyawan" && {
          assignedToId: user.id,
        }),
      },
      include: {
        workspace: {
          include: {
            whatsappConnections: {
              where: { isActive: true },
              take: 1,
            },
          },
        },
      },
    })

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 })
    }

    // Create message in database
    const message = await prisma.message.create({
      data: {
        content,
        fromCustomer: false,
        conversationId: params.conversationId,
      },
    })

    // TODO: Send message via WhatsApp API
    // This would require calling the WhatsApp Business API
    // with the connection's access token

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim pesan" },
      { status: 500 }
    )
  }
}
