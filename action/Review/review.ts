"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createReviewSchema } from "@/schemas";
import { z } from "zod";

export const createReview = async (
    values: z.infer<typeof createReviewSchema>
): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return "Not Authenticated";
    }

    const validatedFields = createReviewSchema.safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        rating,
        comment,
        restaurantId,
        hotelId,
        touristSpotId,
        loungeId,
    } = validatedFields.data;

    //  At least one entity ID is Required
    if (!restaurantId && !hotelId && !touristSpotId && !loungeId) {
        return "At least one entity ID (restaurant, hotel, tourist spot, or lounge) is required.";
    }

    try {
        // Determine the entity type and ID
        const entityId = restaurantId || hotelId || touristSpotId || loungeId;
        const entityType = restaurantId
            ? "restaurantId"
            : hotelId
                ? "hotelId"
                : touristSpotId
                    ? "touristSpotId"
                    : "loungeId";

        // Check if the user has booked the entity
        const booking = await db.booking.findFirst({
            where: {
                userId: user.id,
                [entityType]: entityId,
            },
        });

        if (!booking) {
            return "You can only review places you have visited or booked.";
        }

        // Check if the user has already reviewed the entity
        const existingReview = await db.reviews.findFirst({
            where: {
                userId: user.id,
                [entityType]: entityId,
            },
        });

        if (existingReview) {
            return "You have already reviewed this place.";
        }

        // Create the review
        await db.reviews.create({
            data: {
                userId: user.id,
                rating,
                comment,
                restaurantId,
                hotelId,
                touristSpotId,
                loungeId,
            },
        });

        return "Review created successfully";
    } catch (error) {
        console.error("Error creating review:", error);
        return "Failed to create review";
    }
};

export const updateReview = async (
    reviewId: string,
    values: z.infer<typeof createReviewSchema>
): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    // Check if the user is authenticated
    if (!user || !user.id) {
        return "Not Authenticated";
    }

    // Validate the input fields
    const validatedFields = createReviewSchema.safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        comment,
        rating
    } = validatedFields.data;

    try {
        const existingReview = await db.reviews.findUnique({
            where: { id: reviewId }
        })

        if (!existingReview) {
            return "Review not found"
        }

        if (existingReview.userId !== user.id) {
            return "You do not have premission to edit this review"
        }

        await db.reviews.update({
            where: { id: reviewId },
            data: {
                rating,
                comment
            }
        })

        return "Review updated successfully";
    } catch (error) {
        console.error("Error updating review:", error);
        return "Failed to update review";
    }
};

export const deleteReview = async (
    reviewId: string): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return "Not Authenticated";
    }

    try {
        const existingReview = await db.reviews.findUnique({
            where: { id: reviewId },
        });

        if (!existingReview) {
            return "Review not found.";
        }

        if (existingReview.userId !== user.id) {
            return "You do not have permission to delete this review.";
        }

        // Delete the review
        await db.reviews.delete({
            where: { id: reviewId },
        });

        return "Review deleted successfully";
    } catch (error) {
        console.error("Error deleting review:", error);
        return "Failed to delete review";
    }
};
