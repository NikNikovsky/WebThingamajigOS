<script lang="ts">
  import type { Window as WindowType } from '../types/window';
  import { windowStore } from '../state/windowStore';
  
  export let window: WindowType;
  export let app: any; // The app component
  
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

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
    // To be eventually completed, maybe, perchance, someday, who knows, maybe not, when I feel like it, etc.
  }

  function maximizeWindow() {
    // To be eventually completed, maybe, perchance, someday, who knows, maybe not, when I feel like it, etc.
  }
</script>

<svelte:window on:mousemove={handleMouseMove} on:mouseup={handleMouseUp} />

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
>
  <!-- Title bar -->
  <div class="titlebar" on:mousedown={handleMouseDown} role="presentation">
    <span>{window.title}</span>
    <div class="buttons">
      <button on:click={minimizeWindow} title="Minimize">−</button>
      <button on:click={maximizeWindow} title="Maximize">□</button>
      <button on:click={closeWindow} title="Close">✕</button>
    </div>
  </div>

  <!-- Content -->
  <div class="content">
    <svelte:component this={app} />
  </div>
</div>

<style>
  .window {
    position: fixed;
    background: white;
    border-radius: 6px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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