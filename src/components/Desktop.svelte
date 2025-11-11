<script lang="ts">
  import { windowStore } from '../state/windowStore';
  import { onMount } from 'svelte';
  import {systemStore} from '../state/systemStore';
  import { appRegistry } from '../lib/appRegistry';
  
  let windows: any[] = [];
  let widgetPositions: { [windowId: string]: { x: number; y: number } } = {};
  let draggingWidgetId: string | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragged = false;
  let wallpaper = '';
  let version = 'unknown';

  function launchUltrakill() {
    const app = appRegistry.get('Ultrakill');
    if (app) {
      windowStore.openWindow({
        id: `Ultrakill-${Date.now()}`,
        title: app.title,
        appName: 'Ultrakill',
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 100,
        width: app.defaultWindow.width,
        height: app.defaultWindow.height,
        zIndex: 100,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
      });
    }
  }

  onMount(() => {
    // Subscribe to systemStore for wallpaper and version
    systemStore.subscribe(s => {
      wallpaper = s.wallpaperGradient;
      version = s.version;
    });

    // Subscribe to windowStore for windows
    windowStore.subscribe(w => {
      windows = w;
      // Initialize positions for newly minimized from the main window's position
      windows.forEach((win) => {
        if (win.isMinimized && !widgetPositions[win.id]) {
          // Position widget at the window's current location
          widgetPositions[win.id] = {
            x: win.x,
            y: win.y
          };
        }
        // Clean up positions for restored windows
        if (!win.isMinimized && widgetPositions[win.id]) {
          delete widgetPositions[win.id];
        }
      });
    });
  });

  function restoreWindow(windowId: string) {
    // Move window to the widget's position
    const pos = widgetPositions[windowId];
    if (pos) {
      windowStore.moveWindow(windowId, pos.x, pos.y);
    }
    windowStore.restoreWindow(windowId);
  }

  function handleWidgetMouseDown(windowId: string, e: MouseEvent) {
    draggingWidgetId = windowId;
    const pos = widgetPositions[windowId];
    dragStartX = e.clientX - pos.x;
    dragStartY = e.clientY - pos.y;
    dragged = false;
  }

  function handleWidgetMouseMove(e: MouseEvent) {
    if (draggingWidgetId && widgetPositions[draggingWidgetId]) {
      const pos = widgetPositions[draggingWidgetId];
      const dx = Math.abs(e.clientX - (dragStartX + pos.x));
      const dy = Math.abs(e.clientY - (dragStartY + pos.y));
      if (dx > 2 || dy > 2) {
        dragged = true;
      }
      pos.x = e.clientX - dragStartX;
      pos.y = e.clientY - dragStartY;
      // Force reactivity by reassigning the object
      widgetPositions = widgetPositions;
    }
  }

  function handleWidgetClick(windowId: string) {
    if (!dragged) {
      restoreWindow(windowId);
    }
  }

  function handleWidgetMouseUp() {
    draggingWidgetId = null;
  }
</script>

<svelte:window on:mousemove={handleWidgetMouseMove} on:mouseup={handleWidgetMouseUp} />

// Originally named WebThingamajigOS
<div class="desktop" style="background: {wallpaper}">
  <h1 class="desktop-title">Fatuus</h1>
  <p class="desktop-subtitle">Fatuus Erratum</p>
  <p class="desktop-subsubtitle">Made by an idiot (Me, Nik)</p>
  <p class="desktop-version">v{version}</p>
</div>

{#each windows.filter(w => w.isMinimized) as window (window.id)}
  <div 
    class="minimized-widget"
    data-window-id={window.id}
    style="left: {widgetPositions[window.id]?.x ?? 10}px; top: {widgetPositions[window.id]?.y ?? 10}px;"
  >
    <button
      class="widget"
      on:mousedown={(e) => handleWidgetMouseDown(window.id, e)}
      on:click={() => handleWidgetClick(window.id)}
      title={window.title}
    >
      {window.title} - Minimized
    </button>
  </div>
{/each}

<style>
  .desktop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none; /* Enable clicking, kinda necessary in a GUI */
  }

  .desktop-title {
    font-size: 48px;
    color: white;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .desktop-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  }
    .desktop-subsubtitle {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  }

  .desktop-version {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
    margin-top: 15px;
    font-family: 'Courier New', monospace;
  }

  .minimized-widget {
    position: fixed;
    z-index: 1001;
    pointer-events: auto;
  }

  .widget {
    padding: 8px 12px;
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--accent-color);
    border-radius: 6px;
    color: white;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s, transform 0.2s;
    white-space: nowrap;
  }

  .widget:hover {
    background: var(--accent-color);
    transform: scale(1.1);
  }
</style>
