import { useServerUser } from "@/hooks/use-server-user";
import { NextRequest, NextResponse } from "next/server";

export const GET=async(req:NextRequest,{params}:{ params: Promise<{ hotelId: string } >})=>{
    const {hotelId}=await params
    
    //get a from id hotel data
}
export const PATCH=async (req:NextRequest,{params}:{ params: Promise<{ hotelId: string } >})=>{
    const user = await useServerUser()
    const {hotelId}=await params
    //this is a protected route first get user from user server user like given above ani user xa ki nai check gara ani 
    //xa raixa vane check gara if the user.id === hotel.owner.userId, eutai xa vane balla update garne
    //update information about hotel id
}