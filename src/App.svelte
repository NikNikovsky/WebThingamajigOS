<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { windowStore } from './state/windowStore';
  import { generateRandomGradient, systemStore } from './state/systemStore';
  import { healthStore } from './state/healthStore';
  import { settingsStore } from './state/settingsStore';
  import Desktop from './components/Desktop.svelte';
  import WindowManager from './components/WindowManager.svelte';
  import Taskbar from './components/Taskbar.svelte';
  import ServerStatusWarning from './components/ServerStatusWarning.svelte';
  import FileDialog from './components/FileDialog.svelte';
  import OOBE from './components/OOBE.svelte';
  import LoginScreen from './components/LoginScreen.svelte';

  let windows: any[] = [];
  let system: any;
  let health: any;
  let settings: any;

  onMount(() => {
    windowStore.subscribe(w => windows = w);
    systemStore.subscribe(s => system = s);
    healthStore.subscribe(h => health = h);
    settingsStore.subscribe(s => settings = s);
    generateRandomGradient();
    healthStore.startHealthCheck();
  });

  onDestroy(() => {
    healthStore.stopHealthCheck();
  });

  // Determine which screen to show
  $: showOOBE = !settings?.hasCompletedOOBE;
  // Skip login screen in offline mode (user is auto-logged in)
  $: showLoginScreen = settings?.hasCompletedOOBE && !settings?.isLoggedIn && settings?.mode !== 'offline';
  $: showDesktop = settings?.hasCompletedOOBE && settings?.isLoggedIn;
</script>

<ServerStatusWarning />
<FileDialog />

{#if showOOBE}
  <OOBE />
{:else if showLoginScreen}
  <LoginScreen />
{:else if showDesktop}
  <main style="--accent-color: {system?.accentColor || '#667eea'}">
    <Desktop />
    <WindowManager />
    <Taskbar />
  </main>
{/if}

<style>
  main {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;
    flex-direction: column;
  }
</style>