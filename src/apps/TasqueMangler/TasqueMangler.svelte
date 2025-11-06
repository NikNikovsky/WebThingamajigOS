<script lang="ts">
  import { windowStore } from '../../state/windowStore';  // Note: ../../ apps/TasqueMangler/
  import { onMount } from 'svelte';
  import type { Window } from '../../types/window';
  import { getUptime, type Uptime } from '../../types/uptime';
  import {get} from 'svelte/store';
  
  let windows: Window[] = [];
  let startTime: number;
  let uptime = 0;
  let timerID: number;

  onMount(() => {
    startTime = Date.now();
    
    // Subscribe to ~~clabretro~~ windowStore
    windowStore.subscribe(w => {
      windows = w;
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
        <span class="value">{windows.length}</span>
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

      {#each windows as window (window.id)}
        <div class="table-row">
          <div class="col-name">{window.appName}</div>
          <div class="col-pid">{window.id || '????'}</div>
          <div class="col-location">src/apps/{window.appName}/</div>
          <div class="col-actions">
            <button on:click={() => closeWindow(window.id)} class="close-btn">Terminate</button>
          </div>
        </div>
      {:else}
        <div class="no-processes">No running processes</div>
      {/each}
    </div>
  </div>
</div>
