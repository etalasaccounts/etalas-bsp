"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Alert,
  AlertDescription 
} from "@/components/ui"
import { MessageCircle, Eye, EyeOff, CheckCircle, Users } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [invitationData, setInvitationData] = useState<{email: string, workspaceId: string} | null>(null)

  const invitationToken = searchParams.get("token")

  useEffect(() => {
    if (invitationToken) {
      // Validate invitation token
      fetch(`/api/invitations/validate?token=${invitationToken}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setInvitationData({
              email: data.email,
              workspaceId: data.workspaceId
            })
          } else {
            setError("Link undangan tidak valid atau sudah kadaluarsa")
          }
        })
        .catch(() => {
          setError("Terjadi kesalahan saat memvalidasi undangan")
        })
    }
  }, [invitationToken])

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const workspaceName = formData.get("workspaceName") as string

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            workspaceName,
            invitationToken,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || "Terjadi kesalahan saat mendaftar")
          return
        }

        // Auto login after registration
        const loginResponse = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        if (loginResponse.ok) {
          window.location.href = "/dashboard"
        } else {
          setError("Pendaftaran berhasil, silakan login manual")
          setTimeout(() => {
            router.push("/login")
          }, 2000)
        }
      } catch (error) {
        setError("Terjadi kesalahan, silakan coba lagi")
      }
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 via-green-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center space-y-6">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10" />
            </div>
            
            <h3 className="text-4xl font-bold">
              {invitationToken ? "Bergabung dengan Tim" : "Mulai Perjalanan Anda"}
            </h3>
            <p className="text-xl text-green-100">
              {invitationToken 
                ? "Anda telah diundang untuk bergabung dengan workspace yang menakjubkan!"
                : "Ribuan bisnis sudah mempercayai WhatsAppin Aja untuk mengelola WhatsApp Business mereka"
              }
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Setup dalam 5 menit</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Gratis 14 hari trial</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <CheckCircle className="w-5 h-5" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {invitationToken ? "Bergabung dengan Tim" : "Buat Akun Baru"}
            </h2>
            <p className="mt-2 text-gray-600">
              {invitationToken 
                ? "Lengkapi informasi untuk bergabung"
                : "Mulai gratis, upgrade kapan saja"
              }
            </p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center space-y-2 hidden lg:block">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {invitationToken ? "Bergabung dengan Tim" : "Buat Akun Baru"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {invitationToken 
                  ? "Lengkapi informasi untuk bergabung dengan workspace"
                  : "Mulai gratis, upgrade kapan saja"
                }
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                
                {invitationToken && invitationData && (
                  <Alert className="border-green-200 bg-green-50">
                    <Users className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Anda diundang untuk bergabung sebagai <strong>karyawan</strong>
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Nama Lengkap</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    required
                    disabled={isPending}
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@perusahaan.com"
                    required
                    disabled={isPending || !!invitationData}
                    defaultValue={invitationData?.email || ""}
                    className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isPending}
                      minLength={6}
                      className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">Minimal 6 karakter</p>
                </div>
                
                {!invitationToken && (
                  <div className="space-y-2">
                    <Label htmlFor="workspaceName" className="text-gray-700 font-medium">Nama Workspace</Label>
                    <Input
                      id="workspaceName"
                      name="workspaceName"
                      type="text"
                      placeholder="Nama Perusahaan Anda"
                      required
                      disabled={isPending}
                      className="h-12 border-gray-200 focus:border-green-500 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500">Anda akan menjadi admin workspace ini</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg text-white font-medium" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Memproses...
                    </div>
                  ) : (
                    invitationToken ? "Bergabung dengan Tim" : "Buat Akun Gratis"
                  )}
                </Button>
              </CardContent>
              
              <CardFooter className="text-center pb-6">
                <p className="text-sm text-gray-600">
                  Sudah punya akun?{" "}
                  <Link href="/login" className="font-medium text-green-600 hover:text-green-700 hover:underline">
                    Masuk disini
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}