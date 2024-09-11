"use server";

import { Modpack } from "@/types/modpack";
import { exec } from "child_process";

export const deployTestModpack = (modpack: Modpack) => {
  exec("docker run -d -it -p 25565:25565 -e EULA=TRUE itzg/minecraft-server");
};
