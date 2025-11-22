<script lang="ts">
  import { settingsStore } from '../state/settingsStore';

  let activeTab: 'login' | 'register' = 'login';
  let username = '';
  let password = '';
  let confirmPassword = '';
  let errorMessage = '';
  let isLoading = false;

  async function handleLogin() {
    if (!username || !password) {
      errorMessage = 'Please enter username and password';
      return;
    }

    isLoading = true;
    errorMessage = '';

    // Simulate server call (will be replaced with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock validation
      if (password.length < 3) {
        errorMessage = 'Invalid credentials';
        isLoading = false;
        return;
      }

      settingsStore.login(username, false);
    } catch (e) {
      errorMessage = 'Login failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  async function handleRegister() {
    if (!username || !password || !confirmPassword) {
      errorMessage = 'Please fill in all fields';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }

    if (password.length < 6) {
      errorMessage = 'Password must be at least 6 characters';
      return;
    }

    isLoading = true;
    errorMessage = '';

    // Simulate server call (will be replaced with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      settingsStore.login(username, false);
    } catch (e) {
      errorMessage = 'Registration failed. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function handleGuestMode() {
    settingsStore.login('Guest', true);
  }

  function handleRestartOOBE() {
    // Clear all preferences and restart OOBE
    settingsStore.reset();
    localStorage.clear();
  }

  function handleSubmit() {
    if (activeTab === 'login') {
      handleLogin();
    } else {
      handleRegister();
    }
  }
</script>

<div class="login-container">
  <div class="login-card">
    <h1>Welcome Back</h1>
    <p class="subtitle">Sign in to your Fatuus account</p>

    <!-- Tabs -->
    <div class="tab-group">
      <button
        class="tab"
        class:active={activeTab === 'login'}
        on:click={() => {
          activeTab = 'login';
          errorMessage = '';
        }}
      >
        Login
      </button>
      <button
        class="tab"
        class:active={activeTab === 'register'}
        on:click={() => {
          activeTab = 'register';
          errorMessage = '';
        }}
      >
        Register
      </button>
    </div>

    <!-- Error Message -->
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}

    <!-- Login Tab -->
    {#if activeTab === 'login'}
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            placeholder="Enter your username"
            bind:value={username}
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            bind:value={password}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          class="login-btn"
          disabled={isLoading || !username || !password}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    {/if}

    <!-- Register Tab -->
    {#if activeTab === 'register'}
      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            placeholder="Choose a username"
            bind:value={username}
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create a password (min. 6 chars)"
            bind:value={password}
            disabled={isLoading}
          />
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            bind:value={confirmPassword}
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          class="login-btn"
          disabled={isLoading || !username || !password || !confirmPassword}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    {/if}

    <!-- Guest Mode Link -->
    <div class="guest-mode">
      <p>Just exploring?</p>
      <button
        type="button"
        class="guest-btn"
        on:click={handleGuestMode}
        disabled={isLoading}
      >
        Skip to Guest Mode
      </button>
    </div>

    <!-- Dev Button -->
    <div class="dev-controls">
      <button
        type="button"
        class="dev-btn"
        on:click={handleRestartOOBE}
        title="Restart OOBE and clear all preferences (DEV ONLY)"
      >
        🔧 Restart OOBE
      </button>
    </div>
  </div>
</div>

<style>
  .login-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9998;
  }

  .login-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 48px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  h1 {
    font-size: 2em;
    margin-bottom: 8px;
    color: #333;
  }

  .subtitle {
    color: #666;
    font-size: 0.95em;
    margin-bottom: 32px;
  }

  .tab-group {
    display: flex;
    gap: 0;
    margin-bottom: 28px;
    border-bottom: 2px solid #e0e0e0;
  }

  .tab {
    flex: 1;
    padding: 12px 16px;
    background: none;
    border: none;
    font-size: 1em;
    font-weight: 600;
    color: #999;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
  }

  .tab:hover {
    color: #667eea;
  }

  .tab.active {
    color: #667eea;
    border-bottom-color: #667eea;
  }

  .error-message {
    background: #fee;
    color: #c33;
    padding: 12px 16px;
    border-radius: 6px;
    margin-bottom: 20px;
    font-size: 0.9em;
    border-left: 4px solid #c33;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 28px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-size: 0.95em;
    font-weight: 600;
    color: #333;
  }

  input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1em;
    transition: all 0.2s;
    background: white;
  }

  input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  input:disabled {
    background: #f5f5f5;
    color: #999;
    cursor: not-allowed;
  }

  .login-btn {
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1em;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .login-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
  }

  .login-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .guest-mode {
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid #e0e0e0;
  }

  .guest-mode p {
    color: #666;
    font-size: 0.9em;
    margin-bottom: 12px;
  }

  .guest-btn {
    background: none;
    color: #667eea;
    border: none;
    font-size: 0.95em;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.2s;
    text-decoration: underline;
  }

  .guest-btn:hover:not(:disabled) {
    color: #764ba2;
  }

  .guest-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .dev-controls {
    margin-top: 16px;
    text-align: center;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  .dev-btn {
    background: none;
    color: #999;
    border: 1px dashed #ddd;
    padding: 8px 12px;
    font-size: 0.85em;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border-radius: 4px;
  }

  .dev-btn:hover {
    color: #666;
    border-color: #999;
    background: #fafafa;
  }

  .dev-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
