<script lang="ts">
  import { windowStore } from '../state/windowStore';
  import { onMount } from 'svelte';
  
  let windows: any[] = [];
  let isDraggingWidgets = false;
  let dragStartX = 0;
  let dragStartY = 0;  
  let widgetX = 10;
  let widgetY = 0;
  let dragged = false;

  onMount(() => {
    windowStore.subscribe(w => {
      windows = w;
    });
  });

function restoreWindow(windowId: string) {
    windowStore.restoreWindow(windowId);
  }
function handleWidgetMouseDown(e: MouseEvent) {
  isDraggingWidgets = true;
  dragStartX = e.clientX - widgetX;
  dragStartY = e.clientY - widgetY;
  dragged = false;
}

function handleWidgetMouseMove(e: MouseEvent) {
  if (isDraggingWidgets) {
    const dx = Math.abs(e.clientX - (dragStartX + widgetX));
    const dy = Math.abs(e.clientY - (dragStartY + widgetY));
    if (dx > 2 || dy > 2) {  
      dragged = true;
    }
    widgetX = e.clientX - dragStartX;
    widgetY = e.clientY - dragStartY;
  }
}

function handleWidgetClick(windowId: string) {
  if (!dragged) { 
    restoreWindow(windowId);
  }
}

function handleWidgetMouseUp() {
  isDraggingWidgets = false;
}
</script>

<svelte:window on:mousemove={handleWidgetMouseMove} on:mouseup={handleWidgetMouseUp} />

// Originally named WebThingamajigOS
<div class="desktop">
  <h1 class="desktop-title">Fatuus</h1>
  <p class="desktop-subtitle">Fatuus Erratum</p>
  <p class="desktop-subsubtitle">Made by an idiot (Me, Nik)</p>
</div>
  <div 
    class="minimized-widgets"
    style="left: {widgetX}px; top: {widgetY}px;"
    
  >
    {#each windows.filter(w => w.isMinimized) as window (window.id)}
      <button
        class="widget"
        on:mousedown={handleWidgetMouseDown}
        on:click={() => handleWidgetClick(window.id)}
        title={window.title}
      >
        {window.title} - Minimized
      </button>
    {/each}
  </div>
<style>
  .desktop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

  .minimized-widgets {
    position: fixed;
    bottom: auto;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 1001;
    pointer-events: auto; /* Allow clicking on widgets */
  }

.widget {
    padding: 8px 12px;
    height: 40px;
    background: rgba(102, 126, 234, 0.3);
    border: 1px solid rgba(102, 126, 234, 0.5);
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
    background: rgba(102, 126, 234, 0.5);
    transform: scale(1.1);
  }
</style>
