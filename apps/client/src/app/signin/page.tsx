"use client";

import { Button } from "@repo/ui/button";
import Input from "@repo/ui/input";
import { ArrowRight } from "lucide-react";

export default function Signin() {
  return (
    <div className="flex justify-center w-screen h-screen py-24 px-10">
      <div className="flex flex-col gap-5 items-start w-sm">
        <div className="text-3xl sm:text-4xl text-white tracking-normal flex gap-2 justify-center items-center">
          Welcome to DoodleSpace <ArrowRight size={24} />
        </div>
        <div className="text-xl text-neutral-400">
          Sign in and continue creating incredible doodles and designs
        </div>

        <Input
          name="Email"
          type="Email"
          placeholder="John@example.com"
          className="w-80 sm:w-sm border border-neutral-700 p-2 rounded-xl text-xl"
        />

        <Input
          name="Password"
          type="password"
          placeholder="John@100x"
          className="w-80 sm:w-sm border border-neutral-700 p-2 rounded-xl text-xl"
        />
        <Button className="bg-white text-black rounded-xl w-80 sm:w-full py-2 text-xl ">
          Signin
        </Button>
      </div>
    </div>
  );
}
