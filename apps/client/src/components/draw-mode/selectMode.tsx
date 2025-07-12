import Link from "next/link";

const Draw = () => {
  return (
    <svg
      className="w-6 h-6 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
};

const Join = () => {
  return (
    <svg
      className="w-6 h-6 text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
};

const Create = () => {
  return (
    <svg
      className="w-6 h-6 text-purple-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
      />
    </svg>
  );
};

const Play = () => {
  return (
    <svg
      className="w-6 h-6 text-orange-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-8v8m-4 0h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
};

export const modes = {
  draw: {
    text: "Draw Solo",
    description: "Create your own",
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    hoverBgColor: "group-hover:bg-blue-500/30",
    hoverTextColor: "group-hover:text-blue-400",
    Icon: Draw,
  },
  join: {
    text: "Join Room",
    description: "Collaborate with others",
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    hoverBgColor: "group-hover:bg-green-500/30",
    hoverTextColor: "group-hover:text-green-400",
    Icon: Join,
  },
  create: {
    text: "Create New Room",
    description: "Start a new collaboration",
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    hoverBgColor: "group-hover:bg-purple-500/30",
    hoverTextColor: "group-hover:text-purple-400",
    Icon: Create,
  },
  play: {
    text: "Play Game",
    description: "Fun drawing game",
    color: "text-orange-400",
    bgColor: "bg-orange-500/20",
    hoverBgColor: "group-hover:bg-orange-500/30",
    hoverTextColor: "group-hover:text-orange-400",
    Icon: Play,
  },
};

interface SelectModeProps {
  type: keyof typeof modes;
  href?: string;
  onClick?: () => void;
}

export default function SelectMode({ type, href = "", onClick }: SelectModeProps) {
  const mode = modes[type];
  const IconComponent = mode.Icon;

  const isNavigation = type === "draw" || type === "play";

  const content = (
    <div className="flex flex-col items-center p-6 rounded-xl border border-neutral-600 hover:border-neutral-500 transition-all duration-200 hover:bg-neutral-800/30">
      <div className={`w-12 h-12 rounded-full ${mode.bgColor} flex items-center justify-center mb-4 ${mode.hoverBgColor} transition-colors`}>
        <IconComponent />
      </div>
      <span className={`text-xl font-medium text-white ${mode.hoverTextColor} transition-colors`}>
        {mode.text}
      </span>
      <span className="text-neutral-400 mt-2 text-center">
        {mode.description}
      </span>
    </div>
  );

  if (isNavigation) {
    return (
      <Link href={href} className="group">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className="group bg-transparent border-none p-0" onClick={onClick}>
      {content}
    </button>
  );
}
