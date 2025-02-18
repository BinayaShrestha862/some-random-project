import { NextRequest, NextResponse } from "next/server"

export const GET=async(req:NextRequest,res:NextResponse)=>{
    return new NextResponse("helllo",{status:200})

}
export const POST =async (req:NextRequest,res:NextResponse)=>{
    const body = await req.json()
    const {nigga}=await body
    console.log(nigga);
    return NextResponse.json(body);
}