"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export function FloatingAddServer() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link
        href="/submit"
        className="group flex items-center gap-2 bg-indigo-600/90 hover:bg-indigo-500 text-white px-4 py-3 rounded-full shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-300 backdrop-blur-sm"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Your Server</span>
      </Link>
    </div>
  );
}
