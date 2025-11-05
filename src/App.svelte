<script lang="ts">
  import { onMount } from 'svelte';
  import { windowStore } from './state/windowStore';
  import { systemStore } from './state/systemStore';
  import { appRegistry } from './lib/appRegistry';
  import Window from './components/Window.svelte';
  // import Taskbar from './components/Taskbar.svelte';  // TODO: Implement this component
  // import Desktop from './components/Desktop.svelte';  // TODO: Implement this component

  let windows: any[] = [];
  let system: any;

  onMount(() => {
    windowStore.subscribe(w => windows = w);
    systemStore.subscribe(s => system = s);
  });
</script>

<main>
  {/* <Desktop /> *}
  
  {#each windows as window (window.id)}
    {#if appRegistry.has(window.appName)}
      {@const app = appRegistry.get(window.appName)}
      <Window {window} app={app?.component} />
    {/if}
  {/each}

  {/* <Taskbar /> */}
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    overflow: hidden;
  }

  :global(*) {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  main {
    width: 100vw;
    height: 100vh;
  }
</style>