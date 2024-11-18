"use client";
import { Modpack } from "@/types/modpack";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LoadingSpinner } from "../Loading";
import { MemorySlider } from "../MemorySlider";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { deployModpack } from "@/lib/deploy_modpack";
import { useToast } from "@/hooks/use-toast";
import { useServerMemory } from "@/hooks/memory";

/**
    * Deploy a modpack dialog
    * @param modpack The modpack to deploy
    * @returns A dialog to deploy a modpack
    * 
    * usage: <ModDeployDialog modpack={modpack} /> as Button trigger
    
*/
export function ModDeployDialog({ modpack }: { modpack: Modpack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [port, setPort] = useState<number>(25565);
  const [players, setPlayers] = useState<number>(10);
  const [seed, setSeed] = useState<number | null>(null);
  const { toast } = useToast();
  const { memory } = useServerMemory();
  const [isOpen, setIsOpen] = useState(false);
  const deploy = () => {
    setIsLoading(true);
    deployModpack(modpack, port, players, seed ? seed : null, memory)
      .then(() => {
        setIsLoading(false);
        toast({
          title: `${modpack.name} deployed`,
          description: `on port ${port}`,
          variant: "default",
        });
        setIsOpen(false);
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "Error deploying modpack",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  const toaster = () => {
    toast({
      title: "Toast",
      description: "I'm a toast!",
      variant: "default",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>Deploy</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deploy a {modpack.name} Server</DialogTitle>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Memory</Label>
            <MemorySlider className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={deploy}>
            {isLoading ? <LoadingSpinner className="" /> : "Confirm"}
          </Button>
          <Button type="submit" onClick={toaster}>
            Toast Me!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
