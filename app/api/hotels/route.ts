import { useServerUser } from "@/hooks/use-server-user"
import { NextRequest, NextResponse } from "next/server"
export const POST =async(req:NextRequest,res:NextResponse)=>{
    const body=await req.json()
    const user =await useServerUser()
    //create hotel here if user exist and is authenticated
}