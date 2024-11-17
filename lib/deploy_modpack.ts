"use server";

import { Modpack } from "@/types/modpack";
import { exec } from "child_process";
import { memo } from "react";
import { promisify } from "util";

const command = promisify(exec);

export const deployModpack = async (
  modpack: Modpack,
  port: number = 25565,
  players: number = 10,
  seed: number | null = null,
  memory: number = 4
) => {
  console.log("Deploying", modpack.slug);
  const { stdout, stderr } = await command(
    `docker run --env-file=.env --name mcdocker-${modpack.slug} -d -it -p ${port}:25565 -e EULA=TRUE -e INIT_MEMORY=1G -e MAX_MEMORY=${memory}G -e TYPE=AUTO_CURSEFORGE -e CF_SLUG=${modpack.slug} itzg/minecraft-server`
  );
  console.log(stdout);
  console.log(stderr);

  if (stderr) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
};

export const deployVanilla = async (
  port: number = 25565,
  players: number = 10,
  seed: number | null = null
) => {
  console.log("Deploying Vanilla");
  const { stdout, stderr } = await command(
    `docker run --name mcdocker-vanilla -d -it -p ${port}:25565 -e EULA=TRUE itzg/minecraft-server`
  );
  console.log(stdout);
  console.log(stderr);

  if (stderr) {
    throw new Error(stderr);
  } else {
    return stdout;
  }
};
