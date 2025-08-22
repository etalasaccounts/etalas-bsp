"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  Button, 
  Input, 
  Label, 
  Card, 
  CardContent, 
  CardFooter, 
  Alert,
  AlertDescription 
} from "@/components/ui"
import { MessageCircle, Eye, EyeOff, Bell } from "lucide-react"
import { Users } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || "Email atau password salah")
          return
        }

        // Redirect to dashboard
        window.location.href = "/dashboard"
      } catch (error) {
        setError("Terjadi kesalahan, silakan coba lagi")
      }
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Selamat Datang Kembali</h2>
            <p className="mt-2 text-gray-600">Masuk ke dashboard WhatsAppin Aja Anda</p>
          </div>

          {/* Form */}
          <Card className="border-0 shadow-xl">
            <form onSubmit={onSubmit}>
              <CardContent className="space-y-6 pt-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@perusahaan.com"
                    required
                    disabled={isPending}
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
                </div>
                
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
                    "Masuk ke Dashboard"
                  )}
                </Button>
              </CardContent>
              
              <CardFooter className="text-center pb-6">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <Link href="/register" className="font-medium text-green-600 hover:text-green-700 hover:underline">
                    Daftar gratis sekarang
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>

          {/* Additional Links */}
          <div className="text-center space-y-2">
            <Link href="/forgot-password" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
              Lupa password?
            </Link>
            <div className="text-xs text-gray-400">
              Dengan masuk, Anda menyetujui{" "}
              <Link href="/terms" className="text-green-600 hover:underline">Syarat & Ketentuan</Link>{" "}
              dan{" "}
              <Link href="/privacy" className="text-green-600 hover:underline">Kebijakan Privasi</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-green-600 via-green-500 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center space-y-6">
            <h3 className="text-4xl font-bold">Kelola WhatsApp Business dengan Mudah</h3>
            <p className="text-xl text-green-100">
              Platform terpercaya untuk mengelola percakapan pelanggan dengan tim Anda
            </p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>Percakapan Real-time</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span>Manajemen Tim</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <span>Notifikasi Instan</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  )
}