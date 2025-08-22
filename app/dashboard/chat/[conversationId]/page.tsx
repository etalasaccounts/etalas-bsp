"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Send, 
  Phone, 
  MoreVertical, 
  ArrowLeft, 
  Clock,
  Check,
  CheckCheck,
  User
} from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  fromCustomer: boolean
  createdAt: string
}

interface Conversation {
  id: string
  customerPhone: string
  customerName: string | null
  status: string
  messages: Message[]
  assignedTo?: {
    name: string | null
    email: string
  } | null
}

export default function ConversationDetailPage() {
  const params = useParams()
  const conversationId = params.conversationId as string
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversation()
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchConversation, 5000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversation?.messages])

  async function fetchConversation() {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setConversation(data)
      }
    } catch (error) {
      console.error("Error fetching conversation:", error)
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSending(true)
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchConversation()
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("id-ID", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400 animate-pulse" />
          </div>
          <p className="text-gray-500">Memuat percakapan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-200px)] flex flex-col">
      {/* Header */}
      <Card className="border-0 shadow-lg mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/chat">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              
              <Avatar className="w-12 h-12">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                  {getInitials(conversation.customerName || conversation.customerPhone)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <CardTitle className="text-lg">
                  {conversation.customerName || "Pelanggan"}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="w-4 h-4" />
                  <span>{conversation.customerPhone}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Badge variant={conversation.status === "open" ? "default" : "secondary"}>
                {conversation.status === "open" ? "Aktif" : "Selesai"}
              </Badge>
              
              {conversation.assignedTo && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                  <User className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    {conversation.assignedTo.name || conversation.assignedTo.email}
                  </span>
                </div>
              )}
              
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Messages */}
      <Card className="flex-1 flex flex-col border-0 shadow-lg">
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-4">
              {conversation.messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Belum ada pesan dalam percakapan ini</p>
                </div>
              ) : (
                conversation.messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.fromCustomer ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[70%] ${message.fromCustomer ? "" : "flex-row-reverse"}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={`text-xs font-semibold ${
                          message.fromCustomer 
                            ? "bg-gray-200 text-gray-700" 
                            : "bg-green-500 text-white"
                        }`}>
                          {message.fromCustomer ? "C" : "A"}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.fromCustomer
                            ? "bg-gray-100 text-gray-900"
                            : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${
                          message.fromCustomer ? "text-gray-500" : "text-green-100"
                        }`}>
                          <span className="text-xs">{formatTime(message.createdAt)}</span>
                          {!message.fromCustomer && (
                            <CheckCheck className="w-3 h-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          <Separator />
          
          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  disabled={sending || conversation.status !== "open"}
                  className="pr-12 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                {newMessage && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {newMessage.length}/1000
                  </div>
                )}
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={sending || !newMessage.trim() || conversation.status !== "open"}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg px-6"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {conversation.status !== "open" && (
              <p className="text-xs text-gray-400 mt-2">
                Percakapan ini sudah ditutup. Tidak dapat mengirim pesan.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
