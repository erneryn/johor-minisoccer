"use server";
import { RegisterSchema, SignInSchema } from "@/lib/formValidation";
import { hashSync } from "bcrypt-ts";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn, CustomError } from "@/auth";

export const signUpCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  const validateForm = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  const dataForm =  {
    name: formData.get("name"),
    email: formData.get("email"),
  }

  if (!validateForm.success) {
    console.log( validateForm.error.flatten())
    return {
      error: validateForm.error.flatten().fieldErrors,
      data: dataForm,
    };
  }

  const { name, password, email } = validateForm.data;
  const hashedPassword = hashSync(password, 10);

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    return { message: "Failed To Register User" ,  data: dataForm};
  }
  redirect("/login");
};

export const signInCredetials = async (prevState: unknown, formData: FormData) => {
  const validateForm = SignInSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  const dataForm =  {
    email: formData.get("email"),
    password: formData.get("password")
  }

  if (!validateForm.success) {    
    return {
      error: validateForm.error.flatten().fieldErrors,
      data: dataForm
    };

  }
  
  const { email, password } = validateForm.data;

  try {
    await signIn("credentials", { email, password, redirectTo: "/" });
    return {
      data: dataForm
    };
  } catch (error) {    
    if (error instanceof CustomError) {
      
      switch (error.type) {
        case "CredentialsSignin":
          return {
            data: dataForm,
            message: error.errorMessage,
          };

        default:
          return {
            data: dataForm,
            message: "Something went wrong",
          };
      }
    }

    throw error;
  }
};
