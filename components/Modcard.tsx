"use client";

import {deployModpack} from "@/lib/deploy_modpack";
import {Modpack} from "@/types/modpack";
import React, {useState} from "react";
import {Card, CardContent, CardFooter, CardHeader} from "./ui/card";
import {Button} from "./ui/button";
import {useToast} from "@/hooks/use-toast";
import {ToastAction} from "@radix-ui/react-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {Label} from "./ui/label";
import {Input} from "./ui/input";
import {MemorySlider} from "./MemorySlider";
import {useServerMemory} from "@/hooks/memory";
import {LoadingSpinner} from "./Loading";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {Download, ExternalLink} from "lucide-react";

export function Modcard({modpack}: { modpack: Modpack }) {
    const {toast} = useToast();
    const [port, setPort] = useState<number>(25565);
    const [players, setPlayers] = useState<number>(10);
    const [seed, setSeed] = useState<number | null>(null);
    const {memory} = useServerMemory();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <img
                            src={modpack.logo.thumbnailUrl || modpack.logo.url}
                            alt={modpack.name}
                            className="w-16 h-16 rounded-md"
                        />
                        <div className="flex flex-col">
                            <Link
                                href={`/servers/${modpack.slug}`}
                                className="flex items-center gap-4 hover:bg-[#1d283a] rounded-md p-2"
                            >
                                <h1 className="text-2xl font-bold">{modpack.name}</h1>
                            </Link>
                            <p className="text-sm text-gray-500">by {modpack.authors[0]?.name || "Unknown"}</p>
                        </div>
                        <DialogTrigger asChild>
                            <Button variant="default" className="ml-auto">
                                Deploy
                            </Button>
                        </DialogTrigger>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{modpack.summary}</p>
                    <div className="mt-4 flex gap-4 items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center gap-1 text-gray-700">
                                        <Download className="w-5 h-5"/>
                                        <span>{modpack.downloadCount}</span>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>Download Count</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href={modpack.links.websiteUrl} target="_blank" rel="noopener noreferrer">
                                        <div className="flex items-center gap-1 text-gray-700">
                                            Website
                                            <ExternalLink className="w-4 h-4 text-gray-700"> Website </ExternalLink>
                                        </div>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Website</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    </div>
                </CardContent>
            </Card>
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
                        <MemorySlider className="col-span-3"/>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={deploy}>
                        {isLoading ? <LoadingSpinner className=""/> : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function FeaturedCard({mod}: { mod: Modpack }) {
    const {toast} = useToast();
    const deployFeaturedModpack = () => {
        deployModpack(mod)
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
            .catch((err) => {
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
