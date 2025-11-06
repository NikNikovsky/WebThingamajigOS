<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { windowStore } from './state/windowStore';
  import { generateRandomGradient, systemStore } from './state/systemStore';
  import { healthStore } from './state/healthStore';
  import Desktop from './components/Desktop.svelte';
  import WindowManager from './components/WindowManager.svelte';
  import Taskbar from './components/Taskbar.svelte';
  import ServerStatusWarning from './components/ServerStatusWarning.svelte';
  import FileDialog from './components/FileDialog.svelte';

  let windows: any[] = [];
  let system: any;
  let health: any;

  onMount(() => {
    windowStore.subscribe(w => windows = w);
    systemStore.subscribe(s => system = s);
    healthStore.subscribe(h => health = h);
    generateRandomGradient();
    healthStore.startHealthCheck();
  });

  onDestroy(() => {
    healthStore.stopHealthCheck();
  });
</script>

<ServerStatusWarning />
<FileDialog />
<main style="--accent-color: {system?.accentColor || '#667eea'}">
  <Desktop />
  <WindowManager />
  <Taskbar />
</main>

<style>
  main {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
  }
</style>