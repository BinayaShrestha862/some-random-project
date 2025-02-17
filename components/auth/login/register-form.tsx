"use client"
import { register } from '@/action/register'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FormAlertMessage from '@/components/ui/form-message'
import { Input } from '@/components/ui/input'
import { RegisterSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState, useTransition } from 'react'
import {useForm} from "react-hook-form"
import * as z from 'zod'
import { Social } from './socials'

const RegisterForm = () => {
    const [pending,setTransition]=useTransition()
    const [error,setErr]=useState<string|undefined>("")
    const [success,setSuccess]=useState<string|undefined>("")
    const form = useForm<z.infer<typeof RegisterSchema>>({

        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            email:"",
            password:"",
            name:"",

        }

    })
    const onSubmit=(values:z.infer<typeof RegisterSchema>)=>{
        setErr("")
        setSuccess("")
        setTransition(()=>
        register(values).then((data)=>{
            setErr(data.error)
            setSuccess(data.success)

        })
    )


    }
  return (
    <div className='p-5 w-full border rounded-md shadow-md '>
        <h1 className='text-center  text-2xl font-bold font-mono'>Register</h1>
        <Form {...form} >
            <form className='w-full' onSubmit={form.handleSubmit(onSubmit)}>
                <div className='flex flex-col gap-3 p-3 py-6'>
                <FormField control={form.control} name='name'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={pending} {...field} type="name"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                    />
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
                     <FormField control={form.control} name='password'
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>
                                Password
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

                <Button disabled={pending} className='w-full text-md font-semibold'>Register</Button>
                <div className="w-full mt-4 "><Social/></div>
            </form>


        </Form>
    </div>
)
}

export default RegisterForm