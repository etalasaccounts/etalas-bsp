import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { name, email, password, workspaceName, invitationToken } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    let workspace: { id: string }
    let userRole: "admin" | "karyawan" = "karyawan"

    if (invitationToken) {
      // Handle invitation registration
      const invitation = await prisma.invitation.findUnique({
        where: { token: invitationToken },
        include: { workspace: true },
      })

      if (!invitation || invitation.expiresAt < new Date()) {
        return NextResponse.json(
          { message: "Undangan tidak valid atau sudah kadaluarsa" },
          { status: 400 }
        )
      }

      workspace = invitation.workspace
      
      // Delete the invitation after use
      await prisma.invitation.delete({
        where: { id: invitation.id },
      })
    } else {
      // Create new workspace for new registration
      workspace = await prisma.workspace.create({
        data: {
          name: workspaceName,
        },
      })
      
      // Set role as admin for workspace creator
      userRole = "admin"
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        workspaceId: workspace.id,
      },
    })

    return NextResponse.json(
      { message: "Pendaftaran berhasil", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mendaftar" },
      { status: 500 }
    )
  }
}
