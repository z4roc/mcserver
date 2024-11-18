"use server";

import { Container } from "@/types/docker";
import { exec } from "child_process";
import { promisify } from "util";
import path from "node:path";

const command = promisify(exec);
export const getContainers = async () => {
  try {
    const { stdout: ContainerResult } = await command(
      `docker ps -a --format "{{.ID}}"`
    );
    const containerIds = ContainerResult.split("\n");
    const containerInfos: Container[] = [];
    for (let containerId of containerIds) {
      if (containerId == "") continue;
      console.log(containerId);
      const cmdString = `docker inspect --format="{{json .}}" ` + containerId;
      const { stdout: containerInfo } = await command(cmdString);
      const container = JSON.parse(containerInfo) as Container;

      if (container.Config.Image.includes("itzg/minecraft-server")) {
        containerInfos.push(container);
        console.log(container);
      }
    }
    return containerInfos;
  } catch (error) {
    return [] as Container[];
  }
};

export const getContainerById = async (containerId: string) => {
  try {
    const cmdString = `docker inspect --format="{{json .}}" ` + containerId;
    const { stdout: containerInfo } = await command(cmdString);
    return JSON.parse(containerInfo) as Container;
  } catch (error) {
    return {} as Container;
  }
};

export const getContainerLogsStart = async (containerId: string) => {
  try {
    const { stdout, stderr } = await command(
      `docker container logs ${containerId} --since=1m`,
      { maxBuffer: 1024 * 1024 * 10 }
    );
    return stdout;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const getContainerLogsIncremental = async (containerId: string) => {
  try {
    const cmd = `docker container logs ${containerId} --since=10s`;
    console.log(cmd);
    const { stdout, stderr } = await command(
      `docker container logs ${containerId} --since=2s`,
      { maxBuffer: 1024 * 1024 * 10 }
    );
    console.log(stdout);
    console.log(stderr);
    return stdout;
  } catch (error) {
    console.log(error);
    return "";
  }
};

export const haltContainer = async (containerName: string) => {
  const { stdout, stderr } = await command(`docker stop ${containerName}`);
  console.log(stdout);
};

export const removeContainer = async (
  containerName: string,
  status: string
) => {
  if (status === "running") {
    await haltContainer(containerName);
  }
  const { stdout, stderr } = await command(`docker rm ${containerName}`);
  console.log(stdout);
};

export const startContainer = async (containerName: string) => {
  const { stdout, stderr } = await command(`docker start ${containerName}`);
  console.log(stdout);
};

export const copyWorldFromContainer = async (
    containerId: string,
    localPath: string = '/tmp',
) => {
  while (localPath.endsWith('/')) {
    localPath = localPath.substring(0, localPath.lastIndexOf('/'));
  }
  await command(`docker exec ${containerId} tar czf /tmp/world.tgz world`);
  const outputPath = path.join(localPath, `${containerId}-world.tgz`);
  await command(`docker cp ${containerId}:/tmp/world.tgz ${outputPath}`);

  return outputPath; // Return the server-side path
};