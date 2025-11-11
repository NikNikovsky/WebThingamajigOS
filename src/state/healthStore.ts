import { writable } from 'svelte/store';

interface HealthStatus {
  isAlive: boolean;
  lastChecked: Date | null;
  checkInterval: number;
}

function createHealthStore() {
  const initialState: HealthStatus = {
    isAlive: true,
    lastChecked: null,
    checkInterval: 30000, // 30 seconds
  };

  const { subscribe, set, update } = writable(initialState);

  let checkInterval: ReturnType<typeof setInterval> | null = null;

  async function checkHealth() {
    try {
      // Try a simple fetch to the server root - if it responds, server is alive
      const response = await fetch('/fatuus/', { method: 'HEAD' });
      const isAlive = response.ok || response.status === 404; // 404 is fine, means server is responding
      
      update(state => ({
        ...state,
        isAlive,
        lastChecked: new Date(),
      }));

      console.log(`[Health Check] Server is ${isAlive ? 'alive' : 'down'} at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.log(`[Health Check] Server is down - ${error}`);
      update(state => ({
        ...state,
        isAlive: false,
        lastChecked: new Date(),
      }));
    }
  }

  function startHealthCheck() {
    // Check immediately
    checkHealth();
    
    // Then check every 30 seconds
    checkInterval = setInterval(() => {
      checkHealth();
    }, 30000);
    
    console.log('[Health Check] Started periodic health checks every 30 seconds');
  }

  function stopHealthCheck() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
      console.log('[Health Check] Stopped health checks');
    }
  }

  return {
    subscribe,
    startHealthCheck,
    stopHealthCheck,
    checkHealth,
  };
}

export const healthStore = createHealthStore();
