<script lang="ts">
  import { windowStore } from '../state/windowStore';
  import { appRegistry } from '../lib/appRegistry';
  import Window from './Window.svelte';

  // Subscribe to window store to reactively update
  let windows: any[] = [];
  windowStore.subscribe(w => {
    windows = w;
  });
</script>

<!-- 
  This component manages and displays all open windows.
  It renders each window from the windowStore and handles the z-index stacking.
-->

<div class="window-manager">
  {#each windows as window (window.id)}
    {#if appRegistry.has(window.appName)}
      {@const app = appRegistry.get(window.appName)}
      <Window {window} app={app?.component} />
    {/if}
  {/each}
</div>

<style>
  .window-manager {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    pointer-events: none; /* Allow clicks to pass through to desktop */
  }

  :global(.window-manager > *) {
    pointer-events: auto; /* But windows themselves should be clickable */
  }
</style>
