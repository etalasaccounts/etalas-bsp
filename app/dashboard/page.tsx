import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare, 
  Users, 
  Bell, 
  TrendingUp, 
  ArrowRight,
  Activity,
  Calendar,
  Clock,
  Zap,
  Target,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    return <div>Loading...</div>
  }

  // Get statistics with error handling
  let stats = {
    totalConversations: 0,
    totalMembers: 1,
    unreadNotifications: 0,
    activeConversations: 0
  }

  try {
    if (user.workspaceId) {
      const [totalConversations, totalMembers, unreadNotifications, activeConversations] = await Promise.all([
        prisma.conversation.count({
          where: { workspaceId: user.workspaceId }
        }),
        prisma.user.count({
          where: { workspaceId: user.workspaceId }
        }),
        prisma.notification.count({
          where: { 
            userId: user.id,
            read: false
          }
        }),
        prisma.conversation.count({
          where: { 
            workspaceId: user.workspaceId,
            status: "open"
          }
        })
      ])

      stats = {
        totalConversations,
        totalMembers,
        unreadNotifications,
        activeConversations
      }
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
  }

  const statsCards = [
    {
      title: "Total Percakapan",
      value: stats.totalConversations,
      description: "Semua percakapan di workspace",
      icon: MessageSquare,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      title: "Percakapan Aktif",
      value: stats.activeConversations,
      description: "Percakapan yang masih terbuka",
      icon: TrendingUp,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-100",
      textColor: "text-green-600"
    },
    {
      title: "Anggota Tim",
      value: stats.totalMembers,
      description: "Total anggota workspace",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      title: "Notifikasi",
      value: stats.unreadNotifications,
      description: "Notifikasi belum dibaca",
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-100",
      textColor: "text-orange-600"
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : user.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  Selamat datang, {user.name || user.email}! 👋
                </h1>
                <p className="text-green-100 text-lg">
                  Kelola percakapan WhatsApp Business Anda dengan mudah
                </p>
              </div>
            </div>
            
            <div className="hidden md:flex flex-col items-end gap-2">
              <Badge className="bg-white/20 text-white border-white/20">
                Role: {user.role === "admin" ? "Administrator" : "Karyawan"}
              </Badge>
              <div className="flex items-center gap-2 text-green-100 text-sm">
                <Activity className="w-4 h-4" />
                <span>Status: Aktif</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl translate-y-24 -translate-x-24"></div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {index === 0 ? "Total" : index === 1 ? "Aktif" : index === 2 ? "Tim" : "Pending"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              Aksi Cepat
            </CardTitle>
            <CardDescription>
              Mulai gunakan fitur-fitur utama WhatsAppin Aja
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/dashboard/connections">
              <Button variant="outline" className="w-full justify-between h-12 hover:bg-green-50 hover:border-green-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Setup WhatsApp</p>
                    <p className="text-xs text-gray-500">Hubungkan nomor bisnis Anda</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>
            </Link>
            
            {user.role === "admin" && (
              <Link href="/dashboard/team">
                <Button variant="outline" className="w-full justify-between h-12 hover:bg-purple-50 hover:border-purple-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Undang Tim</p>
                      <p className="text-xs text-gray-500">Tambahkan anggota tim</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
              </Link>
            )}
            
            <Link href="/dashboard/chat">
              <Button variant="outline" className="w-full justify-between h-12 hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Lihat Percakapan</p>
                    <p className="text-xs text-gray-500">Kelola chat pelanggan</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              Insights Hari Ini
            </CardTitle>
            <CardDescription>
              Ringkasan performa workspace Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Response Rate</p>
                  <p className="text-sm text-gray-600">Tingkat respons tim</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">98%</p>
                <p className="text-xs text-green-500">Excellent</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Avg Response Time</p>
                  <p className="text-sm text-gray-600">Waktu rata-rata respons</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">2.3m</p>
                <p className="text-xs text-blue-500">Fast</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Todays Messages</p>
                  <p className="text-sm text-gray-600">Pesan hari ini</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">{stats.totalConversations}</p>
                <p className="text-xs text-purple-500">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Conversations Preview */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                Percakapan Terbaru
              </CardTitle>
              <CardDescription>
                Percakapan terbaru yang memerlukan perhatian
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/chat">
                Lihat Semua
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.totalConversations === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum Ada Percakapan</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Percakapan akan muncul di sini setelah pelanggan mengirim pesan WhatsApp ke nomor bisnis Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild>
                  <Link href="/dashboard/connections">
                    Setup WhatsApp Connection
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/chat">
                    Lihat Chat Management
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-500">
                Anda memiliki {stats.totalConversations} percakapan. 
                <Link href="/dashboard/chat" className="text-green-600 hover:underline ml-1">
                  Lihat semua percakapan →
                </Link>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}