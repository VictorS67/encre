import os from 'os';
import {
  ISystemService,
  ProcessInfo,
  SystemInfo,
  SystemUsageInfo,
  TimeInfo,
} from '../system.interface.js';

class SystemService implements ISystemService {
  constructor() {}

  public getSystemInfo(): SystemInfo {
    const systemInfo: SystemInfo = {
      cpus: os.cpus(),
      network: os.networkInterfaces(),
      os: {
        platform: process.platform,
        version: os.release(),
        freemem: os.freemem(),
        totalmem: os.totalmem(),
        uptime: os.uptime(),
      },
      user: os.userInfo(),
    };

    return systemInfo;
  }

  public getSystemTime(): TimeInfo {
    const now: Date = new Date();
    const utc: Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

    const time: TimeInfo = {
      date: now,
      utc,
    };

    return time;
  }

  public getSystemUsage(): SystemUsageInfo {
    const freemem: number = os.freemem();
    const totalmem: number = os.totalmem();

    const systemUsageInfo: SystemUsageInfo = {
      processMemory: process.memoryUsage(),
      systemMemory: {
        free: freemem,
        total: totalmem,
        percentFree: Math.round((freemem / totalmem) * 100),
      },
      processCPU: process.cpuUsage(),
      systemCPU: os.cpus(),
    };

    return systemUsageInfo;
  }

  public getProcessInfo(): ProcessInfo {
    const processInfo: ProcessInfo = {
      processCPU: process.cpuUsage(),
      memUsage: process.memoryUsage(),
      processENV: process.env,
      pid: process.pid,
      uptime: process.uptime(),
      appVersion: process.version,
      nodeDepVersion: process.versions,
    };

    return processInfo;
  }
}

export default SystemService;
