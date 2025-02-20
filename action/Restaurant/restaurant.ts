"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createRestaurantSchema } from "@/schemas";
import { z } from "zod";

export const createRestaurant = async (
  values: z.infer<typeof createRestaurantSchema>
): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) return "Not Authenticated";

  let owner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (owner?.id) {
    const existingRestaurant = await db.restaurant.findUnique({
      where: { ownerId: owner.id },
    });
    if (existingRestaurant) return "Restaurant already exists";
  }

  const validatedFields = createRestaurantSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    name,
    location,
    featured = false,
    contact_number,
    contact_email,
    opening_hours,
    facilities,
    description,
    images,
    menuImages,
  } = validatedFields.data;

  if (!owner) {
    console.log("Creating a new owner");

    owner = await db.owner.create({
      data: {
        address: location,
        contactNumber: contact_number,
        userId: user.id,
      },
    });
  }

  if (!images || !images.length) {
    return "Restaurant images are required";
  }

  if (!menuImages || !menuImages.length) {
    return "Restaurant menu images are required";
  }

  try {
    // Step 1: Create the restaurant without menuId
    const newRestaurant = await db.restaurant.create({
      data: {
        ownerId: owner.id,
        name,
        location,
        featured,
        contact_number,
        contact_email,
        opening_hours,
        facilities,
        description,
        images: { create: images.map((url) => ({ url })) },
      },
    });

    // Step 2: Create a menu and link it to the restaurant
    const newMenu = await db.menu.create({
      data: {
        featured_cousine: "",
        restaurant: { connect: { id: newRestaurant.id } },
        images: { create: menuImages.map((url) => ({ url })) },
      },
    });

    // Step 3: Update the restaurant with the menuId
    await db.restaurant.update({
      where: { id: newRestaurant.id },
      data: { menuId: newMenu.id },
    });

    return "Restaurant created successfully!";
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return "An error occurred while creating the restaurant";
  }
}


export const updateRestaurant = async (
  values: z.infer<typeof createRestaurantSchema>,
  restaurantId: string
): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) return "Not authenticated";

  const restaurantOwner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (!restaurantOwner) return "Only restaurant owners can access this URL";

  const existingRestaurant = await db.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!existingRestaurant) return "Restaurant not found";

  if (restaurantOwner.id !== existingRestaurant.ownerId) {
    return "This is not your restaurant";
  }

  const validatedFields = createRestaurantSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    name,
    location,
    featured,
    contact_number,
    contact_email,
    opening_hours,
    facilities,
    description,
    images,
    menuImages,
  } = validatedFields.data;

  try {
    // Update restaurant details
    await db.restaurant.update({
      where: { id: restaurantId },
      data: {
        name,
        location,
        featured,
        contact_number,
        contact_email,
        opening_hours,
        facilities,
        description,
      },
    });

    // Update restaurant images
    if (images && images.length) {
      await db.image.deleteMany({ where: { restaurantId } });

      await db.image.createMany({
        data: images.map((url) => ({
          url,
          restaurantId,
        })),
      });
    }

    // Update menu images
    if (menuImages && menuImages.length) {
      await db.image.deleteMany({ where: { menuId: existingRestaurant.menuId } });

      await db.image.createMany({
        data: menuImages.map((url) => ({
          url,
          menuId: existingRestaurant.menuId,
        })),
      });
    }

    return "Restaurant updated successfully!";
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return "An error occurred while updating the restaurant";
  }
};


export const deleteRestaurant = async (
  restaurantId: string): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) return "Not authenticated";

  const restaurantOwner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (!restaurantOwner) return "Only restaurant owners can access this URL";

  const existingRestaurant = await db.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!existingRestaurant) return "Restaurant not found";

  if (restaurantOwner.id !== existingRestaurant.ownerId) {
    return "This is not your restaurant";
  }

  try {
    // Delete all images first
    await db.image.deleteMany({ where: { restaurantId } });
    await db.image.deleteMany({ where: { menuId: existingRestaurant.menuId } });

    // Delete the menu
    if (existingRestaurant.menuId) {
      await db.menu.delete({ where: { id: existingRestaurant.menuId } });
    }

    // Delete the restaurant
    await db.restaurant.delete({ where: { id: restaurantId } });

    return "Restaurant deleted successfully!";
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return "An error occurred while deleting the restaurant";
  }
};
