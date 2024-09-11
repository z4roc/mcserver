"use client";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Container } from "@/types/docker";
import { Container as ContainerIcon } from "lucide-react";
export default function InstanceCard({ instance }: { instance: Container }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <ContainerIcon />
          <h1 className="text-2xl font-bold">
            {instance.Name.replace("/", "")}
          </h1>
          <Dot status={instance.State.Status} />
        </div>
      </CardHeader>
      <CardContent>
        <p>{instance.Image}</p>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}

function Dot({ status }: { status: string }) {
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
