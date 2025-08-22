"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MessageSquare,
  Users,
  Settings,
  Webhook,
  LogOut,
  Calendar,
  Mail,
  Bell,
  Search,
  MoreHorizontal,
} from "lucide-react"

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    count: null,
  },
  {
    name: "Chats",
    href: "/dashboard/chat",
    icon: MessageSquare,
    count: 5,
  },
  {
    name: "Users",
    href: "/dashboard/team",
    icon: Users,
    adminOnly: true,
    count: null,
  },
  {
    name: "Email",
    href: "/dashboard/email",
    icon: Mail,
    count: 48,
  },
  {
    name: "Calendar",
    href: "/dashboard/calendar",
    icon: Calendar,
    count: null,
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    count: null,
  },
  {
    name: "Connection",
    href: "/dashboard/connections",
    icon: Webhook,
    adminOnly: true,
    count: null,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">WhatsAppin Aja</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search (Ctrl+/)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="mb-6">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            APPLICATION
          </span>
        </div>
        
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-green-50 text-green-700 border-r-2 border-green-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.count && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "h-5 px-2 text-xs",
                      isActive ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                    )}
                  >
                    {item.count}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Roles & Permissions */}
        <div className="mt-8 mb-4">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
            PAGES
          </span>
        </div>
        
        <nav className="space-y-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
              pathname === "/dashboard/settings"
                ? "bg-purple-50 text-purple-700 border-r-2 border-purple-500"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Settings className="h-4 w-4" />
            <span>Roles & Permissions</span>
          </Link>
        </nav>
      </div>
      
              {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/avatars/hilmi.png" alt="Hilmi Arlugrah" />
            <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold">HA</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Hilmi Arlugrah</p>
            <p className="text-xs text-gray-500 truncate">Administrator</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}