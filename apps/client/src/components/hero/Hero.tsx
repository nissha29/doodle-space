"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "./Background";

export default function Hero() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center">
        <Background />
      </div>
      <div
        className="w-full h-screen px-10 py-6"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <Navbar />
        <div className="relative">
          <div className="absolute top-40 right-80 translate-3/4 rotate-45 animate-spin">
            <Image src="/heart.svg" alt="heart" width={100} height={100} />
          </div>
          <div className="absolute top-60 left-80 translate-3/4 rotate-12 animate-spin">
            <Image src="/flower2.svg" alt="flower2" width={100} height={100} />
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-20 justify-center items-center">
          <div className="pr-10">
            <div className="py-1 rounded-full bg-white/95 flex items-center px-1 gap-2 text-black">
              <div className="bg-cyan-300 rounded-full px-6 py-1 font-semibold">
                Draw
              </div>
              <div className="text-lg">Your infinite canvas awaits</div>
              <Link
                href="/signin"
                className="hover:bg-cyan-400 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-105"
              >
                <ArrowRight />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-8">
            <div className="text-7xl w-6xl text-center tracking-wider leading-24">
              Every <span className="text-cyan-400">ძထძℓꫀ</span> begins with a
              spark illuminating creativity
            </div>
            <div className="text-2xl w-3xl text-center text-white/60">
              Let your doodles turn into memories! Share sketches, brainstorm in
              groups, or just have fun—Doodle Space is your boundless space to
              create and grow
            </div>
            <button
              className="bg-cyan-300 text-black px-16 py-4 rounded-full text-3xl mt-10 hover:cursor-pointer hover:scale-110 hover:bg-cyan-400 transition-all duration-300 ease-in-out"
              onClick={() => router.push("/signin")}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
