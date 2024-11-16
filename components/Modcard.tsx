"use client";

import { deployTestModpack } from "@/lib/deploy_modpack";
import { Modpack } from "@/types/modpack";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Mod } from "node-curseforge";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

export function Modcard({ mod }: { mod: Modpack }) {
  const { toast } = useToast();
  const deployModpack = () => {
    deployTestModpack(mod)
      .then(() => {
        toast({
          title: "Mdopack deployed",
          description: `${mod.name} has been deployed`,
          variant: "default",
        });
      })
      .catch((err) => {
        toast({
          title: "Error deploying modpack",
          description: err.message,
          variant: "destructive",
        });
      });
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

export function FeaturedCard({ mod }: { mod: Modpack }) {
  const { toast } = useToast();
  const deployFeaturedModpack = () => {
    deployTestModpack(mod)
      .then(() => {
        toast({
          title: "Mdopack deployed",
          description: `${mod.name} has been deployed`,
          action: (
            <ToastAction altText="View Instance">
              <a href="/instances">View in Instances</a>
            </ToastAction>
          ),
        });
      })
      .catch((err) => {});
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
            variant="secondary"
            className="ml-auto"
            onClick={deployFeaturedModpack}
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
