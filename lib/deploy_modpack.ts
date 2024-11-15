"use server";

import { Modpack } from "@/types/modpack";
import { exec } from "child_process";
import { promisify } from "util";

const command = promisify(exec);

export const deployTestModpack = async (
  modpack: Modpack,
  port: number = 25565
) => {
  const { stdout, stderr } = await command(
    `docker run --env-file=.env --name mcdocker-${modpack.slug} -d -it -p ${port}:25565 -e EULA=TRUE -e TYPE=AUTO_CURSEFORGE -e CF_SLUG=${modpack.slug} itzg/minecraft-server`
  );
  console.log(stdout);
  console.log(stderr);
};
