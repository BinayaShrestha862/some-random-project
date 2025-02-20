"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createLoungeSchema } from "@/schemas";
import { z } from "zod";

export const createLounge = async (
  values: z.infer<typeof createLoungeSchema>
): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) return "Not Authenticated";

  let owner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (owner?.id) {
    const existingLounge = await db.lounge.findUnique({
      where: { ownerId: owner?.id },
    });

    if (existingLounge) return "Lounge already exists";
  }

  const validatedFields = createLoungeSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    name,
    location,
    capacity,
    facilities,
    description,
    contact_number,
    contact_email,
    opening_hours,
    images,
  } = validatedFields.data;

  if (!owner) {
    console.log("Creating a new owner");

    owner = await db.owner.create({
      data: {
        address: location,
        contactNumber: contact_number,
        userId: user.id
      },
    });
  }

  if (!images || !images.length) {
    return "Lounge images are required";
  }

  try {
    await db.lounge.create({
      data: {
        name,
        location,
        capacity,
        facilities,
        description,
        contact_number,
        contact_email,
        opening_hours,
        ownerId: owner.id,
        images: {
          create: images.map((url) => ({ url })),
        },
      },
    });

    return "Lounge created successfully";
  } catch (error) {
    console.error("Error creating lounge:", error);
    return "An error occurred while creating the lounge";
  }
};

export const updateLounge = async (
  values: z.infer<typeof createLoungeSchema>,
  loungeId: string
): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return "Not authenticated";
  }

  const loungeOwner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (!loungeOwner) {
    return "Only Lounge Owner can access this URL";
  }

  const existingLounge = await db.lounge.findUnique({
    where: { id: loungeId },
  });

  if (!existingLounge) {
    return "Lounge not found";
  }

  if (loungeOwner.id !== existingLounge.ownerId) {
    return "This is not your lounge";
  }

  const validatedFields = createLoungeSchema.safeParse(values);
  if (!validatedFields.success) {
    return "Invalid fields: " + validatedFields.error.message;
  }

  const {
    name,
    location,
    capacity,
    facilities,
    description,
    contact_number,
    contact_email,
    opening_hours,
    images,
  } = validatedFields.data;

  try {
    // Update lounge details
    await db.lounge.update({
      where: { id: loungeId },
      data: {
        name,
        location,
        capacity,
        facilities,
        description,
        contact_number,
        contact_email,
        opening_hours,
      },
    });

    // Update images (deleting old images and adding new ones)
    if (images && images.length) {
      await db.image.deleteMany({
        where: { loungeId },
      });

      await db.image.createMany({
        data: images.map((url) => ({
          url,
          loungeId,
        })),
      });
    }

    return "Lounge updated successfully";
  } catch (error) {
    console.error("Error updating lounge:", error);
    return "An error occurred while updating the lounge";
  }
};

export const deleteLounge = async (
  loungeId: string): Promise<string> => {
  const session = await auth();
  const user = session?.user;

  if (!user || !user.id) {
    return "Not authenticated";
  }

  const loungeOwner = await db.owner.findUnique({
    where: { userId: user.id },
  });

  if (!loungeOwner) {
    return "Only Lounge Owner can access this URL";
  }

  const existingLounge = await db.lounge.findUnique({
    where: { id: loungeId },
  });

  if (!existingLounge) {
    return "Lounge not found";
  }

  if (loungeOwner.id !== existingLounge.ownerId) {
    return "This is not your lounge";
  }

  try {
    // Delete all lounge images first
    await db.image.deleteMany({
      where: { loungeId },
    });

    // Delete the lounge
    await db.lounge.delete({
      where: { id: loungeId },
    });

    return "Lounge deleted successfully";
  } catch (error) {
    console.error("Error deleting lounge:", error);
    return "An error occurred while deleting the lounge";
  }
};
