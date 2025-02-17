import { cn } from "@/lib/utils"
import { TriangleAlert } from "lucide-react"


interface FormMessageProps{
    type:"success"|"error",
    message:string|undefined,
}   

const FormAlertMessage:React.FC<FormMessageProps> = ({type,message}) => {
    if(message===""||message===undefined) return <></>
  return (
    <div className={cn('px-4 mb-4 flex gap-2 py-2 rounded-md text-center bg-emerald-500/10 text-emerald-600 ',type==="error"&&"bg-red-500/15 text-red-500")}>
       
        {type==="error"&&<TriangleAlert className="text-red-400"/>}
        <p className="">{message}</p>
       
    </div>
  )
}

export default FormAlertMessage