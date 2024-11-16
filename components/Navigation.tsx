"use client";

import Link from "next/link";
import { Cuboid } from "lucide-react";
import React from "react";

export default function AppNavBar() {
  return (
    <nav className="flex bg-base-500 border-b-[#091637] border-b">
      <div className="p-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-xl p-3 w-fit hover:bg-blue-300 rounded-md transition-opacity duration-200 hover:opacity-80"
        >
          <Cuboid />
          <h1 className="font-bold">QuickServer</h1>
        </Link>
      </div>
      <ul className="flex items-center justify-center gap-5 px-5 ml-auto">
        <li>
          <Link
            href="/instances"
            className="font-semibold text-md  hover:bg-blue-300 rounded-md p-2 transition-opacity duration-200 hover:opacity-80 hover:text-black"
          >
            Instances
          </Link>
        </li>
        <li>
          <Link
            href="/servers"
            className="font-semibold text-md  hover:bg-blue-300 rounded-md p-2 transition-opacity duration-200 hover:opacity-80 hover:text-black"
          >
            Browse Servers
          </Link>
        </li>
      </ul>
    </nav>
  );
}
