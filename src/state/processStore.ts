import { writable } from 'svelte/store';

interface ProcessInfo {
  pid: number;
  appName: string;
  windowId: string;
  startTime: Date;
}

function createProcessStore() {
  // Start PID pool at 1000
  let nextPid = 1000;
  const processes = new Map<string, ProcessInfo>();

  const { subscribe, set, update } = writable<ProcessInfo[]>([]);

  function registerProcess(windowId: string, appName: string): number {
    const pid = nextPid++;
    const processInfo: ProcessInfo = {
      pid,
      appName,
      windowId,
      startTime: new Date(),
    };
    
    processes.set(windowId, processInfo);
    updateStore();
    
    console.log(`[ProcessStore] Registered process: ${appName} with PID ${pid}`);
    return pid;
  }

  function unregisterProcess(windowId: string): void {
    const processInfo = processes.get(windowId);
    if (processInfo) {
      console.log(`[ProcessStore] Unregistered process: ${processInfo.appName} (PID ${processInfo.pid})`);
      processes.delete(windowId);
      updateStore();
    }
  }

  function getProcessPid(windowId: string): number | null {
    return processes.get(windowId)?.pid ?? null;
  }

  function getAllProcesses(): ProcessInfo[] {
    return Array.from(processes.values());
  }

  function updateStore(): void {
    set(Array.from(processes.values()));
  }

  return {
    subscribe,
    registerProcess,
    unregisterProcess,
    getProcessPid,
    getAllProcesses,
  };
}

export const processStore = createProcessStore();
