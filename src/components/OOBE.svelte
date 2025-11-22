<script lang="ts">
  import { onMount } from 'svelte';
  import { settingsStore } from '../state/settingsStore';

  let currentStep = 0;
  let licenseContent = '';
  let selectedMode: 'offline' | 'localhost' | null = null;
  let serverIp = 'localhost:3000';
  let isLoadingLicense = true;
  let isTestingConnection = false;
  let connectionError = '';

  // Load LICENSE file
  onMount(async () => {
    try {
      // Account for Vite base path (/fatuus/)
      const basePath = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${basePath}LICENSE`);
      licenseContent = await response.text();
    } catch (e) {
      console.error('Failed to load LICENSE:', e);
      licenseContent = 'License file not found.';
    } finally {
      isLoadingLicense = false;
    }
  });

  async function testServerConnection(url: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${url}/health`, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (e) {
      console.error('Server connection test failed:', e);
      return false;
    }
  }

  async function nextStep() {
    // Test server connection if on mode selection step and connected mode is selected
    if (currentStep === 2 && selectedMode === 'localhost') {
      isTestingConnection = true;
      connectionError = '';

      const serverUrl = `http://${serverIp}`;
      const isConnected = await testServerConnection(serverUrl);

      isTestingConnection = false;

      if (!isConnected) {
        connectionError = `Cannot connect to server at ${serverUrl}. Please check the address and try again.`;
        return;
      }
    }

    currentStep++;
    connectionError = '';
  }

  function prevStep() {
    if (currentStep > 0) currentStep--;
    connectionError = '';
  }

  function finishOOBE() {
    if (selectedMode) {
      const serverUrl = selectedMode === 'localhost' ? `http://${serverIp}` : null;
      settingsStore.setMode(selectedMode, serverUrl);
      settingsStore.completeOOBE();
    }
  }
</script>

<div class="oobe-container">
  <!-- Step 0: Welcome -->
  {#if currentStep === 0}
    <div class="oobe-screen">
      <h1>Welcome to Fatuus</h1>
      <p>A browser-based operating system built with curiosity and chaos.</p>
      <p>Let's set up your experience with a few quick choices.</p>
      <button class="primary-btn" on:click={nextStep}>Get Started</button>
    </div>
  {/if}

  <!-- Step 1: License -->
  {#if currentStep === 1}
    <div class="oobe-screen">
      <h2>License Agreement</h2>
      {#if isLoadingLicense}
        <p class="loading">Loading license...</p>
      {:else}
        <div class="license-content">
          {licenseContent}
        </div>
      {/if}
      <div class="button-group">
        <button class="secondary-btn" on:click={prevStep}>Back</button>
        <button class="primary-btn" on:click={nextStep}>I Agree</button>
      </div>
    </div>
  {/if}

  <!-- Step 2: Mode Selection -->
  {#if currentStep === 2}
    <div class="oobe-screen">
      <h2>Choose Your Mode</h2>
      <p>How do you want to use Fatuus?</p>

      {#if connectionError}
        <div class="error-message">
          ⚠️ {connectionError}
        </div>
      {/if}

      <div class="mode-options">
        <label class="mode-option">
          <input
            type="radio"
            bind:group={selectedMode}
            value="offline"
            name="mode"
          />
          <div class="mode-label">
            <strong>Offline Mode</strong>
            <p>No server needed. Everything stays local to your browser.</p>
          </div>
        </label>

        <label class="mode-option">
          <input
            type="radio"
            bind:group={selectedMode}
            value="localhost"
            name="mode"
          />
          <div class="mode-label">
            <strong>Connected Mode</strong>
            <p>Connect to a server for cloud storage and multi-device sync.</p>
            {#if selectedMode === 'localhost'}
              <input
                type="text"
                class="server-input"
                placeholder="Server address (e.g., localhost:3000)"
                bind:value={serverIp}
              />
            {/if}
          </div>
        </label>
      </div>

      <div class="button-group">
        <button class="secondary-btn" on:click={prevStep}>Back</button>
        <button
          class="primary-btn"
          on:click={nextStep}
          disabled={selectedMode === null || isTestingConnection}
        >
          {isTestingConnection ? 'Testing Connection...' : 'Continue'}
        </button>
      </div>
    </div>
  {/if}

  <!-- Step 3: Summary -->
  {#if currentStep === 3}
    <div class="oobe-screen">
      <h2>Ready to Go!</h2>
      <div class="summary">
        <div class="summary-item">
          <strong>Mode:</strong>
          <span>{selectedMode === 'offline' ? 'Offline (Local)' : 'Connected Mode'}</span>
        </div>
        {#if selectedMode === 'localhost'}
          <div class="summary-item">
            <strong>Server:</strong>
            <span>{serverIp}</span>
          </div>
        {/if}
      </div>
      <p class="summary-note">You can change these settings later in the Settings app.</p>

      <div class="button-group">
        <button class="secondary-btn" on:click={prevStep}>Back</button>
        <button class="primary-btn success-btn" on:click={finishOOBE}>
          Start Using Fatuus
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .oobe-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .oobe-screen {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 48px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  h1 {
    font-size: 2.5em;
    margin-bottom: 16px;
    color: #333;
  }

  h2 {
    font-size: 1.8em;
    margin-bottom: 20px;
    color: #333;
  }

  p {
    font-size: 1.1em;
    color: #666;
    margin-bottom: 12px;
    line-height: 1.6;
  }

  .loading {
    text-align: center;
    color: #999;
    padding: 40px 0;
  }

  .license-content {
    background: #f5f5f5;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 20px;
    max-height: 300px;
    overflow-y: auto;
    font-family: 'Courier New', monospace;
    font-size: 0.85em;
    line-height: 1.5;
    color: #333;
    margin-bottom: 24px;
  }

  .mode-options {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 30px 0 40px 0;
  }

  .mode-option {
    display: flex;
    gap: 16px;
    padding: 20px;
    border: 2px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
  }

  .mode-option:hover {
    border-color: #667eea;
    background: #f0f2ff;
  }

  .mode-option input[type='radio'] {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .mode-label {
    flex: 1;
  }

  .mode-label strong {
    display: block;
    margin-bottom: 6px;
    color: #333;
    font-size: 1.1em;
  }

  .mode-label p {
    font-size: 0.95em;
    margin-bottom: 12px;
  }

  .server-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.95em;
    margin-top: 8px;
  }

  .server-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 0.95em;
    border-left: 4px solid #c33;
  }

  .summary {
    background: #f0f2ff;
    border-left: 4px solid #667eea;
    padding: 20px;
    border-radius: 4px;
    margin: 30px 0 16px 0;
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 1em;
  }

  .summary-item:last-child {
    margin-bottom: 0;
  }

  .summary-item strong {
    color: #333;
  }

  .summary-item span {
    color: #667eea;
    font-weight: 600;
  }

  .summary-note {
    font-size: 0.9em;
    color: #999;
    margin-bottom: 30px;
  }

  .button-group {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  button {
    padding: 12px 28px;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .primary-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .primary-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .primary-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .secondary-btn {
    background: #e0e0e0;
    color: #333;
  }

  .secondary-btn:hover {
    background: #d0d0d0;
  }

  .success-btn {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  }

  .success-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(17, 153, 142, 0.3);
  }
</style>
