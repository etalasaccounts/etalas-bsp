"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlus } from "lucide-react"

interface TeamMember {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string>("")

  useEffect(() => {
    fetchTeamMembers()
    fetchCurrentUser()
  }, [])

  async function fetchCurrentUser() {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const user = await response.json()
        setUserRole(user.role)
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
    }
  }

  async function fetchTeamMembers() {
    try {
      const response = await fetch("/api/team/members")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error("Error fetching team members:", error)
    }
  }

  async function sendInvitation(e: React.FormEvent) {
    e.preventDefault()
    setIsInviting(true)

    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail }),
      })

      if (response.ok) {
        setInviteEmail("")
        setDialogOpen(false)
        // Optionally refresh the page or show success message
      } else {
        const error = await response.json()
        alert(error.message || "Gagal mengirim undangan")
      }
    } catch (error) {
      console.error("Error sending invitation:", error)
      alert("Terjadi kesalahan saat mengirim undangan")
    } finally {
      setIsInviting(false)
    }
  }

  // Only show this page to admins
  if (userRole && userRole !== "admin") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Akses Ditolak</h2>
        <p className="mt-2 text-gray-600">
          Hanya admin yang dapat mengakses halaman ini
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manajemen Tim
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Kelola anggota tim dan kirim undangan
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Anggota Tim</CardTitle>
            <CardDescription>
              Daftar semua anggota dalam workspace Anda
            </CardDescription>
          </div>
          {userRole === "admin" && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Undang Anggota
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={sendInvitation}>
                  <DialogHeader>
                    <DialogTitle>Undang Anggota Tim Baru</DialogTitle>
                    <DialogDescription>
                      Masukkan alamat email untuk mengirim undangan bergabung ke workspace
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      type="email"
                      placeholder="email@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit" disabled={isInviting}>
                      {isInviting ? "Mengirim..." : "Kirim Undangan"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.name || "Belum diatur"}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={member.role === "admin" ? "default" : "secondary"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}