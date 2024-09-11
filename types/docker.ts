export interface Container {
  Id: string;
  Created: string;
  Path: string;
  Args: any[];
  State: State;
  Image: string;
  ResolvConfPath: string;
  HostnamePath: string;
  HostsPath: string;
  LogPath: string;
  Name: string;
  RestartCount: number;
  Driver: string;
  Platform: string;
  MountLabel: string;
  ProcessLabel: string;
  AppArmorProfile: string;
  ExecIDs: any;
  HostConfig: HostConfig;
  GraphDriver: GraphDriver;
  Mounts: Mount[];
  Config: Config2;
  NetworkSettings: NetworkSettings;
}

export interface State {
  Status: string;
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: boolean;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: string;
  FinishedAt: string;
  Health: Health;
}

export interface Health {
  Status: string;
  FailingStreak: number;
  Log: any[];
}

export interface HostConfig {
  Binds: any[];
  ContainerIDFile: string;
  LogConfig: LogConfig;
  NetworkMode: string;
  PortBindings: PortBindings;
  RestartPolicy: RestartPolicy;
  AutoRemove: boolean;
  VolumeDriver: string;
  VolumesFrom: any;
  ConsoleSize: number[];
  CapAdd: any;
  CapDrop: any;
  CgroupnsMode: string;
  Dns: any;
  DnsOptions: any;
  DnsSearch: any;
  ExtraHosts: any;
  GroupAdd: any;
  IpcMode: string;
  Cgroup: string;
  Links: any;
  OomScoreAdj: number;
  PidMode: string;
  Privileged: boolean;
  PublishAllPorts: boolean;
  ReadonlyRootfs: boolean;
  SecurityOpt: any;
  UTSMode: string;
  UsernsMode: string;
  ShmSize: number;
  Runtime: string;
  Isolation: string;
  CpuShares: number;
  Memory: number;
  NanoCpus: number;
  CgroupParent: string;
  BlkioWeight: number;
  BlkioWeightDevice: any;
  BlkioDeviceReadBps: any;
  BlkioDeviceWriteBps: any;
  BlkioDeviceReadIOps: any;
  BlkioDeviceWriteIOps: any;
  CpuPeriod: number;
  CpuQuota: number;
  CpuRealtimePeriod: number;
  CpuRealtimeRuntime: number;
  CpusetCpus: string;
  CpusetMems: string;
  Devices: any;
  DeviceCgroupRules: any;
  DeviceRequests: any;
  MemoryReservation: number;
  MemorySwap: number;
  MemorySwappiness: any;
  OomKillDisable: boolean;
  PidsLimit: any;
  Ulimits: any;
  CpuCount: number;
  CpuPercent: number;
  IOMaximumIOps: number;
  IOMaximumBandwidth: number;
  MaskedPaths: string[];
  ReadonlyPaths: string[];
}

export interface LogConfig {
  Type: string;
  Config: Config;
}

export interface Config {}

export interface PortBindings {
  "25565/tcp": N25565Tcp[];
}

export interface N25565Tcp {
  HostIp: string;
  HostPort: string;
}

export interface RestartPolicy {
  Name: string;
  MaximumRetryCount: number;
}

export interface GraphDriver {
  Data: Data;
  Name: string;
}

export interface Data {
  LowerDir: string;
  MergedDir: string;
  UpperDir: string;
  WorkDir: string;
}

export interface Mount {
  Type: string;
  Name: string;
  Source: string;
  Destination: string;
  Driver: string;
  Mode: string;
  RW: boolean;
  Propagation: string;
}

export interface Config2 {
  Hostname: string;
  Domainname: string;
  User: string;
  AttachStdin: boolean;
  AttachStdout: boolean;
  AttachStderr: boolean;
  ExposedPorts: ExposedPorts;
  Tty: boolean;
  OpenStdin: boolean;
  StdinOnce: boolean;
  Env: string[];
  Cmd: any;
  Healthcheck: Healthcheck;
  Image: string;
  Volumes: Volumes;
  WorkingDir: string;
  Entrypoint: string[];
  OnBuild: any;
  Labels: Labels;
  StopSignal: string;
}

export interface ExposedPorts {
  "25565/tcp": N25565Tcp2;
}

export interface N25565Tcp2 {}

export interface Healthcheck {
  Test: string[];
  Interval: number;
  StartPeriod: number;
  Retries: number;
}

export interface Volumes {
  "/data": Data2;
}

export interface Data2 {}

export interface Labels {
  "org.opencontainers.image.authors": string;
  "org.opencontainers.image.created": string;
  "org.opencontainers.image.description": string;
  "org.opencontainers.image.licenses": string;
  "org.opencontainers.image.ref.name": string;
  "org.opencontainers.image.revision": string;
  "org.opencontainers.image.source": string;
  "org.opencontainers.image.title": string;
  "org.opencontainers.image.url": string;
  "org.opencontainers.image.version": string;
}

export interface NetworkSettings {
  Bridge: string;
  SandboxID: string;
  SandboxKey: string;
  Ports: Ports;
  HairpinMode: boolean;
  LinkLocalIPv6Address: string;
  LinkLocalIPv6PrefixLen: number;
  SecondaryIPAddresses: any;
  SecondaryIPv6Addresses: any;
  EndpointID: string;
  Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  MacAddress: string;
  Networks: Networks;
}

export interface Ports {}

export interface Networks {
  bridge: Bridge;
}

export interface Bridge {
  IPAMConfig: any;
  Links: any;
  Aliases: any;
  MacAddress: string;
  DriverOpts: any;
  NetworkID: string;
  EndpointID: string;
  Gateway: string;
  IPAddress: string;
  IPPrefixLen: number;
  IPv6Gateway: string;
  GlobalIPv6Address: string;
  GlobalIPv6PrefixLen: number;
  DNSNames: any;
}
