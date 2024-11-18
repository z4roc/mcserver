"use client";

import { useState, useEffect, useRef } from "react";
import {
  Activity,
  Box,
  Database,
  Network,
  Play,
  Trash,
  Square,
  Download,
  Earth
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
  haltContainer,
  startContainer,
  removeContainer,
  executeMcCommand,
} from "@/lib/docker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { LoadingSpinner } from "./Loading";
import { useRouter } from "next/navigation";
import {Input} from "@/components/ui/input";

export default function DockerContainerDashboard({
                                                   containerParam,
                                                 }: {
  containerParam: Container;
}) {
  const [logs, setLogs] = useState<string[]>([]);
  const logRef = useRef<null | HTMLDivElement>(null);
  const [container, setContainer] = useState<Container>(containerParam);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [minecraftCommand, setMinecraftCommand] = useState<string>("");
  const [commandResult, setCommandResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("info"); // Track active tab
  const router = useRouter();

  useEffect(() => {
    getContainerLogsStart(container.Id.slice(0, 12)).then((log) => {
      const ansiRegex =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
      log = log.replace(ansiRegex, "");
      setLogs(log.split("\n"));
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (activeTab === "minecraftCommands" && event.key === "Enter" && minecraftCommand.trim()) {
        onClickExecuteCommand().then();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [activeTab, minecraftCommand]); // Dependencies include activeTab and minecraftCommand


  const onClickDownloadWorld = async () => {
    try {
      const response = await fetch(`/api/download-world?containerId=${container.Id}`);

      if (!response.ok) {
        throw new Error('Failed to download the world file.');
      }

      // Convert the response into a Blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `world.tgz`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the world file:', error);
    }
  };

  const onClickExecuteCommand = async () => {
    setIsLoading(true);
    try {
      const result: string = await executeMcCommand(container.Id, minecraftCommand);
      const formattedResult = result.trim().replace(/\x1b\[[0-9;]*m/g, "");
      setCommandResult(formattedResult);
      setMinecraftCommand(""); // Clear input field after execution
    } catch (error) {
      setCommandResult(`Error executing command: ${error}`);
    }
    setIsLoading(false);
  };

  const onClickStop = async () => {
    await haltContainer(container.Id);
    setContainer({
      ...container,
      State: { ...container.State, Status: "exited" },
    });
  };

  const onClickStart = async () => {
    await startContainer(container.Id);
    setContainer({
      ...container,
      State: { ...container.State, Status: "running" },
    });
  };

  const onClickRemove = async () => {
    setIsLoading(true);
    await removeContainer(container.Id, container.State.Status);
    setIsLoading(false);
    router.push("/instances");
  };

  const port = Object.keys(container.NetworkSettings.Ports)[0];

  const info = container.NetworkSettings.Ports[port] ?? {
    [0]: { HostPort: 0 },
  };

  function switchTab(tab: string) {
    setActiveTab(tab);
    setCommandResult(null);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-3">
        <h1 className="text-3xl font-bold mb-6 mr-auto ">
          {container.Name.slice(1)}
        </h1>
        <Button
            variant="secondary"
            onClick={onClickDownloadWorld}
            className="mb-4"
            title="Download the world file"
        >
          <Download className="h-5 w-5" />
          <Earth className="h-5 w-5" />
        </Button>
        {container.State.Status == "running" ? (
          <Button
            variant="secondary"
            onClick={onClickStop}
            className={"mb-4 "}
            title="Stop the server"
          >
            <Square className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onClickStart}
            className={"mb-4 "}
            title="Start the server"
          >
            <Play className="h-5 w-5" />
          </Button>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant={"destructive"}
              onClick={() => setIsDialogOpen(true)}
              title="Permanently delete the server"
            >
              <Trash className="h-5 w-5" />
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
              <Button
                type="submit"
                variant="destructive"
                onClick={onClickRemove}
              >
                {isLoading ? (
                  <LoadingSpinner className="" />
                ) : (
                  "Delete permanently"
                )}
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
      <Tabs defaultValue="info" className="space-y-4" onValueChange={switchTab}>
        <TabsList>
          <TabsTrigger value="info">Container Info</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="minecraftCommands">Minecraft Commands</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium">Name</dt>
                  <dd className="mt-1 text-sm ">{container.Name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium ">Image</dt>
                  <dd className="mt-1 text-sm ">{container.Config.Image}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium ">Status</dt>
                  <dd className="mt-1 text-sm ">{container.State.Status}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium ">Health</dt>
                  <dd className="mt-1 text-sm ">
                    {container.State.Health.Status}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium ">IP Address</dt>
                  <dd className="mt-1 text-sm ">
                    {container.NetworkSettings.IPAddress}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium ">Exposed Port</dt>
                  <dd className="mt-1 text-sm ">{info[0].HostPort}</dd>
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
          <TabsContent value="minecraftCommands" className="space-y-4">
              <div className="flex flex-col gap-4">
                <Input
                    placeholder="Enter a Minecraft command..."
                    value={minecraftCommand}
                    onChange={(e) => setMinecraftCommand(e.target.value)}
                />
                  <Button
                      variant="secondary"
                      onClick={onClickExecuteCommand}
                      disabled={!minecraftCommand.trim()}
                  >
                    {isLoading ? (
                        <LoadingSpinner className="" />
                    ) : (
                        "Execute Command"
                    )}
                  </Button>
                  {commandResult !== null && (
                      <div>
                          <p className="font-semibold">Command Result:</p>
                          <p className="text-gray-700 whitespace-pre-wrap">{commandResult}</p>
                      </div>
                  )}
              </div>
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
