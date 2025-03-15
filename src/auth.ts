import NextAuth, { CredentialsSignin , type DefaultSession} from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from "@/lib/prisma"
import Credentials from 'next-auth/providers/credentials'
import { SignInSchema } from '@/lib/formValidation'
import { compareSync } from "bcrypt-ts"


export class CustomError extends CredentialsSignin {
  errorMessage: string
  constructor(errorMessage : string){
    super();
    this.errorMessage = errorMessage
  }
}

declare module "next-auth" {
 
  interface Session {
    user: {
      userid: string | any
    } & DefaultSession["user"]
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
      console.log(token,user)
      if (user) { // User is available during sign-in
        token.id = user.id
      }
      return token 
    },
    session({ session, token }) {
      session.user.userid = token.id
      return {
        ...session,
        user: {
          ...session.user,
          userid: token.id
        }
      }
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const validateFields = SignInSchema.safeParse(credentials)
        
        if(!validateFields.success){
          return null
        }

        const { email, password } = validateFields.data
        const user = await prisma.user.findUnique({
          where: {email}
        })

        if(!user || !user.password) {
          throw new CustomError('Email Not Found')
        }

        const isPasswordMatch = compareSync(password,user.password);
        console.log("🚀 ~ authorize: ~ isPasswordMatch:", isPasswordMatch)
        
        if(!isPasswordMatch) {
          throw new CustomError('Password Not Valid')
        }

        return user
      }
    })
  ],
})