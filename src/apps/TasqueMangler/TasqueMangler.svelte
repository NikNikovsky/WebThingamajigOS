<script lang="ts">
  import { windowStore } from '../../state/windowStore';
  import { processStore } from '../../state/processStore';
  import { onMount } from 'svelte';
  import type { Window } from '../../types/window';
  import { getUptime, type Uptime } from '../../types/uptime';
  import {get} from 'svelte/store';
  
  let windows: Window[] = [];
  let processes: any[] = [];
  let startTime: number;
  let uptime = 0;
  let timerID: number;

  onMount(() => {
    startTime = Date.now();
    uptime = getUptime();
    
    // Subscribe to windowStore
    windowStore.subscribe(w => {
      windows = w;
    });

    // Subscribe to processStore for actual PIDs
    processStore.subscribe(p => {
      processes = p;
    });
    
    // Update uptime every second
    timerID = window.setInterval(() => {
        uptime = getUptime();
    }, 1000);

    
    return () => clearInterval(timerID);
  });

  function closeWindow(id: string) {
    windowStore.closeWindow(id);
  }

  function minimizeWindow(id: string) {
    windowStore.minimizeWindow(id);
  }
</script>
<div class="task-manager">
  <div class="system-info">
    <h2>System Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <span class="label">Uptime:</span>
        <span class="value">{Math.floor(uptime / 60)}m {uptime % 60}s</span>
      </div>
      <div class="info-item">
        <span class="label">Running Processes:</span>
        <span class="value">{processes.length}</span>
      </div>
    </div>
  </div>
  <div class="processes-section">
    <h3>Running Processes</h3>
    <div class="processes-table">
      <div class="table-header">
        <div class="col-name">Process Name</div>
        <div class="col-pid">PID</div>
        <div class="col-location">Location</div>
        <div class="col-actions">Actions</div>
      </div>

      {#each processes as process (process.windowId)}
        <div class="table-row">
          <div class="col-name">{process.appName}</div>
          <div class="col-pid">{process.pid}</div>
          <div class="col-location">src/apps/{process.appName}/</div>
          <div class="col-actions">
            <button on:click={() => closeWindow(process.windowId)} class="close-btn">Terminate</button>
          </div>
        </div>
      {:else}
        <div class="no-processes">No running processes</div>
      {/each}
    </div>
  </div>
</div>

<style>
  .task-manager {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0;
    background: rgba(15, 15, 30, 0.95);
    color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }

  .system-info {
    padding: 20px;
    border-bottom: 1px solid rgba(102, 126, 234, 0.3);
    background: rgba(102, 126, 234, 0.05);
  }

  .system-info h2 {
    margin: 0 0 15px 0;
    font-size: 18px;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 6px;
    border: 1px solid rgba(102, 126, 234, 0.2);
  }

  .info-item .label {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .info-item .value {
    font-size: 20px;
    font-weight: bold;
    color: #667eea;
    font-family: 'Courier New', monospace;
  }

  .processes-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;
    overflow: hidden;
  }

  .processes-section h3 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #667eea;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .processes-table {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    overflow: hidden;
  }

  .table-header {
    display: grid;
    grid-template-columns: 1fr 150px 250px 120px;
    gap: 12px;
    padding: 12px 15px;
    background: rgba(102, 126, 234, 0.15);
    border-bottom: 2px solid rgba(102, 126, 234, 0.3);
    font-weight: bold;
    color: #667eea;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.5px;
  }

  .table-header > div {
    display: flex;
    align-items: center;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 150px 250px 120px;
    gap: 12px;
    padding: 12px 15px;
    border-bottom: 1px solid rgba(102, 126, 234, 0.1);
    align-items: center;
    transition: background-color 0.2s;
  }

  .table-row:hover {
    background: rgba(102, 126, 234, 0.05);
  }

  .col-name {
    color: #e0e0e0;
    font-weight: 500;
  }

  .col-pid {
    color: #999;
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }

  .col-location {
    color: #999;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .col-actions {
    display: flex;
    gap: 8px;
  }

  .close-btn {
    padding: 6px 12px;
    background: rgba(255, 100, 100, 0.2);
    border: 1px solid rgba(255, 100, 100, 0.4);
    color: #ff6464;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .close-btn:hover {
    background: rgba(255, 100, 100, 0.3);
    border-color: rgba(255, 100, 100, 0.6);
    box-shadow: 0 0 10px rgba(255, 100, 100, 0.2);
  }

  .close-btn:active {
    transform: scale(0.95);
  }

  .no-processes {
    padding: 40px 20px;
    text-align: center;
    color: #666;
    font-style: italic;
  }
</style>