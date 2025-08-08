import { Github, Heart, Linkedin, Mail, Twitter } from "lucide-react";

export function Footer() {
    const socialLinks = [
        {
            icon: <Github className="w-6 h-6 hover:text-cyan-400 transition" />,
            href: "https://github.com/nissha29/Melodia",
            label: "GitHub",
        },
        {
            icon: <Linkedin className="w-6 h-6 text-blue-400 hover:text-blue-500 transition" />,
            href: "https://www.linkedin.com/in/nisha-kashyap-5972a9273/",
            label: "LinkedIn",
        },
        {
            icon: <Twitter className="w-6 h-6 text-cyan-400 hover:text-cyan-300 transition" />,
            href: "https://x.com/nissha297",
            label: "Twitter",
        },
        {
            icon: <Mail className="w-6 h-6 text-rose-400 hover:text-rose-300 transition" />,
            href: "mailto:nishakashyap2907@gmail.com",
            label: "Email",
        },
    ];

    return (
        <footer className="w-full bg-neutral-950 text-white border-t border-neutral-800 py-5 px-4">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
                <div className="lg:text-2xl sm:text-3xl">
                    ძထძℓ౿
                    <span className="px-1.5 py-0.5 rounded-xl text-cyan-400">ᦓραс౿</span>
                </div>
            
                <div className="flex gap-3 mt-4 md:mt-0">
                    {socialLinks.map((link, idx) => (
                        <a
                            key={idx}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={link.label}
                        >
                            {link.icon}
                        </a>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-2">
                <span className="text-sm text-neutral-500">
                    © {new Date().getFullYear()} Doodle Space. All rights reserved.
                </span>
                <span className="flex items-center gap-1 text-sm text-neutral-500">
                    Made with <Heart className="text-rose-400 w-4 h-4" /> by Nisha
                </span>
            </div>
        </footer>
    );
}
