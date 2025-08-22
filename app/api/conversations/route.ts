import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let conversations = []

    try {
      // Try to get conversations from database
      const whereClause = user.role === "admin" 
        ? { workspaceId: user.workspaceId || undefined }
        : { 
            workspaceId: user.workspaceId || undefined,
            assignedToId: user.id 
          }

      conversations = await prisma.conversation.findMany({
        where: whereClause,
        include: {
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })

      // Transform database data to match frontend interface
      conversations = conversations.map(conv => ({
        id: conv.id,
        customerName: conv.customerName || "Unknown Customer",
        customerPhone: conv.customerPhone,
        lastMessage: conv.messages[0]?.content || "No messages yet",
        time: formatTime(conv.messages[0]?.createdAt || conv.createdAt),
        status: conv.status,
        avatar: null, // We'll generate this on frontend
        unread: 0, // TODO: Calculate unread messages
        assignedTo: conv.assignedTo
      }))

    } catch (dbError) {
      console.log("Database not available, using mock data")
      // If database fails, return mock data for demo
      conversations = [
        {
          id: "1",
          customerName: "Waldemar Mannering",
          customerPhone: "+62812345678",
          lastMessage: "Thanks, From our official site 😃",
          time: "1:45 PM",
          status: "Next js developer",
          avatar: "/avatars/waldemar.png",
          unread: 0,
          assignedTo: {
            id: user.id,
            name: user.name || user.email,
            email: user.email
          }
        },
        {
          id: "2", 
          customerName: "Felecia Rower",
          customerPhone: "+62812345679",
          lastMessage: "I will purchase it for sure. 👍",
          time: "8 Minutes",
          status: "UX Designer",
          avatar: "/avatars/felecia.png",
          unread: 1,
          assignedTo: null
        },
        {
          id: "3",
          customerName: "Calvin Moore", 
          customerPhone: "+62812345680",
          lastMessage: "If it takes long you can mail...",
          time: "1 Day",
          status: "UI Designer",
          avatar: "/avatars/calvin.png",
          unread: 0,
          assignedTo: null
        }
      ]
    }

    return NextResponse.json(conversations)

  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    )
  }
}

function formatTime(date: Date | string) {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days === 1) return "1 Day"
  if (days < 7) return `${days} Days`
  
  return d.toLocaleTimeString("id-ID", { 
    hour: "2-digit", 
    minute: "2-digit" 
  })
}
