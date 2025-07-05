"use client"

import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const signupPasswordRef = useRef<HTMLInputElement | null>(null);
  const signinPasswordRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="flex justify-center w-screen h-screen py-24 px-10">
      <div className="flex flex-col gap-5 items-start w-sm">
        <div className="text-3xl sm:text-4xl text-white tracking-normal flex gap-2 justify-center items-center">
          Welcome to DoodleSpace <ArrowRight size={24}/>
        </div>
        <div className="text-xl text-neutral-400">{isSignin ? 'Sign in and continue creating incredible doodles and designs' : 'Create your doodle space account and start drawing'}</div>

        {! isSignin && <div className="flex sm:gap-4 flex-col sm:flex-row gap-5">
          <Input
            ref={nameRef}
            name="Name"
            type="text" 
            placeholder="John Doe"
            className="w-80 sm:w-36 border border-neutral-700 p-2 rounded-xl text-xl"
          />
          <Input
            ref={emailRef}
            name="Password"
            type="password"
            placeholder="John@100x"
            className="w-80 sm:w-56 border border-neutral-700 p-2 rounded-xl text-xl"
          />
        </div>}

        <Input
          ref={signupPasswordRef}
          name="Email"
          type="Email"
          placeholder="John@example.com"
          className="w-80 sm:w-sm border border-neutral-700 p-2 rounded-xl text-xl"
        />

        {isSignin && <Input
            ref={signinPasswordRef}
            name="Password"
            type="password"
            placeholder="John@100x"
            className="w-80 sm:w-sm border border-neutral-700 p-2 rounded-xl text-xl"
          />}
        <Button className="bg-white text-black rounded-xl w-80 sm:w-full py-2 text-xl ">
            {isSignin ? 'Signin' : 'Signup'}
        </Button>
      </div>
    </div>
  );
}
