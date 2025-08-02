import { usePathname } from "next/navigation";

export default function useSessionMode() {
    const pathname = usePathname();
    const match = pathname.match(/^\/canvas\/room\/([^/]+)\/?$/);
    if (match) {
        return {
            mode: 'collaborative' as const,
            roomId: match[1]
        };
    }
    return {
        mode: 'solo' as const,
        roomId: null
    };
}

