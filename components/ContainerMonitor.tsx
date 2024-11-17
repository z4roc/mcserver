"use client";

import { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Activity,
  Box,
  Cpu,
  Database,
  Network,
  Play,
  Pause,
  Trash,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/types/docker";
import {
  getContainerLogsStart,
  getContainerLogsIncremental,
  getContainerById,
} from "@/lib/docker";

export default function DockerContainerDashboard({
  containerParam,
}: {
  containerParam: Container;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<null | HTMLDivElement>(null);
  const [container, setContainer] = useState<Container>(containerParam);
  useEffect(() => {
    getContainerLogsStart(container.Id.slice(0, 12)).then((log) => {
      const ansiRegex =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
      log = log.replace(ansiRegex, "");
      setLogs(log.split("\n"));
      console.log(logRef.current);
      logRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    const interval = setInterval(() => {
      getContainerLogsIncremental(container.Id.slice(0, 12)).then((log) => {
        const ansiRegex =
          /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
        log = log.replace(ansiRegex, "");
        if (log === "") return;
        setLogs((logs) => [...logs, ...log.split("\n")]);
        logRef.current?.scrollIntoView({ behavior: "smooth" });
      });

      getContainerById(container.Id).then((container) => {
        setContainer(container);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const port = Object.keys(container.NetworkSettings.Ports)[0];

  const info = container.NetworkSettings.Ports[port] ?? {
    [0]: { HostPort: 0 },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3">
        <h1 className="text-3xl font-bold mb-6 mr-auto ">
          Docker Container Dashboard
        </h1>
        <Button
          variant="default"
          className={
            "mb-4 " + container.State.Status == "exited" ? "block" : "hidden"
          }
        >
          <Play className="h-5 w-5" />
        </Button>
        <Button
          variant="default"
          className={
            "mb-4 " + container.State.Status == "running" ? "block" : "hidden"
          }
        >
          <Pause className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Container ID</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {container.Id.slice(0, 12)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge
                variant={
                  container.State.Status === "running" ? "default" : "secondary"
                }
              >
                {container.State.Status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Health: {container.State.Health.Status}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Image</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{container.Config.Image}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {container.NetworkSettings.IPAddress}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Port: {info[0].HostPort ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Container Info</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {container.Name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Image</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {container.Config.Image}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {container.State.Status}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Health</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {container.State.Health.Status}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    IP Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {container.NetworkSettings.IPAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Exposed Port
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {info[0].HostPort}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Container Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4 font-mono text-sm">
                {logs.map((log, index) => (
                  <div key={index} className="pb-2">
                    <span style={{ color: getColorFromLog(log) }}>{log}</span>
                  </div>
                ))}
                <div ref={logRef} />
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getColorFromLog(log: string) {
  if (log.includes("ERROR")) {
    return "red";
  }
  if (log.includes("WARN")) {
    return "yellow";
  }

  if (log.includes("INFO")) {
    return "#219a0d";
  }
  return "inherit";
}
