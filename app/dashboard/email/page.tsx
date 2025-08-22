import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Mail, 
  Inbox, 
  Send, 
  Archive, 
  Trash2, 
  Star,
  Search,
  Plus,
  MoreVertical
} from "lucide-react"

export default async function EmailPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return <div>Loading...</div>
  }

  // Mock email data
  const emails = [
    {
      id: "1",
      from: "John Doe",
      subject: "Meeting Schedule Update",
      preview: "Hi there! I wanted to update you on our meeting schedule...",
      time: "10:30 AM",
      unread: true,
      starred: false,
      avatar: "/avatars/john.png"
    },
    {
      id: "2", 
      from: "Sarah Wilson",
      subject: "Project Proposal Review",
      preview: "Please find attached the project proposal for your review...",
      time: "Yesterday",
      unread: false,
      starred: true,
      avatar: "/avatars/sarah.png"
    },
    {
      id: "3",
      from: "Marketing Team",
      subject: "Newsletter Campaign Results",
      preview: "Great news! Our latest newsletter campaign has achieved...",
      time: "2 days ago", 
      unread: false,
      starred: false,
      avatar: "/avatars/marketing.png"
    }
  ]

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email</h1>
          <p className="text-gray-600 mt-1">Manage your email communications</p>
        </div>
        
        <div className="flex gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inbox</p>
                <p className="text-2xl font-bold text-gray-900">48</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Inbox className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Sent</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Starred</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trash</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-600" />
              Recent Emails
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {emails.map((email) => (
              <div 
                key={email.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  email.unread ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={email.avatar} alt={email.from} />
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                      {email.from.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-medium truncate ${
                          email.unread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {email.from}
                        </h3>
                        {email.unread && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full bg-blue-500"></Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{email.time}</span>
                        {email.starred && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                    
                    <h4 className={`text-sm mb-1 truncate ${
                      email.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                    }`}>
                      {email.subject}
                    </h4>
                    
                    <p className="text-sm text-gray-500 truncate">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
