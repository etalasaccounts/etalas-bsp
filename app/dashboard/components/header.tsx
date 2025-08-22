"use client"

import { usePathname } from "next/navigation"
import { Search, Bell, Settings, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const getPageTitle = (pathname: string) => {
  if (pathname === "/dashboard") return "Dashboard"
  if (pathname === "/dashboard/chat") return "Chat"
  if (pathname === "/dashboard/team") return "Users"
  if (pathname === "/dashboard/email") return "Email"
  if (pathname === "/dashboard/calendar") return "Calendar"
  if (pathname === "/dashboard/notifications") return "Notifications"
  if (pathname === "/dashboard/connections") return "Connection"
  if (pathname === "/dashboard/settings") return "Roles & Permissions"
  return "Dashboard"
}

export function Header() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Search className="h-4 w-4" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              1
            </Badge>
          </Button>
          
          {/* Settings */}
          <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
            <Settings className="h-4 w-4" />
          </Button>
          
          {/* User Avatar */}
          <div className="flex items-center gap-2 ml-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/admin.png" alt="Admin" />
              <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                HA
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
