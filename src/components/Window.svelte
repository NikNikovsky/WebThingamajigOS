<script lang="ts">
  import type { Window as WindowType } from '../types/window';
  import { windowStore } from '../state/windowStore';
  import { scale, fade } from 'svelte/transition';
  
  export let window: WindowType;
  export let app: any; // The app component
  
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let previousSize = { width: window.width, height: window.height, x: window.x, y: window.y };
  let isMaximized = false;
  let isAnimating = false;

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    dragOffsetX = e.clientX - window.x;
    dragOffsetY = e.clientY - window.y;
  }

  function handleMouseMove(e: MouseEvent) {
    if (isDragging) {
      windowStore.moveWindow(window.id, e.clientX - dragOffsetX, e.clientY - dragOffsetY);
    }
  }

  function handleMouseUp() {
    isDragging = false;
}

function closeWindow() {
    windowStore.closeWindow(window.id);
}

function minimizeWindow() {
  windowStore.minimizeWindow(window.id);
}

function maximizeWindow() {
  if (isMaximized) {
    windowStore.moveWindow(window.id, previousSize.x, previousSize.y);
    windowStore.resizeWindow(window.id, previousSize.width, previousSize.height);
    isMaximized = false;
  } else {
    previousSize = { width: window.width, height: window.height, x: window.x, y: window.y };
    windowStore.moveWindow(window.id, 0, 0);
    // Use viewport size minus taskbar
    windowStore.resizeWindow(window.id, document.documentElement.clientWidth, document.documentElement.clientHeight - 50);
    isMaximized = true;
  }
}
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

{#if !window.isMinimized}
<div
  class="window"
  style="
    left: {window.x}px;
    top: {window.y}px;
    width: {window.width}px;
    height: {window.height}px;
    z-index: {window.zIndex};
  "
  on:mousedown={() => windowStore.focusWindow(window.id)}
  on:focus={() => {}}
  role="presentation"
  transition:scale={{ duration: 300 }}
>
  <div class="titlebar" on:mousedown={handleMouseDown} role="presentation">
    <span>{window.title}</span>
    <div class="buttons">
      <button on:click={minimizeWindow} title="Minimize">−</button>
      <button on:click={maximizeWindow} title="Maximize">□</button>
      <button on:click={closeWindow} title="Close">✕</button>
    </div>
  </div>

  <div class="content">
    <svelte:component this={app} />
  </div>
</div>
{/if}

<style>
  .window {
    position: fixed;
    border-radius: 6px;
    box-shadow: inset 0 0 0 1px rgba(102, 126, 234, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .titlebar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 10px 15px;
    cursor: move;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  .buttons button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 18px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    transition: background 0.2s;
  }

  .buttons button:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .content {
    flex: 1;
    overflow: auto;
    padding: 10px;
  }
</style>