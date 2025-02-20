import exp from "node:constants"
import { features } from "node:process"
import { comment } from "postcss"
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

export const createRestaurantSchema = z.object({
    name:z.string(),
    location:z.string(),
    featured:z.boolean().default(false).optional(),
    contact_number:z.string(),
    contact_email:z.string().email(),
    opening_hours:z.string(),
    facilities: z.string(),
    description: z.string(),
    images:z.string().array(),
    menuImages:z.string().array(),
    featuredCusine:z.string()
})

export const createTouristSpotSchema = z.object({
    name:z.string(),
    location:z.string(),
    description:z.string(),
    openingHours:z.string(),
    entryFee:z.string(),
    images:z.string().array(),
    
})

export const createReviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string(),
    restaurantId: z.string().optional(),
    hotelId: z.string().optional(),
    touristSpotId: z.string().optional(),
    loungeId: z.string().optional(),
  });

  export const createBookingSchema = z.object({
    userId: z.string(),
    hotelId: z.string().optional(),
    loungeId: z.string().optional(),
    restaurantId: z.string().optional(),
  })