import { cn } from "@/lib/utils";

import { Infinity, Rocket, History, Brush, Hourglass, Expand } from "lucide-react";

export function Features() {
  return <div className="mt-28 flex flex-col justify-center items-center gap-0 sm:gap-5">
    <div className="text-3xl sm:text-4xl lg:text-5xl text-white">
      <span className="bg-cyan-300 px-1 text-black">Discover</span> What You Can Do
    </div>
    <FeaturesSection />
  </div>
}

export function FeaturesSection() {
  const features = [
    {
      title: "Infinite Canvas",
      description:
        "Create, explore, and collaborate without boundaries on one canvas.",
      icon: <Infinity />,
    },
    {
      title: "Ease of use",
      description:
        "Simple, intuitive tools designed for everyone to create effortlessly.",
      icon: <Rocket />,
    },
    {
      title: "Supports undo redo",
      description:
        "Track and reverse changes instantly with undo/redo support.",
      icon: <History />,
    },
    {
      title: "Free Draw",
      description: "Free draw mode provides a pencil tool so you can scribble.",
      icon: <Brush />,
    },
    {
      title: "Real-time collaboration",
      description: "Collaborate in real time and see your teammates' changes live.",
      icon: <Hourglass />,
    },
    {
      title: "Position and Scale",
      description:
        "Effortlessly move and resize shape, just drag to reposition or scale.",
      icon: <Expand />,
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature border-neutral-800",
        (index === 0 || index === 3) && "lg:border-l border-neutral-800",
        index < 3 && "lg:border-b border-neutral-800"
      )}
      id="features"
    >
      {index < 3 && (
        <div className="opacity-0 group-hover/feature:opacity-50 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
      )}
      {index >= 3 && (
        <div className="opacity-0 group-hover/feature:opacity-50 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-900 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-cyan-300">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-700 group-hover/feature:bg-cyan-300 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-100 text-xl tracking-wider">
          {title}
        </span>
      </div>
      <p className="text-neutral-300 max-w-xs relative z-10 px-10 tracking-wider">
        {description}
      </p>
    </div>
  );
};
