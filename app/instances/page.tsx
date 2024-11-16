"use client";
import { getContainers } from "@/lib/docker";
import React, { useEffect } from "react";
import InstanceCard from "@/components/InstanceCard";
import { useInstancesStore } from "@/lib/instances";
import { LoadingSpinner } from "@/components/Loading";

export default function page() {
  const { instances, setInstances } = useInstancesStore();
  const [isLoading, setIsLoading] = React.useState(false);
  useEffect(() => {
    setIsLoading(true);
    getContainers().then((containers) => {
      setInstances(containers);
      setIsLoading(false);
    });
  }, []);

  return (
    <main className="max-w-[100vw] h-[calc(100vh-68px)] max-h-[calc(100vh-68px)] flex flex-col">
      <div className="m-2 p-4 max-h-[calc(100vh-68px)]">
        <h1 className="text-lg font-bold mb-4">Instances</h1>
        {isLoading && <LoadingSpinner className="" />}
        <div className="flex flex-col gap-4 max-h-[calc(100vh-68px)]">
          {instances &&
            !isLoading &&
            (instances.length > 0 ? (
              instances.map((instance) => {
                return <InstanceCard key={instance.Id} instance={instance} />;
              })
            ) : (
              <div>
                <p>
                  You dont have any instances, create one by browsing servers!
                </p>
                <br />
                <a className="btn btn-primary" href="/servers">
                  Browse Modpacks
                </a>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}
