import { getContainers } from "@/lib/docker";
import React from "react";
import InstanceCard from "@/components/InstanceCard";

export default async function page() {
  const instances = await getContainers();

  return (
    <main className="max-w-[100vw] h-[calc(100vh-68px)] flex flex-col">
      <div className="m-2 p-4">
        <h1 className="text-lg font-bold mb-4">Instances</h1>
        <div className="flex flex-col gap-4">
          {instances &&
            instances.map((instance) => {
              return <InstanceCard key={instance.Id} instance={instance} />;
            })}
        </div>
      </div>
    </main>
  );
}
