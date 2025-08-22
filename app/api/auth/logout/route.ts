import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("auth-token")

    return NextResponse.json({ message: "Logout berhasil" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat logout" },
      { status: 500 }
    )
  }
}
