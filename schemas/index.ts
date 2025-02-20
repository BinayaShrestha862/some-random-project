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
export const createHotelSchema=z.object({
    name:z.string(),
    location:z.string(),
    featured:z.boolean().default(false).optional(),
    contactNumber:z.string(),
    roomsAvailable:z.number(),
    contact_email:z.string().email(),
    hotelImages: z.string().array(),
 
    facilities: z.string(),
    description: z.string(),
    menuImages:z.string().array(),
    featuredCusine:z.string()



})

export const createLoungeSchema=z.object({
    name:z.string(),
    location:z.string(),
    capacity:z.number(),
    facilities:z.string(),
    description:z.string(),
    contact_number:z.string(),
    contact_email:z.string().email(),
    opening_hours:z.string(),
    images:z.string().array(),
    
})