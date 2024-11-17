"use client";
import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "./ui/card";
import {Button} from "./ui/button";
import {Container} from "@/types/docker";
import {Container as ContainerIcon} from "lucide-react";
import {haltContainer, removeContainer, startContainer} from "@/lib/docker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import {useInstancesStore} from "@/lib/instances";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import {DialogClose} from "@radix-ui/react-dialog";
import {LoadingSpinner} from "./Loading";
import {formatDate} from "@/lib/utils";

export default function InstanceCard({instance}: { instance: Container }) {
    const {updateInstance, removeInstance} = useInstancesStore();

    const [isLoading, setIsLoading] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const shutdown = async () => {
        setIsLoading(true);
        console.log("Shutting down", instance.Name);
        await haltContainer(instance.Name);
        instance.State.Status = "exited";
        updateInstance(instance);
        setIsLoading(false);
    };
    const remove = async () => {
        setIsLoading(true);
        console.log("Removing", instance.Name);
        await removeContainer(instance.Name, instance.State.Status);
        setIsLoading(false);
        removeInstance(instance);
        setIsDialogOpen(false);
    };

    const start = async () => {
        setIsLoading(true);
        console.log("Starting", instance.Name);
        await startContainer(instance.Name);
        setIsLoading(false);
        instance.State.Status = "running";
        updateInstance(instance);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-4">
                    <ContainerIcon/>
                    <h1 className="text-2xl font-bold">
                        {instance.Name.replace("/", "")}
                    </h1>

                    <Dot status={instance.State.Status}/>
                </div>
            </CardHeader>
            <CardContent>
                <p>
                    Created at {formatDate(instance.Created)}, binds on Port:{" "}
                    {Object.values(instance.HostConfig.PortBindings)
                            .flat()
                            .map((binding) => binding.HostPort)
                            .join(", ")}
                </p>
            </CardContent>
            <CardFooter className="flex gap-2 last:ml-auto">
                {instance.State.Status == "running" ? (
                    <Button variant={"secondary"} onClick={shutdown} disabled={isLoading}>
                        {isLoading ? <LoadingSpinner className=""/> : "Shutdown"}
                    </Button>
                ) : (
                    <Button variant={"outline"} onClick={start} disabled={isLoading}>
                        {isLoading ? <LoadingSpinner className=""/> : "Start"}
                    </Button>
                )}
                <Dialog open={isDialogOpen}>
                    <DialogTrigger asChild>
                        <Button
                            variant={"destructive"}
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Remove
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. Are you sure you want to
                                permanently delete this container?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button type="submit" variant="destructive" onClick={remove}>
                                {isLoading ? (
                                    <LoadingSpinner className=""/>
                                ) : (
                                    "Delete permanently"
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}

function Dot({status}: { status: string }) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
          <span
              className={
                  status == "running"
                      ? "text-green-500 text-3xl ml-auto"
                      : "text-red-500 text-3xl ml-auto"
              }
          >
            ●
          </span>
                </TooltipTrigger>
                <TooltipContent>{status}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
