"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormAlertMessage from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { createHotelSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../ui/image-upload'
import { createHotel, updateHotel } from '@/action/hotel/hotel'
import { Hotel,Image, Menu } from '@prisma/client'

    interface hotelFormProps {
        initialData: (Hotel & { 
          image: Image[], 
          menu: (Menu & { images: Image[] }) | null 
        }) | null;
      }
const HotelForm:React.FC<hotelFormProps> = ({initialData}) => {
    const [pending,setTransition]=useTransition()
    const params=useSearchParams()
    const urlError=params.get("error")==="OAuthAccountNotLinked"?"This email is already in use with another provider!":""
    const [error,setErr]=useState<string|undefined>("")
    const [success,setSuccess]=useState<string|undefined>("")
    const form = useForm<z.infer<typeof createHotelSchema>>({

        resolver:zodResolver(createHotelSchema),
        defaultValues:initialData?{
            contact_email:initialData.contact_email,
            contactNumber:initialData.contact_number,
            description:initialData.description,
            facilities:initialData.facilities,
            hotelImages:initialData.image.map(e=>e.url),
            location:initialData.location,
            name: initialData.name,
            menuImages:initialData.menu?.images.map(e=>e.url)||[],
            featuredCusine:initialData.menu?.featured_cousine||"",
            roomsAvailable:initialData.rooms_available

        }:{
          contact_email:"",
          contactNumber:"",
          description:"",
          facilities:"",
          featuredCusine:"",
          hotelImages:[],
          location:"",
          menuImages:[],
          name:"",
          roomsAvailable:0,
          
        }

    })
    const onSubmit= (values:z.infer<typeof createHotelSchema>)=>{
        setErr("")
        setSuccess("") // we will set it to desired from the object returned from createHotel()
       setTransition(async() => { //sets the pending to true after the function is fired and to false after the function is completed
            try {
                const hotel=initialData?await updateHotel(values,initialData.id):await createHotel(values) // calling the server action from here, it simply returns a string we will create some sort of success and failed object later
                alert(hotel)
              
            } catch (error:any) {
                alert(error.message);
            }
        });


    }
  return (
    <div className='p-5 w-full lg:w-[70%] m-auto mt-10 mb-10 border rounded-md shadow-md '>
        <h1 className='text-center  text-3xl font-bold'>Create hotel here</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-3 p-3 py-6'>
                    <FormField control={form.control} name='name'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                     <FormField control={form.control} name='contactNumber'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Contact number
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                          <FormField control={form.control} name='contact_email'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Contact email
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                          <FormField control={form.control} name='description'
                    render={({field})=>(
                        <FormItem className='flex flex-col gap-1'>
                            <FormLabel>
                                description
                            </FormLabel>
                            <FormControl>
                                <textarea className='border border-border' disabled={pending} {...field}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                             <FormField control={form.control} name='facilities'
                    render={({field})=>(
                        <FormItem className='flex flex-col gap-1'>
                            <FormLabel>
                                Facilites
                            </FormLabel>
                            <FormControl>
                                <textarea className='border border-border'disabled={pending} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                             <FormField control={form.control} name='featuredCusine'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Featured cusine
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                             <FormField control={form.control} name='location'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                location
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                             <FormField control={form.control} name='roomsAvailable'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Rooms available
                            </FormLabel>
                            <FormControl>
                            <Input
                      type="number"
                      disabled={pending}
                      placeholder="Product priority"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                      <FormField
            control={form.control}
            name="hotelImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hotel Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || []} // Ensure field.value is an array
                    disabled={pending}
                    onChange={(urls) => {
                      
                      console.log("Updated images:", urls);
                      field.onChange(urls); // Update the form state
                    }}
                    onRemove={(url) => {
                      const updatedImages = (field.value || []).filter(
                        (current) => current!== url // Remove the image by its URL
                      );
                      console.log("Images after removal:", updatedImages);
                      field.onChange(updatedImages); // Update the form state
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
                               <FormField
            control={form.control}
            name="menuImages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Menu Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value || []} // Ensure field.value is an array
                    disabled={pending}
                    onChange={(urls) => {
                      
                      console.log("Updated images:", urls);
                      field.onChange(urls); // Update the form state
                    }}
                    onRemove={(url) => {
                      const updatedImages = (field.value || []).filter(
                        (current) => current!== url // Remove the image by its URL
                      );
                      console.log("Images after removal:", updatedImages);
                      field.onChange(updatedImages); // Update the form state
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

                </div>
                <FormAlertMessage type='error' message={error||urlError}/>
                <FormAlertMessage type='success' message={success}/>
                 
                <Button disabled={pending} className='w-full text-md font-semibold '>Create</Button>
                <div className='mt-4'></div>
            </form>


        </Form>
    </div>
)
}

export default HotelForm