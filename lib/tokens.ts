import { getVerificationTokenByEmail } from "@/data/verification-token";
import {v4 as uuid} from "uuid"
import { db } from "./db";
import { getPasswordResetByEmail } from "@/data/password-reset-token";
export const generateVerificationToken = async (email:string)=>{
    const token =uuid();
    const expires=new Date(new Date().getTime()+3600*1000)
    const existingToken = await getVerificationTokenByEmail(email)
    if (existingToken){
        await db.verificationToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }
    const verificationToken=await db.verificationToken.create({
        data:{
            email,token,expires
        }
    })
    return verificationToken
}
export const generatePasswordResetToken = async (email:string)=>{
    const token =uuid();
    const expires=new Date(new Date().getTime()+10*60*1000)
    const existingToken = await getPasswordResetByEmail(email)
    if (existingToken){
        await db.passwordResetToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }
    const passwordResetToken=await db.passwordResetToken.create({
        data:{
            email,token,expires
        }
    })
    return passwordResetToken
}