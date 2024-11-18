import { getModpackBySlug } from "@/lib/curseforge_api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download } from "lucide-react";
import Link from "next/link";
import { ModDeployDialog } from "@/components/dialogs/ModDeployDialog";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const modpack = await getModpackBySlug(slug);

  if (!modpack) {
    return <p>Modpack not found.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Name and Logo */}
      <div className="flex items-center gap-6 mb-6">
        <img
          src={modpack.logo.thumbnailUrl}
          alt={`${modpack.name} logo`}
          className="w-16 h-16 rounded-md"
        />
        <div>
          <h1 className="text-3xl font-bold">{modpack.name}</h1>
          <div className="flex justify-between">
            <p className="text-lg text-gray-500">
              by {modpack.authors[0]?.name || "Unknown"}
            </p>
            <p className="text-lg text-gray-500">
              created:{" "}
              {new Date(modpack.dateCreated).toLocaleDateString("de-DE", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
          </div>
        </div>
        <Link
          href={modpack.links.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="secondary" className="flex items-center gap-2">
            Visit Website <ExternalLink className="h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Description */}
      <div className="mb-6">
        <p>{modpack.summary}</p>
      </div>

      {/* Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Latest Files */}
        <Card>
          <CardHeader>
            <CardTitle>Latest Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6">
              {modpack.latestFiles
                .sort((a, b) => {
                  return a.fileDate > b.fileDate ? -1 : 1;
                })
                .map((file) => (
                  <li key={file.id} className="text-sm">
                    <a
                      href={file.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline flex items-center gap-2"
                    >
                      {file.displayName} <Download className="h-4 w-4" />
                    </a>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {/* Created At */}
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6">
              {modpack.categories.map((category) => (
                <li key={category.id} className="text-sm">
                  {category.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        {/* Download Count */}
        <Card>
          <CardHeader>
            <CardTitle>Download Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {modpack.downloadCount.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Deploy</CardTitle>
          </CardHeader>
          <CardContent>
            <ModDeployDialog modpack={modpack} />
            {/* TODO Dialog for Deployment*/}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
