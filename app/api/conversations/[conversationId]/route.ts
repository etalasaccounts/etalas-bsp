import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { conversationId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId } = params

    // For demo purposes, return mock data if conversation doesn't exist in database
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        workspaceId: user.workspaceId || undefined
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" }
        },
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // If no conversation found, return mock data for demo
    if (!conversation) {
      const mockConversation = {
        id: conversationId,
        customerName: "Waldemar Mannering",
        customerPhone: "+62812345678",
        status: "open",
        workspaceId: user.workspaceId,
        assignedToId: user.id,
        assignedTo: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        messages: [
          {
            id: "1",
            content: "How can we help? We're here for you!",
            fromCustomer: false,
            createdAt: new Date(Date.now() - 60000 * 60).toISOString(),
            conversationId: conversationId
          },
          {
            id: "2",
            content: "Hey, I am looking for the best admin template. Could you please help me to find it out?",
            fromCustomer: true,
            createdAt: new Date(Date.now() - 60000 * 50).toISOString(),
            conversationId: conversationId
          },
          {
            id: "3",
            content: "It should be MUI v5 compatible.",
            fromCustomer: true,
            createdAt: new Date(Date.now() - 60000 * 49).toISOString(),
            conversationId: conversationId
          },
          {
            id: "4",
            content: "Absolutely! This admin template is built with MUI!",
            fromCustomer: false,
            createdAt: new Date(Date.now() - 60000 * 30).toISOString(),
            conversationId: conversationId
          },
          {
            id: "5",
            content: "Looks clean and fresh UI. 😍 It's perfect for my next project. How can I purchase it?",
            fromCustomer: true,
            createdAt: new Date(Date.now() - 60000 * 10).toISOString(),
            conversationId: conversationId
          },
          {
            id: "6",
            content: "Thanks, From our official site 😃",
            fromCustomer: false,
            createdAt: new Date(Date.now() - 60000 * 5).toISOString(),
            conversationId: conversationId
          }
        ],
        createdAt: new Date(Date.now() - 60000 * 120).toISOString(),
        updatedAt: new Date().toISOString()
      }

      return NextResponse.json(mockConversation)
    }

    return NextResponse.json(conversation)

  } catch (error) {
    console.error("Error fetching conversation:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}