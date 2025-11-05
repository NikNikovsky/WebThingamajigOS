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
  let isResizing = false;
  let resizeStartX = 0;
  let resizeStartY = 0;
  let resizeStartWidth = 0;
  let resizeStartHeight = 0;

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
function handleResizeMouseDown(e: MouseEvent) {
  isResizing = true;
  resizeStartX = e.clientX;
  resizeStartY = e.clientY;
  resizeStartWidth = window.width;
  resizeStartHeight = window.height;
  e.preventDefault();
}

function handleResizeMouseMove(e: MouseEvent) {
  if (isResizing) {
    const newWidth = Math.max(300, resizeStartWidth + (e.clientX - resizeStartX));
    const newHeight = Math.max(150, resizeStartHeight + (e.clientY - resizeStartY));
    windowStore.resizeWindow(window.id, newWidth, newHeight);
  }
}

function handleResizeMouseUp() {
  isResizing = false;
}
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} on:mousemove={handleResizeMouseMove} on:mouseup={handleResizeMouseUp} />

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

  <div 
    class="resize-handle"
    on:mousedown={handleResizeMouseDown}
    role="presentation"
  ></div>
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
    box-sizing: border-box;
  }
  .resize-handle {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  cursor: nwse-resize;
  background: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.3) 100%);
}

.resize-handle:hover {
  background: linear-gradient(135deg, transparent 0%, transparent 50%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.6) 100%);
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
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
</style>