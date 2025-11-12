<script lang="ts">
import defaultPreferences, { type Preferences } from '../../state/defaultPreferences';
import { preferencesStore } from '../../state/preferencesStore';

  let prefs: Preferences;
  let hasChanges = false;
  let selectedSection = 'appearance';

  // Subscribe to store - this will update prefs immediately
  const unsubscribe = preferencesStore.subscribe((p) => {
    prefs = p;
    hasChanges = false;
  });

  function handleChange() {
    hasChanges = true;
  }

  function savePreferences() {
    preferencesStore.set(prefs);
    hasChanges = false;
  }

  function resetToDefaults() {
    if (confirm('Reset all preferences to defaults?')) {
      preferencesStore.reset();
      hasChanges = false;
    }
  }

  const sections = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'sound', label: 'Sound & Audio', icon: '🔊' },
    { id: 'window', label: 'Window & Navigation', icon: '🪟' },
    { id: 'files', label: 'Files & Saving', icon: '💾' },
    { id: 'apps', label: 'Applications', icon: '📱' },
    { id: 'system', label: 'System & Language', icon: '⚙️' },
  ];
</script>

<div class="settings-container">
  <div class="sidebar">
    <div class="sidebar-header">Settings</div>
    <div class="section-list">
      {#each sections as section}
        <button
          class="section-button"
          class:active={selectedSection === section.id}
          on:click={() => (selectedSection = section.id)}
        >
          <span class="icon">{section.icon}</span>
          <span class="label">{section.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <div class="content-area">
    <!-- Appearance Section -->
    {#if selectedSection === 'appearance'}
      <div class="section">
        <h2>Appearance</h2>

        <div class="setting-group">
          <label for="theme-select">Theme</label>
          <select id="theme-select" bind:value={prefs.theme} on:change={handleChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <div class="setting-group">
          <label for="font-size-select">Font Size</label>
          <select id="font-size-select" bind:value={prefs.fontSize} on:change={handleChange}>
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div class="setting-group checkbox">
          <label for="animations-toggle">
            <input
              id="animations-toggle"
              type="checkbox"
              bind:checked={prefs.animations}
              on:change={handleChange}
            />
            <span>Enable Animations</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Sound & Audio Section -->
    {#if selectedSection === 'sound'}
      <div class="section">
        <h2>Sound & Audio</h2>

        <div class="setting-group checkbox">
          <label for="sound-toggle">
            <input
              id="sound-toggle"
              type="checkbox"
              bind:checked={prefs.soundEnabled}
              on:change={handleChange}
            />
            <span>Enable Sound Effects</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Window & Navigation Section -->
    {#if selectedSection === 'window'}
      <div class="section">
        <h2>Window & Navigation</h2>

        <div class="setting-group checkbox">
          <label for="snap-toggle">
            <input
              id="snap-toggle"
              type="checkbox"
              bind:checked={prefs.windowSnap}
              on:change={handleChange}
            />
            <span>Window Snap to Grid</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Files & Saving Section -->
    {#if selectedSection === 'files'}
      <div class="section">
        <h2>Files & Saving</h2>

        <div class="setting-group checkbox">
          <label for="autosave-toggle">
            <input
              id="autosave-toggle"
              type="checkbox"
              bind:checked={prefs.autoSave}
              on:change={handleChange}
            />
            <span>Auto-Save Files</span>
          </label>
        </div>
      </div>
    {/if}

    <!-- Applications Section -->
    {#if selectedSection === 'apps'}
      <div class="section">
        <h2>Application Settings</h2>

        <div class="subsection">
          <h3>Text Manipulator</h3>
          <div class="setting-group checkbox">
            <label for="remember-last-file">
              <input
                id="remember-last-file"
                type="checkbox"
                bind:checked={prefs.rememberLastFile}
                on:change={handleChange}
              />
              <span>Remember Last Opened File</span>
            </label>
          </div>
        </div>
      </div>
    {/if}

    <!-- System & Language Section -->
    {#if selectedSection === 'system'}
      <div class="section">
        <h2>System & Language</h2>

        <div class="setting-group">
          <label for="language-select">Language</label>
          <select id="language-select" bind:value={prefs.language} on:change={handleChange}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    {/if}

    <div class="button-group">
      <button class="btn-primary" on:click={savePreferences} disabled={!hasChanges}>
        Save Changes
      </button>
      <button class="btn-secondary" on:click={resetToDefaults}>
        Reset to Defaults
      </button>
    </div>
  </div>
</div>

<style>
  .settings-container {
    display: flex;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    overflow: hidden;
  }

  .sidebar {
    width: 280px;
    background: rgba(0, 0, 0, 0.4);
    border-right: 1px solid rgba(100, 181, 246, 0.2);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 20px 15px;
    font-size: 18px;
    font-weight: 700;
    color: #64b5f6;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid rgba(100, 181, 246, 0.2);
  }

  .section-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 10px 0;
  }

  .section-button {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 15px;
    background: transparent;
    border: none;
    color: #b0b0b0;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
    text-align: left;
  }

  .section-button:hover {
    background: rgba(100, 181, 246, 0.1);
    color: #e0e0e0;
  }

  .section-button.active {
    background: rgba(100, 181, 246, 0.3);
    color: #64b5f6;
    border-left: 3px solid #64b5f6;
    padding-left: 12px;
  }

  .section-button .icon {
    font-size: 18px;
    min-width: 24px;
  }

  .section-button .label {
    flex: 1;
    font-weight: 500;
  }

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 30px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .section h2 {
    font-size: 24px;
    font-weight: 600;
    color: #64b5f6;
    margin: 0 0 10px 0;
  }

  .subsection {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 15px;
    background: rgba(100, 181, 246, 0.05);
    border-left: 3px solid #64b5f6;
    border-radius: 4px;
  }

  .subsection h3 {
    font-size: 16px;
    font-weight: 600;
    color: #64b5f6;
    margin: 0 0 8px 0;
  }

  .setting-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .setting-group.checkbox {
    flex-direction: row;
    gap: 0;
  }

  .setting-group label {
    font-size: 14px;
    font-weight: 500;
    color: #d0d0d0;
  }

  .setting-group.checkbox label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .setting-group input[type='checkbox'] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #64b5f6;
  }

  .setting-group select {
    padding: 10px 12px;
    background: rgba(255, 255, 255, 0.08);
    color: #e0e0e0;
    border: 1px solid rgba(100, 181, 246, 0.4);
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .setting-group select:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: #64b5f6;
  }

  .setting-group select:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: #64b5f6;
    box-shadow: 0 0 8px rgba(100, 181, 246, 0.2);
  }

  .setting-group select option {
    background: #1a1a2e;
    color: #e0e0e0;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid rgba(100, 181, 246, 0.2);
  }

  .btn-primary,
  .btn-secondary {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn-primary {
    background: #64b5f6;
    color: #1a1a2e;
    flex: 1;
  }

  .btn-primary:hover:not(:disabled) {
    background: #90caf9;
    box-shadow: 0 4px 8px rgba(100, 181, 246, 0.3);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: #e0e0e0;
    border: 1px solid rgba(255, 255, 255, 0.2);
    flex: 1;
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }

  /* Scrollbar styling */
  .sidebar::-webkit-scrollbar,
  .content-area::-webkit-scrollbar {
    width: 8px;
  }

  .sidebar::-webkit-scrollbar-track,
  .content-area::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  .sidebar::-webkit-scrollbar-thumb,
  .content-area::-webkit-scrollbar-thumb {
    background: rgba(100, 181, 246, 0.4);
    border-radius: 4px;
  }

  .sidebar::-webkit-scrollbar-thumb:hover,
  .content-area::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 181, 246, 0.6);
  }
</style>