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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

export function Modcard({ mod }: { mod: Modpack }) {
  const { toast } = useToast();
  const [port, setPort] = useState<number>(25565);
  const [players, setPlayers] = useState<number>(10);
  const [seed, setSeed] = useState<number | null>(null);
  const deployModpack = () => {
    deployTestModpack(mod, port, players, seed ? seed : null)
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
    <Dialog>
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
            <DialogTrigger asChild>
              <Button variant="default" className="ml-auto">
                Deploy
              </Button>
            </DialogTrigger>
          </div>
        </CardHeader>
        <CardContent>
          <p>{mod.summary}</p>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deploy a {mod.name} Server</DialogTitle>
          <DialogDescription>
            You can configure the server settings before deploying, leave fields
            empty for default values
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Port
            </Label>
            <Input
              id="name"
              defaultValue={port}
              onChange={(e) => setPort(parseInt(e.target.value))}
              type="number"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Players
            </Label>
            <Input
              className="col-span-3"
              type="number"
              onChange={(e) => setPlayers(parseInt(e.target.value))}
              defaultValue={10}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Seed</Label>
            <Input
              className="col-span-3"
              type="number"
              placeholder="random"
              onChange={(e) => setSeed(parseInt(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={deployModpack}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
