"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormAlertMessage from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { SetPasswordSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'

import { useSearchParams } from 'next/navigation'

import Link from 'next/link'
import { setPassword } from '@/action/set-password'

const SetPasswordForm = () => {
    const [pending,setTransition]=useTransition()
    const searchParams=useSearchParams()
    const token = searchParams.get("token")

    const [error,setErr]=useState<string|undefined>("")
    const [success,setSuccess]=useState<string|undefined>("")
    const form = useForm<z.infer<typeof SetPasswordSchema>>({

        resolver:zodResolver(SetPasswordSchema),
        defaultValues:{
            password:""
           
        }

    })
    const onSubmit=(values:z.infer<typeof SetPasswordSchema>)=>{
        setErr("")
        setSuccess("")
        setTransition(()=>
        setPassword(values,token).then((data)=>
        {
            setErr(data?.error)
            setSuccess(data?.success)
           

        })
    )


    }
  return (
    <div className='p-5 w-full border rounded-md shadow-md '>
        <h1 className='text-center  text-2xl font-bold font-mono'>Change Password</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col py-3'>
                    <FormField control={form.control} name='password'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                            New Password
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} type="password"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                   
                </div>
                <FormAlertMessage type='error' message={error}/>
                <FormAlertMessage type='success' message={success}/>
                 <Link href="/auth/login" > <Button variant="link" className='font-semibold'>Back to login</Button></Link>

                <Button disabled={pending} className='w-full text-md font-semibold'>Submit</Button>
                {/* <div className='mt-4'><Social/></div> */}
            </form>


        </Form>
    </div>
)
}

export default SetPasswordForm