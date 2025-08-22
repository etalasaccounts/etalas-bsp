import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  MessageCircle, 
  Clock, 
  User, 
  Phone, 
  MoreVertical,
  Search,
  Filter,
  Plus
} from "lucide-react"

export default async function ChatPage() {
  const user = await getCurrentUser()
  
  if (!user?.workspaceId) {
    return <div>Loading...</div>
  }

  // Fetch conversations based on user role
  const whereClause = user.role === "admin" 
    ? { workspaceId: user.workspaceId }
    : { 
        workspaceId: user.workspaceId,
        assignedToId: user.id 
      }

  const conversations = await prisma.conversation.findMany({
    where: whereClause,
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      assignedTo: {
        select: {
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return "Baru saja"
    if (minutes < 60) return `${minutes}m yang lalu`
    if (hours < 24) return `${hours}j yang lalu`
    return date.toLocaleDateString("id-ID")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Percakapan
          </h1>
          <p className="text-gray-600 mt-1">
            {user.role === "admin" 
              ? "Kelola semua percakapan dalam workspace" 
              : "Percakapan yang ditugaskan kepada Anda"}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Cari
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Chat</p>
                <p className="text-2xl font-bold text-gray-900">{conversations.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.filter(c => c.status === "open").length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.filter(c => c.assignedTo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Belum Ditugaskan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conversations.filter(c => !c.assignedTo).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Plus className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Daftar Percakapan
          </CardTitle>
          <CardDescription>
            {conversations.length === 0 
              ? "Belum ada percakapan. Percakapan akan muncul setelah pelanggan mengirim pesan WhatsApp."
              : `Menampilkan ${conversations.length} percakapan`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Percakapan</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Percakapan akan muncul di sini setelah pelanggan mengirim pesan WhatsApp 
                ke nomor bisnis Anda.
              </p>
              <Button asChild>
                <Link href="/dashboard/connections">
                  Setup WhatsApp Connection
                </Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conversation, index) => (
                <Link
                  key={conversation.id}
                  href={`/dashboard/chat/${conversation.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <Avatar className="w-12 h-12">
                          <AvatarImage src="" alt="" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                            {getInitials(conversation.customerName || conversation.customerPhone)}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.customerName || "Pelanggan"}
                            </h3>
                            <Badge 
                              variant={conversation.status === "open" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {conversation.status === "open" ? "Aktif" : "Selesai"}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Phone className="w-4 h-4" />
                            <span>{conversation.customerPhone}</span>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {conversation.messages[0]?.content || "Belum ada pesan"}
                          </p>
                          
                          {conversation.assignedTo && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-green-600" />
                              </div>
                              <span className="text-xs text-green-600 font-medium">
                                {conversation.assignedTo.name || conversation.assignedTo.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <span className="text-xs text-gray-400">
                          {conversation.messages[0] ? formatTime(new Date(conversation.messages[0].createdAt)) : ""}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {conversation._count.messages} pesan
                        </Badge>
                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
