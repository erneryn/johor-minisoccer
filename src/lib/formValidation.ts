import { object , string } from 'zod'

export const RegisterSchema =  object({
  name: string().min(1,'Name must be more than 1 character'),
  email: string().email("Invalid email"),
  password: string().min(8, "Password min 8 Character").max(32,"Password to long , max 32 Character")
})

export const SignInSchema = object({
  email: string().email("Invalid email"),
  password: string().min(8, "Password min 8 Character").max(32,"Password to long , max 32 Character")
})