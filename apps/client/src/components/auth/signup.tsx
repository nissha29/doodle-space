"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreateUserSchema } from "@repo/common/types";
import Button from "../forms/button";
import Input from "../forms/input";
import { ArrowRight } from "lucide-react";
import Error from "../forms/error";
import { signup } from "@/api/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";

type signupForm = z.infer<typeof CreateUserSchema>;

export default function Signup() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<signupForm>({
    resolver: zodResolver(CreateUserSchema),
  });

  const onSubmit = async (data: signupForm) => {
    try{
      const userData = {
      name: data.name,
      email: data.email,
      password: data.password
    }
    const response = await signup(userData);
    useUserStore.getState().setUser({ name: response.user.name, email: response.user.email });
    localStorage.setItem('token', response.token.encoded);
    toast.success('Your account has been created successfully. Start doodling your ideas now!');
    router.push('/draw-mode');
    }catch(error: any){
      toast.error(error.message || "Oops! Something went wrong during signin. Please check your details and try again.")
    }finally{
      reset();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen py-24 px-3 sm:px-10">
      <div className="flex flex-col gap-5 items-start w-80 sm:w-sm">
        <div className="text-3xl sm:text-4xl text-white tracking-normal flex gap-2 justify-center items-center">
          Welcome to DoodleSpace <ArrowRight size={24} />
        </div>
        <div className="text-xl text-neutral-400">
          Create your doodle space account and start drawing
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex sm:gap-4 flex-col sm:flex-row gap-5">
            <Input
              {...register('name')}
              label="Name"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 
              type="text"
              placeholder="John Doe"
              className="w-80 sm:w-36"
            />
            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="John@100x"
              className="w-80 sm:w-56"
            />
          </div>
          <Input
            {...register('email')}
            label="Email"
            type="Email"
            placeholder="John@example.com"
            className="w-80 sm:w-sm"
          />
          {errors.name ? <Error text={errors.name?.message}/> : errors.password ? <Error text={errors.password?.message} /> : <Error text={errors.email?.message}/>}
          <Button disabled={isSubmitting} className={`${isSubmitting ? 'bg-white/50' : 'bg-white'}`}>
            {isSubmitting ? "Signing up...." : "Signup"}
          </Button>
        </form>
      </div>
      <div className="text-xl mt-3 text-neutral-400">Already have an account, <Link href={'/signin'} className="text-white hover:underline underline-offset-4">Sign in</Link></div>
    </div>
  );
}
