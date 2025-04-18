"use client";

import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignedIn, UserButton } from "@clerk/nextjs";

function Navbar() {
  return (
    <nav className="relative z-20 py-4 px-4 md:px-8 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* <Zap className="w-6 h-6 text-purple-400" />
          <span className="text-xl font-bold text-slate-100">
            AI App Assistant
          </span> */}
          <Image src="/logo.png" alt="Logo" width={150} height={150} />
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/history">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:bg-slate-800/70 hover:text-white"
            >
              History
            </Button>
          </Link>
          <Link href="/create">
            {" "}
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
            >
              Launch App <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>

          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
