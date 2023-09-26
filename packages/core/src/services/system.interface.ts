export type CPUInfo = {
  model: string;
  speed: number;
  times: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  };
};

export type OSInfo = {
  platform: string;
  version: string;
  freemem: number;
  totalmem: number;
  uptime: number;
};

export type NetworkInfo = {
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
  cidr: string | null;
};

export type SystemUserInfo = {
  username: string;
  uid: number;
  gid: number;
  shell: string;
  homedir: string;
};

export type SystemInfo = {
  cpus: CPUInfo[];
  network: Record<string, NetworkInfo[] | undefined>;
  os: OSInfo;
  user: SystemUserInfo;
};

export type TimeInfo = {
  date: Date,
  utc: Date
}

export type ProcessCPU = {
  user: number,
  system: number
}

export type MemoryUsage = {
  rss: number;
  heapTotal: number;
  heapUsed: number;
  external: number;
}

export type NodeDepVersion = {
  http_parser: string;
	node: string;
	v8: string;
	ares: string;
	uv: string;
	zlib: string;
	modules: string;
	openssl: string;
}

export type ProcessInfo = {
  processCPU: ProcessCPU,
  memUsage: MemoryUsage,
  processENV: Record<string, string | undefined>,
  pid: number;
  uptime: number;
  appVersion: string;
  nodeDepVersion: NodeDepVersion;
}

export type SystemMemory = {
	total: number;
	free: number;
	percentFree: number;
}

export type SystemUsageInfo = {
  processMemory: MemoryUsage;
  systemMemory: SystemMemory;
  processCPU: ProcessCPU;
  systemCPU: CPUInfo[];
}

export interface ISystemService {
  getSystemInfo(): SystemInfo;
  getSystemTime(): TimeInfo;
  getSystemUsage(): SystemUsageInfo;
  getProcessInfo(): ProcessInfo;
}
