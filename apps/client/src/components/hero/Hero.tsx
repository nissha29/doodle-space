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
import { AnimateScroll } from "./AnimateScroll";

export default function Hero() {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center">
        <Background />
      </div>
      <div
        className="w-full h-screen 2xl:px-40 xl:px-32 lg:px-14 md:px-8 sm:px-6 sm:py-6 py-4"
      >
        <div className="relative">
          <div className="hidden sm:flex absolute text-neutral-500 font-extralight -left-7"><LineSquiggle className="w-14 h-14 rotate-45" strokeWidth="1" /></div>
        </div>
        <div className="py-6 px-6 md:px-10 lg:px-6 xl:px-10 sm:border-x sm:border-neutral-700 sm:border-dashed">
          <Navbar />
          <div className="flex flex-col justify-center items-center ">
            <AnimateScroll delay={100}>
              <div className="flex flex-col justify-center items-center">
                <div className="mt-20 flex justify-center items-center">
                  <div className="py-1 rounded-full bg-white/95 flex items-center px-1 gap-1 sm:gap-2 text-black">
                    <div className="bg-cyan-300 rounded-full px-1.5 sm:px-6 py-1 font-semibold">
                      Draw
                    </div>
                    <div className="sm:text-lg">Your infinite canvas awaits</div>
                    <Link
                      href="/canvas"
                      className="hover:bg-cyan-400 rounded-full p-1 transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-4 sm:gap-8 mt-14">
                  <div className="2xl:w-6xl text-4xl sm:text-5xl md:text-6xl text-center tracking-wider leading-14 sm:leading-24 xl:px-0 lg:px-8 md:px-6">
                    Every <span className="text-cyan-400">ძထძℓ౿</span> begins with a
                    spark illuminating creativity
                  </div>
                  <div className="text-xl xl:text-2xl md:w-2xl lg:w-3xl text-center text-white/60">
                    Let your doodles turn into memories! Create shapes effortlessly
                    or just have fun — Doodle Space is your boundless space to
                    create and grow
                  </div>
                  <button
                    className="bg-cyan-300 text-black px-10 sm:px-16 py-3 rounded-full text-3xl mt-10 hover:cursor-pointer hover:scale-110 hover:bg-cyan-400 transition-all duration-300 ease-in-out shadow-md shadow-cyan-300"
                    onClick={() => router.push("/signin")}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </AnimateScroll>
            <AnimateScroll delay={100}>
              <Grid />
            </AnimateScroll>
            <AnimateScroll delay={100}>
              <Video />
            </AnimateScroll>
            <AnimateScroll delay={100}>
              <Features />
            </AnimateScroll>
            <AnimateScroll delay={100}>
              <CTA />
            </AnimateScroll>
            <AnimateScroll delay={100}>
              <Footer />
            </AnimateScroll>
          </div>
        </div>
      </div>
    </>
  );
}
