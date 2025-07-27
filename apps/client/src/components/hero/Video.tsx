import Image from "next/image";

export default function Video() {
  return (
    <div className="relative" id="demo">
      <div className="absolute -right-24 top-1"><Image src="/arrow.svg" alt="image" width={250} height={250} className="rotate-180" /></div>
      <div className="mt-14 flex flex-col justify-center items-center">
        <div className="flex">
          <div className="text-5xl">
            A Quick <span className="bg-cyan-300 px-3 text-black">Look</span> Inside
          </div>

        </div>
        <video
          src="/doodle.mp4"
          controls
          width={1200}
          height={1200}
          className="rounded-4xl p-3 mt-16 w-9xl h-1/2"
        />
      </div>
    </div>
  );
}