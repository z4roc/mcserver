"use server";

import { Modpack } from "@/types/modpack";
import { Curseforge, Mod } from "node-curseforge";

const apiKey = "$2a$10$d67a8pjPbso9GwbI5MvxF.wUsDh8JH3wwhw4iYdDy.wpqdFAkH4Be";

const baseUrl = "https://api.curseforge.com";

const curseforge = new Curseforge(apiKey);

type ModpackDefinition = {
  name: string;
  id: number;
};

const supportedModpacks: ModpackDefinition[] = [
  {
    name: "All The Mods 9",
    id: 715572,
  },
  {
    name: "BetterMC - BMC4 Forge",
    id: 876781,
  },
];

let minecraft = curseforge.get_game("minecraft");

const requestHeaders: HeadersInit = new Headers();
requestHeaders.set("Accept", "application/json");
requestHeaders.set("x-api-key", apiKey);
requestHeaders.set("Content-Type", "application/json");

export const getGames = async () => {
  console.log(requestHeaders.get("x-api-key"));
  const request = await fetch(`${baseUrl}/v1/games`, {
    headers: requestHeaders,
    method: "GET",
  });

  //console.log(request);

  console.log(await request.json());
};

export const getMods = async () => {
  const modpacks: Modpack[] = [];

  for (let mod in supportedModpacks) {
    const req = await fetch(baseUrl + "/v1/mods/" + supportedModpacks[mod].id, {
      method: "GET",
      headers: requestHeaders,
    });
    const data = (await req.json()).data as Modpack;
    console.log(data);
    modpacks.push(data);
  }

  return modpacks;
};
