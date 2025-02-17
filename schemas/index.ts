import * as z from "zod"
export const LoginSchema=z.object({
    email:z.string().email(),
    password:z.string(),
    


})
export const RegisterSchema=z.object({
    name:z.string().min(1,{message:"name is required"}),
    email:z.string().email(),
    password:z.string().min(6),
    


})
export const PasswordResetSchema=z.object({
    email:z.string().email()
})
export const SetPasswordSchema=z.object({
    password:z.string().min(6)
})