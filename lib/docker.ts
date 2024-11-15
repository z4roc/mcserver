"use server";

import { Container } from "@/types/docker";
import { exec } from "child_process";
import { promisify } from "util";

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
      // containerInfos.push(JSON.parse(containerInfo) as Container);
    }
    return containerInfos;
  } catch (error) {
    return [] as Container[];
  }
};
