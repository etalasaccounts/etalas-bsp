import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  const user = await getCurrentUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
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
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
        assignedTo: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil percakapan" },
      { status: 500 }
    )
  }
}
