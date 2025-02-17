"use server"

import { getPasswordResetTokenByToken } from "@/data/password-reset-token"
import { getUserByEmail } from "@/data/user"
import { db } from "@/lib/db"
import { SetPasswordSchema } from "@/schemas"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const setPassword=async (values:z.infer<typeof SetPasswordSchema>,token?:string|null)=>{

if(!token) return {error:"missing token!"}
const validatedFields=SetPasswordSchema.safeParse(values);
if (!validatedFields.success){
    return {error:"Invalid fields"}
    
}
const {password}=validatedFields.data
const existingToken=await getPasswordResetTokenByToken(token)
if(!existingToken)
    return {error:"Invalid token"}
const hasExpired = new Date(existingToken.expires)<new Date();
if (hasExpired){
    return {error:"token has expired"}
}
const existingUser=await getUserByEmail(existingToken.email);
if(!existingUser){
    return {error:"Email doesnot exist"}
}
const hashedPassword = await bcrypt.hash(password,10)
await db.user.update({
    where :{id:existingUser.id},
    data:{password:hashedPassword}
})
await db.passwordResetToken.delete({
    where:{id:existingToken.id}
})
return {success:"Changed!!!!!"}
}