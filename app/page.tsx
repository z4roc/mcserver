"use client";
import AppNavBar from "@/components/Navigation";
import Image from "next/image";

export default function Home() {
  return (
    <div className="hero bg-background justify-center h-[calc(100vh-68px)]">
      <div className="hero-content">
        <div className="max-w-md flex flex-col gap-2">
          <h1 className="text-5xl font-bold">Deploy Servers in Seconds</h1>
          <div className="flex gap-2 mt-4">
            <IconCard imgsrc="/minecraft-icon-512.png" />
            <IconCard imgsrc="/docker-mark-blue.png" />
            <IconCard imgsrc="/Next.js.png" />
          </div>
          <p className="py-6">
            Browser over 700 Minecraft Modpacks or just create a vanilla server,
            powered by Docker you can launch a Server within seconds just with
            one click
          </p>
          <a className="btn btn-primary" href="/servers">
            Browse Modpacks
          </a>
        </div>
      </div>
    </div>
  );
}

const IconCard = ({ imgsrc }: { imgsrc: string }) => {
  return (
    <div className="w-32 h-32 p-2 flex justify-center items-center bg-base-300 rounded-md border-solid border-2">
      <figure>
        <Image src={imgsrc} height={64} width={64} alt="mcimg" />
      </figure>
    </div>
  );
};
