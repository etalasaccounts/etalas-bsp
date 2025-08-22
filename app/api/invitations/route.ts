import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"
import { InvitationEmail } from "@/components/emails/invitation-email"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { email } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "Pengguna dengan email ini sudah terdaftar" },
        { status: 400 }
      )
    }

    // Check if invitation already exists
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        email,
        workspaceId: user.workspaceId,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (existingInvitation) {
      return NextResponse.json(
        { message: "Undangan untuk email ini sudah dikirim dan masih berlaku" },
        { status: 400 }
      )
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        email,
        token,
        expiresAt,
        workspaceId: user.workspaceId,
      },
      include: {
        workspace: true,
      },
    })

    // Send invitation email
    const invitationLink = `${process.env.NEXTAUTH_URL}/register?token=${token}`
    
    try {
      await resend.emails.send({
        from: "WhatsAppin Aja <noreply@whatsappinaja.com>",
        to: email,
        subject: `Undangan untuk bergabung dengan ${invitation.workspace.name}`,
        react: InvitationEmail({
          invitedByEmail: user.email!,
          invitedByName: user.name || user.email!,
          teamName: invitation.workspace.name,
          inviteLink: invitationLink,
        }),
      })
    } catch (emailError) {
      console.log("Email not sent (Resend not configured):", emailError)
    }

    return NextResponse.json(
      { message: "Undangan berhasil dikirim" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim undangan" },
      { status: 500 }
    )
  }
}

export async function GET() {
  const user = await getCurrentUser()

  if (!user || user.role !== "admin") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        workspaceId: user.workspaceId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("Error fetching invitations:", error)
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data undangan" },
      { status: 500 }
    )
  }
}