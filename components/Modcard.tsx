"use client";

import { Modpack } from "@/types/modpack";
import { Card, CardContent, CardHeader } from "./ui/card";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Download, ExternalLink } from "lucide-react";
import { ModDeployDialog } from "./dialogs/ModDeployDialog";

export function Modcard({ modpack }: { modpack: Modpack }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Link
            href={`/servers/${modpack.slug}`}
            className="flex items-center gap-4 hover:bg-[#1d283a] rounded-md p-2"
          >
            <img
              src={modpack.logo.thumbnailUrl || modpack.logo.url}
              alt={modpack.name}
              className="w-16 h-16 rounded-md"
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{modpack.name}</h1>
              <p className="text-sm text-gray-500">
                by {modpack.authors[0]?.name || "Unknown"}
              </p>
            </div>
          </Link>
          <div className="ml-auto">
            <ModDeployDialog modpack={modpack} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{modpack.summary}</p>
        <div className="mt-4 flex gap-4 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-gray-700">
                  <Download className="w-5 h-5" />
                  <span>{modpack.downloadCount}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Download Count</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={modpack.links.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="flex items-center gap-1 text-gray-700">
                    Website
                    <ExternalLink className="w-4 h-4 text-gray-700">
                      {" "}
                      Website{" "}
                    </ExternalLink>
                  </div>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Website</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
