import HotelForm from '@/components/hotel/hotelForm'
import { db } from '@/lib/db'
import React from 'react'

const page = async ({ params }: { params:Promise<{ hotelId: string } >}) => {
  const { hotelId } = await params; 
  console.log(hotelId);
  if(!hotelId) return (
    <div> <HotelForm initialData={null}/></div>
  )
  const hotel=await db.hotel.findUnique({
    where:{
      id:hotelId
    },include:{
      image:true,
      menu:{
        include:{
          images:true

        }
      }
      
    }
  })
  return (
    <div><HotelForm initialData={hotel}/></div>
  )
}

export default page