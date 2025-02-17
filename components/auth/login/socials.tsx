"use client"
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import {signIn} from "next-auth/react"
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
export const Social = () => {
    const onClick=(providers:"google"|"github")=>{
       signIn(providers,{
        callbackUrl: DEFAULT_LOGIN_REDIRECT
       })

    }

  return (
    <div className="flex w-full gap-x-4">
      <Button
      type="button"
        variant={"outline"}
        className="flex-1"
        size="lg"
        onClick={()=>onClick("google")}
      >
        <FcGoogle className="h-5 w-5 " />
      </Button>
      <Button
      type="button"
        variant={"outline"}
        size="lg"
        className="flex-1"
        onClick={() => {onClick("github")}}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
