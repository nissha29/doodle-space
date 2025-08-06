
import Link from 'next/link';
import { Ghost, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white p-4">
      <div className="flex flex-col items-center gap-6 text-center">
        
        <Ghost className="h-24 w-24 text-cyan-500/80" />

        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-100">
          404 - Page Not Found
        </h1>
        
        <p className="max-w-md text-lg text-neutral-400">
          The page you are looking for does not exist. It might have been moved or the link is incorrect.
        </p>

        <div className="mt-8">
          <Link
            href="/" 
            className="group flex items-center justify-center gap-3 rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-cyan-700"
          >
            <Home className="h-5 w-5 transition-transform group-hover:-rotate-12" />
            <span>Return Home</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
