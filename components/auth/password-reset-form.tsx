"use client"

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormAlertMessage from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { PasswordResetSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'

import { useSearchParams } from 'next/navigation'
import { SendPasswordResetEmail } from '@/action/password-reset'
import Link from 'next/link'

const ResetForm = () => {
    const [pending,setTransition]=useTransition()
    const params=useSearchParams()
    const urlError=params.get("error")==="OAuthAccountNotLinked"?"This email is already in use with another provider!":""
    const [error,setErr]=useState<string|undefined>("")
    const [success,setSuccess]=useState<string|undefined>("")
    const form = useForm<z.infer<typeof PasswordResetSchema>>({

        resolver:zodResolver(PasswordResetSchema),
        defaultValues:{
            email:""
           
        }

    })
    const onSubmit=(values:z.infer<typeof PasswordResetSchema>)=>{
        setErr("")
        setSuccess("")
        setTransition(()=>
        SendPasswordResetEmail(values).then((data)=>
        {
            setErr(data?.error)
            setSuccess(data?.success)
           

        })
    )


    }
  return (
    <div className='p-5 w-full border rounded-md shadow-md '>
        <h1 className='text-center  text-2xl font-bold font-mono'>Login</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col py-3'>
                    <FormField control={form.control} name='email'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} type="email"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
                   
                </div>
                <FormAlertMessage type='error' message={error||urlError}/>
                <FormAlertMessage type='success' message={success}/>
                 <Link href="/auth/login" > <Button variant="link" className='font-semibold'>Back to login</Button></Link>

                <Button disabled={pending} className='w-full text-md font-semibold'>Send Email</Button>
                {/* <div className='mt-4'><Social/></div> */}
            </form>


        </Form>
    </div>
)
}

export default ResetForm