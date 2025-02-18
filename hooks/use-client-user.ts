
import { useSession } from "next-auth/react"

export const useClientUser=async()=>{
   const session=useSession()
    return session?.data?.user
}