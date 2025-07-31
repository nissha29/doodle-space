"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signInSchema } from "@repo/common/types";
import Button from "../forms/button";
import Input from "../forms/input";
import { ArrowRight } from "lucide-react";
import Error from "../forms/error";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { signin } from "@/api/auth";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

type signinForm = z.infer<typeof signInSchema>;

export default function Signin() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<signinForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: signinForm) => {
    try {
      const userData = {
        email: data.email,
        password: data.password,
      };
      const response = await signin(userData);
      useUserStore.getState().setUser({ name: response.user.name, email: response.user.email });
      localStorage.setItem("token", response.token.encoded);
      toast.success("Signed in successfully! Let’s get creative with your doodles.");
      router.push('/draw-mode');
    } catch (error: any) {
      toast.error(error.message || "Oops! Something went wrong during signin. Please check your details and try again."
      );
    } finally {
      reset();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen py-24 px-3 sm:px-10">
      <div className="flex flex-col gap-5 items-start sm:w-sm w-80">
        <div className="text-3xl sm:text-4xl text-white tracking-normal flex gap-2 justify-center items-center text-wrap">
          Welcome to DoodleSpace <ArrowRight size={24} />
        </div>
        <div className="text-xl text-neutral-400">
          Sign in and continue creating incredible doodles and designs
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            {...register("email")}
            label="Email"
            type="Email"
            placeholder="John@example.com"
            className="w-80 sm:w-sm"
          />

          <Input
            {...register("password")}
            label="Password"
            type="password"
            placeholder="John@100x"
            className="w-80 sm:w-sm"
          />
          {errors.email ? (
            <Error text={errors.email?.message} />
          ) : (
            <Error text={errors.password?.message} />
          )}
          <Button
            disabled={isSubmitting}
            className={`${isSubmitting ? "bg-white/50" : "bg-white"}`}
          >
            {isSubmitting ? "Signing in...." : "Signin"}
          </Button>
        </form>
      </div>
      <div className="text-xl mt-3 text-neutral-400">Don't have an account, <Link href={'/signup'} className="text-white hover:underline underline-offset-4">Sign up</Link></div>
    </div>
  );
}
