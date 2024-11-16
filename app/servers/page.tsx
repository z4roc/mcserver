"use client";

import { Modcard } from "@/components/Modcard";
import { getFeaturedModpacks, getMods } from "@/lib/curseforge_api";
import type { Featured, Modpack } from "@/types/modpack";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {VanillaCard} from "@/components/VanillaCard";

export default function Modpacks() {
  const [modpacks, setModpacks] = useState<Modpack[] | null>(null);
  const [featured, setFeatured] = useState<Featured | null>(null);
  useEffect(() => {
    getMods().then((result) => {
      setModpacks(result);
    });
    getFeaturedModpacks().then((result) => {
      setFeatured(result);
    });
  }, []);
  return (
    <main className="flex flex-col">
      <div className="m-2 p-4">
        <Input placeholder="Search... (not working yet)" />
        <section id="vanilla">
          <h1 className="text-lg font-bold mt-4 mb-4">Vanilla</h1>
          <VanillaCard />
        </section>
        <section id="modpacks">
          <h1 className="text-lg font-bold mt-4 mb-4">Modpacks</h1>
          <div className="flex flex-col gap-4">
            <h1>Fully Supported</h1>
            {modpacks &&
              modpacks.map((mod) => {
                return <Modcard mod={mod} key={mod.id} />;
              })}
            <h1>Featured by Curseforge</h1>
            {featured &&
              featured.featured.map((mod) => {
                return <Modcard mod={mod} key={mod.id} />;
              })}
          </div>
        </section>
      </div>
    </main>
  );
}

