"use server";

import { Modpack } from "@/types/modpack";
import { exec } from "child_process";
import { promisify } from "util";

const command = promisify(exec);

export const deployTestModpack = async (modpack: Modpack) => {
  const { stdout, stderr } = await command(
    `docker run --name mcdocker-${modpack.name} -d -it -p 25565:25565 -e EULA=TRUE itzg/minecraft-server`
  );

  console.log(stdout);
  console.log(stderr);
};
