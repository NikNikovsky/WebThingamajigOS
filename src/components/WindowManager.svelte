<script lang="ts">
  import { windowStore } from '../state/windowStore';
  import { appRegistry } from '../lib/appRegistry';
  import Window from './Window.svelte';
  import {scale} from 'svelte/transition';

  // Subscribe to window store to reactively update
  let windows: any[] = [];
  windowStore.subscribe(w => {
    windows = w;
  });
</script>

<div class="window-manager">
  {#each windows as window (window.id)}
    <div transition:scale={{ duration: 2000 }}>
      {#if appRegistry.has(window.appName)}
        {@const app = appRegistry.get(window.appName)}
        <Window {window} app={app?.component} />
      {/if}
    </div>
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
    pointer-events: none; 
  }

  :global(.window-manager > *) {
    pointer-events: auto;
  }
</style>
