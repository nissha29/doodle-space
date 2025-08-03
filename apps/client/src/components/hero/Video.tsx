import Image from "next/image";

export default function Video() {
  return (
    <div className="relative" id="demo">
      <div className="hidden sm:flex absolute -right-5 sm:-right-9 lg:-right-5 xl:-right-2 top-20 sm:top-20 md:top-8 lg:top-10"><Image width={100} height={100} src="/arrow.svg" alt="image" className="rotate-180 md:w-60 md:h-60 w-44 h-44" /></div>
      <div className="mt-28 flex flex-col justify-center items-center 2xl:px-28">
        <div className="flex">
          <div className="text-3xl sm:text-4xl lg:text-5xl">
            A Quick <span className="bg-cyan-300 px-3 text-black">Look</span> Inside
          </div>

        </div>
        <video
          src="/doodle.mp4"
          controls
          width={1200}
          height={1200}
          className="rounded-xl sm:rounded-4xl p-1 lg:p-3 mt-16 w-full h-full"
        />
      </div>
    </div>
  );
}