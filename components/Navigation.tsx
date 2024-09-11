"use client";

import Link from "next/link";
import { Cuboid } from "lucide-react";
import React from "react";

export default function AppNavBar() {
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <Cuboid />
          <h1 className="font-bold">QuickServer</h1>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link
              href="/instances"
              className="font-semibold text-md hover:text-blue-300 transition-opacity duration-200 hover:opacity-80"
            >
              Instances
            </Link>
          </li>
          <li>
            <Link
              href="/servers"
              className="font-semibold text-md hover:text-blue-300 transition-opacity duration-200 hover:opacity-80"
            >
              Browse Servers
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
