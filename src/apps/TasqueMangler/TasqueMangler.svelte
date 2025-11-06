<script lang="ts">
  import { windowStore } from '../../state/windowStore';  // Note: ../../ apps/TasqueMangler/
  import { onMount } from 'svelte';
  import type { Window } from '../../types/window';
  
  let windows: Window[] = [];
  let uptime = 0;
  let startTime: number;
  let timerID: number;

  onMount(() => {
    startTime = Date.now();
    
    // Subscribe to ~~clabretro~~ windowStore
    windowStore.subscribe(w => {
      windows = w;
    });
    
    // Update uptime every second
    timerID = window.setInterval(() => {
      uptime = Math.floor((Date.now() - startTime) / 1000);
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
        <span class="label">Open Windows:</span>
        <span class="value">{windows.length}</span>
      </div>
      <div class="info-item">
        <span class="label">Browser:</span>
        <span class="value">{navigator.userAgent.split(' ').slice(-2).join(' ')}</span>
      </div>
    </div>
  </div>

  <div class="windows-section">
    <h3>Active Windows</h3>
    <div class="windows-table">
      <div class="table-header">
        <div class="col-app">App</div>
        <div class="col-title">Title</div>
        <div class="col-size">Size</div>
        <div class="col-position">Position</div>
        <div class="col-status">Status</div>
        <div class="col-actions">Actions</div>
      </div>

      {#each windows as window (window.id)}
        <div class="table-row">
          <div class="col-app">{window.appName}</div>
          <div class="col-title">{window.title}</div>
          <div class="col-size">{window.width}×{window.height}</div>
          <div class="col-position">{window.x}, {window.y}</div>
          <div class="col-status">{window.isMinimized ? '✓ Minimized' : 'Open'}</div>
          <div class="col-actions">
            <button on:click={() => minimizeWindow(window.id)}>Min</button>
            <button on:click={() => closeWindow(window.id)}>Close</button>
          </div>
        </div>
      {:else}
        <div class="no-windows">No open windows</div>
      {/each}
    </div>
  </div>
</div>

  <p class="content">Holceplader Application until further notice</p>
