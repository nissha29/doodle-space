import Link from "next/link";

const navBarLinkStyles = `hover:bg-cyan-300 hover:text-black rounded-full hover:py-1 hover:px-3 transition-all ease-in-out duration-300 hover:cursor-pointer hover:scale-105`;

export default function Navbar() {
  return (
    <div className="flex justify-between">
      <div className="">
        <div className="text-2xl sm:text-3xl">
          ძထძℓꫀ
          <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">ᦓραсꫀ</span>
        </div>
      </div>
      <div className="flex gap-16 justify-center items-center text-xl z-10">
        <Link href="/" className={navBarLinkStyles}>
          Home
        </Link>
        <Link href="#demo" className={navBarLinkStyles}>
          Demo
        </Link>
        <Link href="#features" className={navBarLinkStyles}>
          {" "}
          Features
        </Link>
        <Link href="" className={navBarLinkStyles}>
          About
        </Link>
      </div>
      <div className="flex gap-10 justify-center items-center text-xl">
        <Link href="/signup" className={`hover:underline underline-offset-8 decoration-2 decoration-cyan-400 transition-all ease-in-out duration-200 hover:cursor-pointer hover:scale-105`}>Try Now</Link>
        <Link href="/signin" className="text-black bg-cyan-300 rounded-full px-8 py-2 hover:cursor-pointer hover:scale-105 transition-all ease-in-out duration-300">
          Sign in
        </Link>
      </div>
    </div>
  );
}
