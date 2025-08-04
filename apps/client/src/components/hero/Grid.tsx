import { useEffect, useState } from "react";
import Image from "next/image";

const TOTAL_IMAGES = 5;

function Overlay({ show }: { show: boolean}) {
  return (
    <div
      className={`absolute inset-0 bg-black/40 flex items-center justify-center
        transition-opacity duration-700 z-10
        ${show ? "opacity-100" : "opacity-0"}`}
    >
    </div>
  );
}

export default function Grid() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TOTAL_IMAGES);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  let imgIdx = 0;

  return (
    <div>
      <div>
        <div className="flex flex-col sm:flex-row gap-1.5 mt-28">

          <div className="flex flex-col gap-1.5 px:20 sm:px-0">
            <div className="flex gap-1.5">
            
              <div className="relative lg:w-60 lg:h-60 md:w-52 md:h-52 sm:w-44 sm:h-44 w-40 h-40">
                <Image
                  src="/girlie.png"
                  alt="girlie"
                  fill
                  className="object-cover rounded-t-xl"
                  sizes="240px"
                />
                <Overlay show={activeIndex === imgIdx++} />
              </div>
              
              <div className="relative lg:w-60 lg:h-60 md:w-52 md:h-52 sm:w-44 sm:h-44 w-40 h-40">
                <Image
                  src="/flowers.png"
                  alt="image"
                  fill
                  className="object-cover rounded-t-xl"
                  sizes="240px"
                />
                <Overlay show={activeIndex === imgIdx++} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
        
              <div className="relative w-full h-60">
                <Image
                  src="/couple.png"
                  alt="couple"
                  fill
                  className="object-cover w-full sm:rounded-b-xl"
                  sizes="240px"
                />
                <Overlay show={activeIndex === imgIdx++} />
              </div>
            </div>
          </div>
    
          <div className="flex flex-row sm:flex-col gap-1.5">

            <div className="relative lg:w-60 lg:h-72 md:w-52 md:h-60 sm:w-44 sm:h-60 w-full h-44">
              <Image
                src="/boy.png"
                alt="boy"
                fill
                className="object-cover sm:rounded-t-xl rounded-b-xl"
                sizes="240px"
              />
              <Overlay show={activeIndex === imgIdx++} />
            </div>

            <div className="relative w-full lg:h-48 md:h-52 sm:h-44">
              <Image
                src="/tea-boy.png"
                alt="image"
                fill
                className="object-cover rounded-b-xl"
                sizes="240px"
              />
              <Overlay show={activeIndex === imgIdx++} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
