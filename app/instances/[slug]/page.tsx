import DockerContainerDashboard from "@/components/ContainerMonitor";
import { getContainerById } from "@/lib/docker";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const container = await getContainerById(slug);
  return <DockerContainerDashboard containerParam={container} />;
}
