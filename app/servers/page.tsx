"use client";

import { Modcard, FeaturedCard } from "@/components/Modcard";
import AppNavBar from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getFeaturedModpacks, getGames, getMods } from "@/lib/curseforge_api";
import type { Featured, Modpack } from "@/types/modpack";
import { useEffect, useState } from "react";
import Image from "next/image";
import { deployTestModpack } from "@/lib/deploy_modpack";
import { Input } from "@/components/ui/input";

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

function VanillaCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Image
            src={"/minecraft-icon-512.png"}
            height={64}
            width={64}
            alt="mcicon"
            className="rounded-md object-contain h-[64px] w-[64px]"
          />
          <h1 className="text-2xl font-bold">{"Vanilla"}</h1>
          <Button
            variant="default"
            className="ml-auto"
            onClick={() => deployTestModpack({ slug: "vanilla" } as Modpack)}
          >
            Deploy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>{"The default experience of Minecraft"}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
