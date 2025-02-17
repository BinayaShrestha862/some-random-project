"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { error } from "console";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { TypeOf, z } from "zod";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (value: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(value);
  if (!validatedFields.success) {
    return { error: "invalid fields" };
  }
  const { email, password } = validatedFields.data;
  const existingUser=await getUserByEmail(email)
  if(!existingUser||!existingUser.email||!existingUser.password) return {error:"Email doesn't exist."}
  if(!existingUser.emailVerified){
    const verificationToken=await generateVerificationToken(existingUser.email)
    await sendVerificationEmail(verificationToken.email,verificationToken.token)
    return {success:"Conformation email sent."}

  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
