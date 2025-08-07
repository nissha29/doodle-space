import { useUserStore } from "@/store/useUserStore";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router  = useRouter();
    return <div className={`absolute bottom-6 left-6`}>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              useUserStore.getState().setUser({ name: '', email: '' });
              router.push('/signin')
            }}
            className="group flex items-center gap-2.5 rounded-lg bg-neutral-700/60 px-3 py-2 text-base text-neutral-200 backdrop-blur-sm transition-all duration-200 hover:bg-rose-500 hover:text-white hover:cursor-pointer"
          >
            <span>Logout</span>
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
          </button>
        </div>
}