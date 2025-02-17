import { AlertTriangleIcon } from "lucide-react"
import Link from "next/link"

const ErrorCard=()=>{
    return <div className="h-full w-full flex items-center justify-center">
        <div className="p-5 flex flex-col items-center gap-5 border shadow rounded-md">
            <p className="font-bold  text-2xl font flex items-center gap-3"><AlertTriangleIcon size={40} />OOPS! Something went wrong.</p>
            <Link href="/auth/login" className=" underline text-sm text-semibold hover:no-underline"> Back to Login</Link>

        </div>

    </div>
}
export default ErrorCard