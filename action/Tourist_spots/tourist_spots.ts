"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createTouristSpotSchema } from "@/schemas";
import { z } from "zod";

export const createTouristSpot = async (
    values: z.infer<typeof createTouristSpotSchema>
): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) return "Not Authenticated";

    const validatedFields = createTouristSpotSchema.safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        name,
        location,
        description,
        openingHours,
        entryFee,
        images
    } = validatedFields.data;

    if (!images || !images.length) {
        return "Tourist Spot images are required";
    }

    try {
        await db.tourist_spots.create({
            data: {
                userId: user.id,
                name,
                location,
                description,
                openingHours,
                entryFee,
                images: { create: images.map((url) => ({ url })) }
            }
        })
        return "Tourist Spot created successfully";
    } catch (error) {
      console.error("Error creating lounge:", error);
      return "An error occurred while creating the lounge";
    }
  };
  

export const updateTouristSpot = async (
    values: z.infer<typeof createTouristSpotSchema>,
    touristId: string
  ): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) return "Not authenticated";

    const existingSpot = await db.tourist_spots.findUnique({
        where: { id: touristId },
    });

    if (!existingSpot) return "Tourist Spot not found";

    if (existingSpot.userId !== user.id) {
        return "You do not have permission to update this tourist spot";
    }

    const validatedFields = createTouristSpotSchema.partial().safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        name,
        location,
        description,
        openingHours,
        entryFee,
        images
    } = validatedFields.data;

    try {
        await db.tourist_spots.update({
            where: { id: touristId},
            data: {
                name,
                location,
                description,
                openingHours,
                entryFee
            }
        });

        if (images?.length) { 
            await db.image.deleteMany({ where: { touristSpotId: touristId } });
    
            await db.image.createMany({
                data: images.map((url) => ({
                    url,
                    touristSpotId : touristId
                })) 
            });
        }
        

        return "Tourist spot updated successfully!";
    } catch (error) {
      console.error("Error updating restaurant:", error);
      return "An error occurred while updating the restaurant";
    }
  };
  

export const deleteTouristSpot = async (
    touristId: string): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) return "Not authenticated";

    const existingSpot = await db.tourist_spots.findUnique({
        where: { id: touristId },
        include: { images: true },
    });

    if (!existingSpot) return "Tourist Spot not found";


    if (existingSpot.userId !== user.id) {
        return "You do not have permission to delete this tourist spot";
    }


    try {
        await db.image.deleteMany({
            where: { touristSpotId: touristId },
        });

        await db.tourist_spots.delete({
            where: { id: touristId },
        });

        return "Tourist Spot deleted successfully";
    } catch (error) {
        console.error("Error deleting tourist spot:", error);
        return "An error occurred while deleting the tourist spot";
    }
};