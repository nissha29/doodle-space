
import Link from 'next/link';
import { Ghost, Home, PlusCircle } from 'lucide-react';

export default function RoomNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        
        <Ghost className="h-24 w-24 text-cyan-500/80" />

        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-100">
          That Space Has Vanished
        </h1>
        
        <p className="max-w-md text-lg text-neutral-400">
          The collaboration room you were looking for doesn't exist, or the link may be broken. Don't worry, you're not lost in space!
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full">
          <Link
            href="/canvas" 
            className="group flex w-full items-center justify-center gap-3 rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:bg-cyan-700"
          >
            <Home className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            <span>Go to Canvas</span>
          </Link>
          
          <Link
            href="/draw-mode" 
            className="group flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-3 font-semibold text-neutral-200 transition-all duration-200 hover:border-neutral-600 hover:bg-neutral-800"
          >
            <PlusCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
            <span>Create a New Room</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
