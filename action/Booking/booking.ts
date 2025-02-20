"use server"

import { auth } from "@/auth"
import { db } from "@/lib/db"
import { createBookingSchema } from "@/schemas"
import { z } from 'zod'

export const createBooking = async (
    values: z.infer<typeof createBookingSchema>
): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return "Not Authenticated";
    }

    const validatedFields = createBookingSchema.safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        userId,
        hotelId,
        loungeId,
        restaurantId
    } = validatedFields.data;

    if (!hotelId && !loungeId && !restaurantId) {
        return "At least one entity ID (restaurant, hotel, lounge) is required.";
    }

    try {
        // create booking
        await db.booking.create({
            data: {
                userId,
                hotelId,
                loungeId,
                restaurantId
            }
        })
        return "Booking created successfully";
    } catch (error) {
        console.error("Error creating booking:", error);
        return "Failed to create booking";
    }
};

export const updateBooking = async (
    bookingId: string,
    values: z.infer<typeof createBookingSchema>
): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return "Not Authenticated"
    }

    const validatedFields = createBookingSchema.safeParse(values);
    if (!validatedFields.success) {
        return "Invalid fields: " + validatedFields.error.message;
    }

    const {
        hotelId,
        loungeId,
        restaurantId
    } = validatedFields.data;

    try {
        const existingBooking = await db.booking.findUnique({
            where: { id: bookingId }
        })

        if (!existingBooking) {
            return "Booking Not Found";
        }

        if (existingBooking.userId !== user.id) {
            return "You do not have premission to update Booking"
        }

        await db.booking.update({
            where: { id: bookingId },
            data: {
                hotelId,
                loungeId,
                restaurantId
            }
        })

        return "Booking Updated Successfully";
    } catch (error) {
        console.error("Error updating booking:", error);
        return "Failed to update booking";
    }
};

export const deleteBooking = async (
    bookingId: string): Promise<string> => {
    const session = await auth();
    const user = session?.user;

    if (!user || !user.id) {
        return "Not Authenticated";
    }

    try {
        const existingBooking = await db.booking.findUnique({
            where: { id: bookingId },
        });

        if (!existingBooking) {
            return "Booking not found.";
        }

        if (existingBooking.userId !== user.id) {
            return "You do not have permission to delete this booking.";
        }

        await db.booking.delete({
            where: { id: bookingId },
        });

        return "Booking deleted successfully";
    } catch (error) {
        console.error("Error deleting booking:", error);
        return "Failed to delete booking";
    }
};