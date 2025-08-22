import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get("token")

  if (!token) {
    return NextResponse.json(
      { valid: false, message: "Token tidak ditemukan" },
      { status: 400 }
    )
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { token },
      include: { workspace: true },
    })

    if (!invitation || invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { valid: false, message: "Undangan tidak valid atau sudah kadaluarsa" },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      email: invitation.email,
      workspaceId: invitation.workspaceId,
      workspaceName: invitation.workspace.name,
    })
  } catch (error) {
    console.error("Error validating invitation:", error)
    return NextResponse.json(
      { valid: false, message: "Terjadi kesalahan saat memvalidasi undangan" },
      { status: 500 }
    )
  }
}
