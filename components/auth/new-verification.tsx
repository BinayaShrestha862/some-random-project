"use client"
import { newVerification } from "@/action/new-verification"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import {BeatLoader} from "react-spinners"
import FormAlertMessage from "../ui/form-message"
import Link from "next/link"

export const NewVerificationForm=()=>{
    const searchParams=useSearchParams()
    const token = searchParams.get("token");
    const [error,setError]=useState<string|undefined>()
    const [success,setSuccess]=useState<string|undefined>()
   const onSubmit = useCallback(()=>{
    if(!token) 
    {
      setError("missing token") 
      return 
    }
        newVerification(token).then((data)=>{
            setSuccess(data.success)
            setError(data.error)
        }).catch((error)=>
            {
                console.log(error);
                setError("Something went wrong.")})
   },[token])
   useEffect(()=>{
    onSubmit()
   },[onSubmit])
    return <div className="p-5 border flex flex-col items-center shadow">
       { !success &&!error&&<BeatLoader color="blue" className="mb-3"/>}
       <FormAlertMessage type="error" message={error} />
       <FormAlertMessage message={success} type="success"/>
       <Link href="/auth/login" className="underline font-semibold text-sm hover:no-underline">Back to login</Link>
    </div>
}