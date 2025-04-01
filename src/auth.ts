import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from "@/lib/prisma"
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema } from '@/lib/formValidation'
import { compareSync } from "bcrypt-ts"

export class CustomError extends CredentialsSignin {
  errorMessage: string
  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      userid: string | null
      role: string | null
    } & DefaultSession["user"]
  }

  interface User {
    id?: string
    email?: string | null
    role?: string | null
  }

  interface JWT {
    id: string | null
    role: string | null
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role || "user"
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.userid = token.id as string | null
        session.user.role = token.role as string | null
      }
      return session
    },
    redirect({ url }) {
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (url.startsWith("http")) return url;
      return baseUrl;
    },
    authorized({ request, auth }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.role === 'admin';
      const isAllowedPath = request.nextUrl.pathname.startsWith('/admin');

      if (isAllowedPath) {
        if (!isLoggedIn) return false;
        if (!isAdmin) return false;
        return true;
      }
      return true;
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      async authorize(credentials) {
        const validateFields = SignInSchema.safeParse(credentials)
        
        if(!validateFields.success){
          return null
        }

        const { email, password } = validateFields.data
        const user = await prisma.user.findUnique({
          where: {email},
          select: {
            id: true,
            email: true,
            password: true,
            role: true
          }
        })

        if(!user || !user.password) {
          throw new CustomError('Email Not Found')
        }

        const isPasswordMatch = compareSync(password, user.password)
        
        if(!isPasswordMatch) {
          throw new CustomError('Password Not Valid')
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role || "user"
        }
      }
    })
  ],
})