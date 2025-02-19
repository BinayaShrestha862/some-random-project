"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createHotelSchema } from "@/schemas";
import { Hotel } from "@prisma/client";
import { z } from "zod";

export const createHotel = async (
  values: z.infer<typeof createHotelSchema>
): Promise<string> => {
  const session = await auth();
  const user = session?.user;
  if (!user) return "Not authenticated";

  let owner = await db.owner.findUnique({
    where: { userId: user.id },
  });
  if (owner?.id) {
    const existingHotel = await db.hotel.findUnique({
      where: {
        ownerId: owner?.id,
      },
    });
    if (existingHotel) return "hotel already exists";
  }

  const validatedFields = createHotelSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    contactNumber,
    contact_email,
    description,
    facilities,

    hotelImages,
    featuredCusine,
    menuImages,
    location,
    name,
    roomsAvailable,
  } = validatedFields.data;
  if (!owner) {
    console.log("creating a new owner");
    if (!user.id) {
      return "user id not found";
    }
    owner = await db.owner.create({
      data: {
        address: location,
        contactNumber,
        userId: user.id,
      },
    });
  }

  if (!hotelImages.length || !menuImages.length) {
    return "Hotel images and menu images are required";
  }

  try {
    const newHotel = await db.hotel.create({
      data: {
        ownerId: owner.id,
        location,

        contact_number: contactNumber,
        contact_email,
        rooms_available: roomsAvailable,
        name,
        facilities,
        description,
        image: {
          create: hotelImages.map((url) => ({ url })),
        },
      },
    });

    const newMenu = await db.menu.create({
      data: {
        featured_cousine: featuredCusine,
        hotel: {
          connect: { id: newHotel.id },
        },
        images: {
          create: menuImages.map((url) => ({ url })),
        },
      },
    });

    await db.hotel.update({
      where: { id: newHotel.id },
      data: { menuId: newMenu.id },
    });

    return "hotel created";
  } catch (error: any) {
    console.error("Error creating hotel:", error);
    return `Failed to create hotel: ${error.message}`;
  }
};

export const updateHotel = async (
  values: z.infer<typeof createHotelSchema>,
  hotelId: string
): Promise<string> => {
  const session = await auth();
  const user = session?.user;
  if (!user) return "Not authenticated";
  const existingHotel = await db.hotel.findUnique({
    where: {
      id: hotelId,
    },
  });
  if (!existingHotel) return "hotel not found";

  const validatedFields = createHotelSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    contactNumber,
    contact_email,
    description,
    facilities,

    hotelImages,
    featuredCusine,
    menuImages,
    location,
    name,
    roomsAvailable,
  } = validatedFields.data;

  if (!hotelImages.length || !menuImages.length) {
    return "Hotel images and menu images are required";
  }
try {
    await db.hotel.update({
      where:{
        id:hotelId,
      },data:{
        contact_number:contactNumber,
        contact_email,
        description,
        facilities,
        location,
        name,
        rooms_available:roomsAvailable,
        image:{
          deleteMany:{}
        }
  
      }
    })
    await db.hotel.update({
      where:{
        id:hotelId
      },data:{
        image: {
          create: hotelImages.map((url) => ({ url })),
        },
      }
    })
    return "success";
} catch (error) {
  console.log(error)
  return "error"
}
};

