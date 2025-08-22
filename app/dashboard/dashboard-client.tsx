"use client"

import { usePathname } from "next/navigation"
import { Header } from "./components/header"

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Hide header for chat page
  const hideHeader = pathname === "/dashboard/chat"

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {!hideHeader && <Header />}
      <main className="flex-1 overflow-hidden bg-white">
        {children}
      </main>
    </div>
  )
}
