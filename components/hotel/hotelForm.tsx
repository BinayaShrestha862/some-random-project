"use client"
import { login } from '@/action/login'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormAlertMessage from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { createHotelSchema, LoginSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '../ui/image-upload'

const HotelForm = () => {
    const [pending,setTransition]=useTransition()
    const params=useSearchParams()
    const urlError=params.get("error")==="OAuthAccountNotLinked"?"This email is already in use with another provider!":""
    const [error,setErr]=useState<string|undefined>("")
    const [success,setSuccess]=useState<string|undefined>("")
    const form = useForm<z.infer<typeof createHotelSchema>>({

        resolver:zodResolver(createHotelSchema),
        defaultValues:{
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
    const onSubmit=(values:z.infer<typeof createHotelSchema>)=>{
        setErr("")
        setSuccess("")
        setTransition(()=>
            console.log(values)
    )


    }
  return (
    <div className='p-5 w-full border rounded-md shadow-md '>
        <h1 className='text-center  text-2xl font-bold font-mono'>Create hotel here</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='grid grid-cols-3 gap-3 p-3 py-6'>
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
                    <Link href="/auth/change-password"><Button variant="ghost" disabled={pending} className='mb-2 hover:underline font-semibold text-sm' >Forgot password?</Button></Link>
                <Button disabled={pending} className='w-full text-md font-semibold '>Login</Button>
                <div className='mt-4'></div>
            </form>


        </Form>
    </div>
)
}

export default HotelForm