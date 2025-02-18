"use server";
import { useServerUser } from "@/hooks/use-server-user";
import { db } from "@/lib/db";
import { createHotelSchema } from "@/schemas";
import { z } from "zod";

export const createHotel = async (values: z.infer<typeof createHotelSchema>) => {
  const user = await useServerUser();
  if (!user) throw new Error("Not authenticated");

  const owner = await db.owner.findUnique({
    where: { userId: user.id },
  });
  if (!owner) throw new Error("User is not an owner");

  const validatedFields = createHotelSchema.safeParse(values);
  if (!validatedFields.success) throw new Error("Invalid fields");

  const {
    contactNumber,
    contact_email,
    description,
    facilities,
    featured,
    hotelImages,
    featuredCusine,
    menuImages,
    location,
    name,
    roomsAvailable,
  } = validatedFields.data;

  // ✅ Fix: Check for undefined instead of falsy values
  if (
    !contactNumber ||
    !contact_email ||
    !description ||
    !facilities ||
    featured === undefined ||
    !hotelImages.length ||
    !menuImages.length ||
    !featuredCusine ||
    !location ||
    !name ||
    roomsAvailable === undefined
  ) {
    throw new Error("Not all fields are provided");
  }

  try {

    const newHotel = await db.hotel.create({
      data: {
        ownerId: owner.id,
        location,
        featured,
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

    const updatedHotel = await db.hotel.update({
      where: { id: newHotel.id },
      data: { menuId: newMenu.id }, 
    });

    return updatedHotel;
  } catch (error) {
    console.error("Error creating hotel:", error);
    throw new Error("Something went wrong");
  }
};
