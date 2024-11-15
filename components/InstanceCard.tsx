"use client";
import React from "react";
import {Card, CardContent, CardFooter, CardHeader} from "./ui/card";
import {Button} from "./ui/button";
import {Container} from "@/types/docker";
import {Container as ContainerIcon} from "lucide-react";
import {haltContainer, removeContainer, startContainer} from "@/lib/docker";

export default function InstanceCard({instance}: { instance: Container }) {
    const shutdown = async () => {
        console.log("Shutting down", instance.Name);
        await haltContainer(instance.Name)
    }
    const remove = async () => {
        console.log("Removing", instance.Name);
        await removeContainer(instance.Name)
    }

    const start = async () => {
        console.log("Starting", instance.Name);
        await startContainer(instance.Name)
    }

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
                <p>{instance.Image}</p>
                <Button className="btn" onClick={start}>
                    Start
                </Button>
                <Button className="btn" onClick={shutdown}>
                    Shutdown
                </Button>
                <Button className="btn" onClick={remove}>
                    Remove
                </Button>
            </CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
}

function Dot({status}: { status: string }) {
    return status == "running" ? (
        <div className="tooltip ml-auto" data-tip={status}>
            <span className="text-green-500 text-3xl">●</span>
        </div>
    ) : (
        <div className="tooltip ml-auto text-3xl" data-tip={status}>
            <span className="text-red-500">●</span>
        </div>
    );
}
