import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {deployVanilla} from "@/lib/deploy_modpack";
import {useToast} from "@/hooks/use-toast";
import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

export function VanillaCard() {
    const {toast} = useToast();
    const [port, setPort] = useState<number>(25565);
    const [players, setPlayers] = useState<number>(10);
    const [seed, setSeed] = useState<number | null>(null);


    const deploy = () => {
        deployVanilla(port, players, seed ? seed : null)
            .then(() => {
                toast({
                    title: "Vanilla deployed",
                    description: `on port ${port}`,
                    variant: "default",
                });
            })
            .catch((err) => {
                toast({
                    title: "Error deploying Vanilla",
                    description: err.message,
                    variant: "destructive",
                });
            });
    }

    return (
        <Dialog>
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
                        <DialogTrigger asChild>
                            <Button variant="default" className="ml-auto">
                                Deploy
                            </Button>
                        </DialogTrigger>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>The default experience of Minecraft</p>
                </CardContent>
                <CardFooter></CardFooter>
            </Card>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deploy a Vanilla Server</DialogTitle>
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
                    <Button type="submit" onClick={deploy}>
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
