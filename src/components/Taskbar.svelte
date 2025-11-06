<script lang="ts">
  import { systemStore } from '../state/systemStore';
  import { windowStore } from '../state/windowStore';
  import { appRegistry } from '../lib/appRegistry';
  import { onMount } from 'svelte';
  import {scale} from 'svelte/transition';

  let showStartMenu = false;

  function getTime(): string {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  let currentTime = getTime();
  let timerID: number;

  // 1000ms = 1s
onMount(() => {
    // Update time every single second
    timerID = window.setInterval(() => {
      currentTime = getTime();
    }, 1000);

    // cleanup
    return () => {
      clearInterval(timerID);
    };
  });

  function toggleStartMenu() {
    showStartMenu = !showStartMenu;
  }

  // Close the menu when not clicking in the menu
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.taskbar-left')) {
      showStartMenu = false;
    }
  }

  function launchApp(appName: string) {
    const app = appRegistry.get(appName);
    if (app) {
      windowStore.openWindow({
        id: `${appName}-${Date.now()}`,
        title: app.title,
        appName: appName,
        x: Math.random() * 200 + 100,
        y: Math.random() * 200 + 100,
        width: app.defaultWindow.width,
        height: app.defaultWindow.height,
        zIndex: 100,
        isMinimized: false,
        isMaximized: false,
        isFocused: true,
      });
      showStartMenu = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="taskbar">
  <div class="taskbar-left">
    <button class="start-button" on:click={toggleStartMenu}>📁 Start</button>
    {#if showStartMenu}
      <div class="start-menu" role="menu" transition:scale={{ duration: 300, start: 0.7 }}>
        <div class="menu-header">Applications</div>
        {#each Array.from(appRegistry.entries()) as [appName, app]}
          <button class="app-button" on:click={() => launchApp(appName)}>
            {app.title}
          </button>
        {:else}
          <p style="color: #999; padding: 10px; text-align: center; font-size: 12px;">
            No apps installed yet or they have not been detected.  
          </p>
        {/each}
      </div>
    {/if}
  </div>

  <div class="taskbar-right">
    <span class="time">{currentTime}</span>
  </div>
</div>

<style>
  .taskbar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: rgba(0, 0, 0, 0.8);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    z-index: 1000;
    backdrop-filter: blur(10px);
  }

  .taskbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
  }

  .taskbar-right {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .start-button {
    padding: 8px 16px;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .start-button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  .start-button:active {
    transform: scale(0.98);
  }

  .start-menu {
    position: absolute;
    bottom: 60px;
    left: 0;
    background: rgba(20, 20, 30, 0.95);
    border: 1px solid var(--accent-color);
    border-radius: 6px;
    min-width: 200px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 1001;
    transform-origin: bottom;
  }

  .menu-header {
    padding: 10px 15px;
    font-weight: 600;
    color: var(--accent-color);
    border-bottom: 1px solid var(--accent-color);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.5;
  }

  .app-button {
    width: 100%;
    padding: 10px 15px;
    background: transparent;
    color: white;
    border: none;
    text-align: left;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .app-button:hover {
    background: var(--accent-color);
    opacity: 0.2;
  }

  .time {
    font-weight: 600;
    color: white;
    font-size: 13px;
  }
</style>
