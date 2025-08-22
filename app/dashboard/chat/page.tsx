"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChatSkeleton } from "@/components/skeletons/chat-skeleton"
import { 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Smile,
  Paperclip,
  Send,
  Mic,
  CheckCheck,
  Users,
  Settings,
  MessageCircle,
  Archive,
  Star,
  UserPlus
} from "lucide-react"

interface Conversation {
  id: string
  customerName: string
  customerPhone: string
  lastMessage?: string
  time: string
  status: string
  avatar?: string
  unread: number
  messages?: Message[]
  assignedTo?: {
    id: string
    name: string
    email: string
  }
}

interface Message {
  id: string
  content: string
  fromCustomer: boolean
  createdAt: string
  conversationId: string
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      setShowContactInfo(false)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/conversations")
      if (response.ok) {
        const data = await response.json()
        setConversations(data)
        if (data.length > 0) {
          setSelectedConversation(data[0])
        }
      } else {
        console.error("Failed to fetch conversations")
      }
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (response.ok) {
        setNewMessage("")
        fetchMessages(selectedConversation.id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("id-ID", { 
      hour: "2-digit", 
      minute: "2-digit" 
    })
  }

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo)
  }

  if (loading) {
    return <ChatSkeleton />
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Chat List - Left Panel */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0 relative overflow-hidden">
        {/* Chat List Header - Fixed */}
        <div className="fixed left-80 top-0 w-80 z-30 p-4 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Chats</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>New chat</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="mr-2 h-4 w-4" />
                  <span>New group</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Add contact</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Starred messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Archived chats</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for contact..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Spacer untuk fixed header */}
        <div className="h-32"></div>
        
        {/* Chat List - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {conversations.map((chat) => (
              <div
                key={chat.id}
                className={`group relative flex items-center p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                  selectedConversation?.id === chat.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => setSelectedConversation(chat)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} alt={chat.customerName} />
                    <AvatarFallback className="bg-gray-300 text-gray-700 font-semibold">
                      {chat.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 ml-3 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {chat.customerName}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
                          
                          {/* Dropdown Menu untuk Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Archive className="mr-2 h-4 w-4" />
                                <span>Archive chat</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Mark as unread</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Star className="mr-2 h-4 w-4" />
                                <span>Star chat</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Chat info</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Assign to agent</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={(e) => e.stopPropagation()} 
                                className="text-red-600 focus:text-red-600"
                              >
                                <span>Delete chat</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate pr-2">{chat.lastMessage}</p>
                        {chat.unread > 0 && (
                          <Badge className="bg-green-500 text-white h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full flex-shrink-0">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area - Middle Panel */}
      <div className="flex-1 flex flex-col bg-white relative min-w-0">
        {/* Spacer untuk fixed chat header */}
        <div className="h-20"></div>
        
        {selectedConversation ? (
          <>
            {/* Chat Header - Fixed */}
            <div className="fixed left-80 top-0 z-40 p-4 border-b border-gray-200 bg-white shadow-sm" style={{ left: 'calc(320px + 320px)', right: showContactInfo ? '320px' : '0px' }}>
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={toggleContactInfo}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.customerName} />
                    <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                      {selectedConversation.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{selectedConversation.customerName}</h3>
                    <p className="text-xs text-green-600">online</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <Search className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={toggleContactInfo}>
                        <Info className="mr-2 h-4 w-4" />
                        <span>Contact info</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Select messages</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Phone className="mr-2 h-4 w-4" />
                        <span>Close chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Archive chat</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        <span>Star message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <span>Delete chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Messages Area - Scrollable */}
            <ScrollArea className="flex-1 w-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23f0f2f5'/%3e%3cpath d='m0 20v-20h20' fill='none' stroke='%23e5e7eb' stroke-width='1' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
              backgroundColor: '#f0f2f5'
            }}>
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex gap-2 ${!message.fromCustomer ? 'flex-row-reverse' : ''}`}>
                    <div className={`max-w-xs lg:max-w-2xl xl:max-w-4xl ${!message.fromCustomer ? 'text-right' : ''}`}>
                      <div className={`p-3 rounded-lg shadow-sm ${
                        !message.fromCustomer 
                          ? 'bg-green-500 text-white rounded-br-sm' 
                          : 'bg-white border border-gray-200 rounded-bl-sm'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <div className={`flex items-center gap-1 mt-1 ${!message.fromCustomer ? 'justify-end' : 'justify-start'}`}>
                          <p className={`text-xs ${!message.fromCustomer ? 'text-green-100' : 'text-gray-500'}`}>
                            {formatTime(message.createdAt)}
                          </p>
                          {!message.fromCustomer && (
                            <CheckCheck className="h-3 w-3 text-green-200" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Spacer untuk fixed message input */}
            <div className="h-20"></div>
            
            {/* Message Input - Fixed */}
            <div className="fixed bottom-0 left-80 z-50 p-4 border-t border-gray-200 bg-white shadow-lg" style={{ left: 'calc(320px + 320px)', right: showContactInfo ? '320px' : '0px' }}>
              <form onSubmit={sendMessage} className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="pr-12 py-2 rounded-full border-gray-300 focus:ring-green-500 focus:border-green-500"
                    disabled={sending}
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-gray-100">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="h-9 w-9 p-0 bg-green-500 hover:bg-green-600 rounded-full" 
                  disabled={sending || !newMessage.trim()}
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='%23f0f2f5'/%3e%3cpath d='m0 20v-20h20' fill='none' stroke='%23e5e7eb' stroke-width='1' opacity='0.3'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='100%25' height='100%25' fill='url(%23a)'/%3e%3c/svg%3e")`,
            backgroundColor: '#f0f2f5'
          }}>
            <div className="text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border">
                <Send className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsAppin Aja Web</h3>
              <p className="text-gray-500 max-w-md">Pilih percakapan dari daftar di sebelah kiri untuk mulai chatting dengan pelanggan Anda</p>
              <p className="text-xs text-gray-400 mt-4">Kirim dan terima pesan tanpa harus memegang ponsel Anda</p>
            </div>
          </div>
        )}
      </div>

      {/* User Info - Right Panel */}
      {showContactInfo && (
        <div className="w-80 border-l border-gray-200 bg-white flex flex-col flex-shrink-0 animate-in slide-in-from-right duration-300">
          {/* Contact Info Header - Fixed */}
          <div className="fixed right-0 top-0 w-80 z-30 p-4 border-b border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Contact Info</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-gray-100"
                onClick={toggleContactInfo}
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Spacer untuk fixed contact info header */}
          <div className="h-20"></div>
          
          {/* Contact Info Content - Scrollable */}
          <ScrollArea className="flex-1">
            <div className="p-6">
              {selectedConversation ? (
                <>
                  <div className="text-center mb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.customerName} />
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold text-xl">
                        {selectedConversation.customerName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedConversation.customerName}</h3>
                    <p className="text-sm text-gray-500">{selectedConversation.status}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">About</h4>
                      <p className="text-sm text-gray-600">
                        Customer yang sedang mencari template admin terbaik dengan teknologi modern.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Personal Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span className="text-gray-900">{selectedConversation.customerPhone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last seen:</span>
                          <span className="text-gray-900">{selectedConversation.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className="text-green-600">Online</span>
                        </div>
                        {selectedConversation.assignedTo && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Assigned to:</span>
                            <span className="text-gray-900">{selectedConversation.assignedTo.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Options</h4>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start text-sm">
                          <Badge className="w-4 h-4 mr-2" />
                          Add Tag
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm">
                          <Info className="w-4 h-4 mr-2" />
                          Important Contact
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm">
                          <Search className="w-4 h-4 mr-2" />
                          Shared Media
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-sm text-red-600 hover:text-red-700">
                          Delete Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Info className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Select a conversation to view contact details</p>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
