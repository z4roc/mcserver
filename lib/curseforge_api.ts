"use server";

import {Featured, Modpack} from "@/types/modpack";
import {Curseforge} from "node-curseforge";
import {config} from "@/qs.config";

const apiKey = config.curseforge_api_key;

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

    console.log(apiKey);
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

export const getFeaturedModpacks = async (game: string="minecraft") => {
    const game_obj = await curseforge.get_game(game);
    const req = await fetch(baseUrl + "/v1/mods/featured", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({
            gameId: game_obj.id,
            excludedModIds: [],
        }),
    });
    console.log(game_obj);
    console.log("FEATURED");
    const result = await req.json();

    console.log(result.data.featured);

    return result.data as Featured;
};

export const searchModpacks = async (query: string, game: string="minecraft") => {
    const game_obj = await curseforge.get_game(game);
    let queryParams = {
        gameId: game_obj.id.toString(),
        searchFilter: query,
    }
    const req = await fetch(baseUrl + "/v1/mods/search?" + new URLSearchParams(queryParams),
        {
        method: "GET",
        headers: requestHeaders,
    });
    const result = await req.json();

    console.log(result.data)

    return result.data as Modpack[];
}

export const getModpackBySlug = async (slug: string, game: string="minecraft") => {
    const game_obj = await curseforge.get_game(game);
    let queryParams = {
        gameId: game_obj.id.toString(),
        slug: slug,
    }
    const req = await fetch(baseUrl + "/v1/mods/search?" + new URLSearchParams(queryParams),
        {
        method: "GET",
        headers: requestHeaders,
    });
    const result = await req.json();

    console.log(result.data[0])

    return result.data[0] as Modpack;
}