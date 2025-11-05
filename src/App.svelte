<script lang="ts">
  import { onMount } from 'svelte';
  import { windowStore } from './state/windowStore';
  import { systemStore } from './state/systemStore';
  import Desktop from './components/Desktop.svelte';
  import WindowManager from './components/WindowManager.svelte';
  import Taskbar from './components/Taskbar.svelte';

  let windows: any[] = [];
  let system: any;

  onMount(() => {
    windowStore.subscribe(w => windows = w);
    systemStore.subscribe(s => system = s);
  });
</script>

<main>
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