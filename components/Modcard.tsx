"use client";

import { deployTestModpack } from "@/lib/deploy_modpack";
import { Modpack } from "@/types/modpack";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

export default function Modcard({ mod }: { mod: Modpack }) {
  const deployModpack = () => {
    deployTestModpack(mod);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <img
            src={mod.logo.url}
            height={64}
            width={64}
            className="rounded-md object-contain h-[64px] w-[64px]"
          />
          <h1 className="text-2xl font-bold">{mod.name}</h1>
          <Button
            onClick={deployModpack}
            variant="secondary"
            className="ml-auto"
          >
            Deploy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p>{mod.summary}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
