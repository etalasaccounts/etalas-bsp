import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      workspaceId: string
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    workspaceId?: string | null
  }
}
