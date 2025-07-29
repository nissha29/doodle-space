"use client";

import { ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Background from "./Background";
import Grid from "./Grid";
import Video from "./Video";
import { LineSquiggle } from "lucide-react";
import { Features } from "./Features";
import { CTA } from "./Cta";
import { Footer } from "./Footer";

export default function Hero() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center">
        <Background />
      </div>
      <div
        className="w-full h-screen 2xl:px-36 xl:px-32 lg:px-14 md:px-20 py-6"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <div className="relative">
          <div className="absolute top-52 right-28 translate-3/4 rotate-45 animate-spin">
            <Image src="/heart.svg" alt="heart" width={100} height={100} />
          </div>
          <div className="absolute top-72 left-32 translate-3/4 rotate-12 animate-spin">
            <Image src="/flower2.svg" alt="flower2" width={100} height={100} />
          </div>
          <div className="absolute text-neutral-500 font-extralight -left-7"><LineSquiggle className="w-14 h-14 rotate-45" strokeWidth="1" /></div>
        </div>
        <div className="py-6 md:px-10 lg:px-6 xl:px-10 border-x border-neutral-700 border-dashed">
          <Navbar />
          <div className="flex flex-col justify-center items-center ">
            <div className="mt-20 pr-10">
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
            <div className="flex flex-col justify-center items-center gap-8 mt-14">
              <div className="text-7xl w-6xl text-center tracking-wider leading-24">
                Every <span className="text-cyan-400">ძထძℓꫀ</span> begins with a
                spark illuminating creativity
              </div>
              <div className="text-2xl w-3xl text-center text-white/60">
                Let your doodles turn into memories! Create shapes effortlessly
                or just have fun — Doodle Space is your boundless space to
                create and grow
              </div>
              <button
                className="bg-cyan-300 text-black px-16 py-3 rounded-full text-3xl mt-10 hover:cursor-pointer hover:scale-110 hover:bg-cyan-400 transition-all duration-300 ease-in-out shadow-md shadow-cyan-300"
                onClick={() => router.push("/signin")}
              >
                Get Started
              </button>
            </div>
            <Grid />
            <Video />
            <Features />
            <CTA />
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
