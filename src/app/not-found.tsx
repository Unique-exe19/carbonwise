import Link from "next/link";
import { Leaf } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white mx-auto mb-6">
          <Leaf className="w-10 h-10" />
        </div>
        <h1 className="text-6xl font-bold font-heading text-gradient mb-2">404</h1>
        <p className="text-zinc-400 mb-6">This page has gone green — we couldn&apos;t find it!</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Leaf className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
