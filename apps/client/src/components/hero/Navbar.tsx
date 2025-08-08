import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const navBarLinkStyles = `hover:bg-cyan-300 hover:text-black rounded-full hover:py-1 hover:px-3 transition-all ease-in-out duration-300 hover:cursor-pointer hover:scale-105`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="flex justify-between relative">
      <div className="">
        <div className="text-2xl sm:text-3xl">
          ძထძℓ౿
          <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">ᦓραс౿</span>
        </div>
      </div>

      <div className="pl-10 lg:flex lg:gap-10 xl:gap-16 justify-center items-center text-xl z-10 hidden">
        <Link href="/" className={navBarLinkStyles}>
          Home
        </Link>
        <Link href="#demo" className={navBarLinkStyles}>
          How it works
        </Link>
        <Link href="#features" className={navBarLinkStyles}>
          {" "}
          Features
        </Link>
      </div>
      <div className="lg:flex lg:gap-6 xl:gap-10 justify-center items-center text-xl hidden">
        <Link href="/canvas" className={`hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200 hover:cursor-pointer hover:scale-105`}>Draw Solo</Link>
        <Link href="/signup" className="text-black bg-cyan-300 rounded-full px-8 py-2 hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-300">
          Sign up
        </Link>
      </div>
      <div className="lg:hidden flex">{isOpen ? <Plus className="hover:cursor-pointer rotate-45" onClick={() => setIsOpen(prev => !prev)} /> : <Menu
        className="hover:cursor-pointer" onClick={() => setIsOpen(prev => !prev)} />}</div>
      {isOpen && <div className="bg-white px-1 py-2 text-black absolute top-14 w-full z-10">
        <div className="flex flex-col space-y-4 px-4">
          <Link href="#" className="text-gray-800 font-medium hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200">
            Home
          </Link>
          <Link href="#demo" className="text-gray-800 font-medium hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200">
            How it works
          </Link>
          <Link href="#features" className="text-gray-800 font-medium hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200">
            Features
          </Link>
          <Link href="/canvas" className="text-gray-800 font-medium hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200">
            Draw Solo
          </Link>
          <button className="bg-cyan-400 cursor-pointer text-black px-4 py-2 rounded-full font-light w-full " onClick={() => router.push('/signup')}>
            Sign up
          </button>
        </div>
      </div>}
    </div>
  );
}
