import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  MessageSquare,
  Settings,
  Filter
} from "lucide-react"

export default async function NotificationsPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return <div>Loading...</div>
  }

  // Mock notifications data
  const notifications = [
    {
      id: "1",
      title: "New message from Waldemar",
      message: "Hey, I have a question about the admin template...",
      time: "2 minutes ago",
      type: "message",
      read: false,
      avatar: "/avatars/waldemar.png"
    },
    {
      id: "2",
      title: "Team meeting reminder",
      message: "Don't forget about the team meeting at 3 PM today",
      time: "1 hour ago", 
      type: "reminder",
      read: false,
      avatar: null
    },
    {
      id: "3",
      title: "New user registered",
      message: "John Smith has registered to your workspace",
      time: "3 hours ago",
      type: "info",
      read: true,
      avatar: "/avatars/john.png"
    },
    {
      id: "4",
      title: "System maintenance",
      message: "Scheduled maintenance will occur tonight from 2-4 AM",
      time: "1 day ago",
      type: "warning",
      read: true,
      avatar: null
    },
    {
      id: "5",
      title: "Payment successful",
      message: "Your monthly subscription has been renewed",
      time: "2 days ago",
      type: "success",
      read: true,
      avatar: null
    }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-5 h-5 text-blue-600" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'reminder':
        return <Bell className="w-5 h-5 text-purple-600" />
      default:
        return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'message':
        return 'bg-blue-100'
      case 'success':
        return 'bg-green-100'
      case 'warning':
        return 'bg-orange-100'
      case 'reminder':
        return 'bg-purple-100'
      default:
        return 'bg-gray-100'
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="container mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated with your latest activities</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'message').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reminders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.type === 'reminder').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-600" />
              All Notifications
            </CardTitle>
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {notification.avatar ? (
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={notification.avatar} alt="" />
                      <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">
                        {notification.title.split(' ')[2]?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationBg(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm font-medium truncate ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <Badge variant="default" className="h-2 w-2 p-0 rounded-full bg-blue-500"></Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      {notification.message}
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
