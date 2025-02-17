"use server"

import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from "@/lib/mail"
import { generatePasswordResetToken } from "@/lib/tokens"
import { PasswordResetSchema } from "@/schemas"
import { z } from "zod"

export const SendPasswordResetEmail=async(values:z.infer<typeof PasswordResetSchema>)=>{
    const validatedFields=PasswordResetSchema.safeParse(values)
    if(!validatedFields.success)
        return {error:"Invalid Email!"}
    const {email}=validatedFields.data
    const existingUser=await getUserByEmail(email)
    if(!existingUser)
        return {error:"Email does not exist!"}
    const passwordResetToken=await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email,passwordResetToken.token)
    return {success:"Email sent!"}



       
}