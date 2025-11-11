<script lang="ts">
  let isShuttingDown = false;

  async function shutdown() {
    isShuttingDown = true;
    try {
      const response = await fetch('/api/shutdown', { method: 'POST' });
      if (response.ok) {
        console.log('Shutdown command sent');
      }
    } catch (error) {
      console.error('Error calling shutdown endpoint:', error);
      isShuttingDown = false;
    }
  }
</script>

<div class="ultrakill">
  <div class="header">
    <h1>ULTRAKILL</h1>
    <p class="subtitle">Dev Server Terminator</p>
  </div>

  <div class="content">
    <div class="warning">⚠️ WARNING ⚠️</div>
    <p class="message">This will immediately terminate npm run dev.</p>
    <p class="message">Any unsaved work will be lost.</p>
  </div>

  <div class="button-container">
    <button 
      class="shutdown-btn" 
      on:click={shutdown}
      disabled={isShuttingDown}
    >
      {isShuttingDown ? 'SHUTTING DOWN...' : 'SHUTDOWN'}
    </button>
  </div>

  {#if isShuttingDown}
    <div class="shutdown-sequence">
      <div class="pulse">●</div>
      <p>Terminating process...</p>
    </div>
  {/if}
</div>

<style>
  .ultrakill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, #1a0000 0%, #330000 100%);
    color: #ff0000;
    padding: 20px;
    text-align: center;
    font-family: 'Courier New', monospace;
  }

  .header {
    margin-bottom: 30px;
  }

  .header h1 {
    font-size: 3em;
    margin: 0;
    color: #ff0000;
    text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
    letter-spacing: 3px;
  }

  .subtitle {
    font-size: 0.9em;
    margin: 10px 0 0 0;
    color: #ff6666;
  }

  .content {
    margin-bottom: 30px;
    background: rgba(255, 0, 0, 0.1);
    border: 2px solid #ff0000;
    padding: 20px;
    border-radius: 5px;
  }

  .warning {
    font-size: 1.5em;
    margin-bottom: 15px;
    animation: pulse 0.5s infinite;
  }

  .message {
    margin: 10px 0;
    font-size: 0.9em;
    color: #ff6666;
  }

  .button-container {
    margin-bottom: 20px;
  }

  .shutdown-btn {
    background: #ff0000;
    color: #000;
    border: 3px solid #ff0000;
    padding: 15px 40px;
    font-size: 1.2em;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
    font-family: 'Courier New', monospace;
    letter-spacing: 2px;
  }

  .shutdown-btn:hover:not(:disabled) {
    background: #ff3333;
    border-color: #ff3333;
    box-shadow: 0 0 15px #ff0000;
    transform: scale(1.05);
  }

  .shutdown-btn:active:not(:disabled) {
    transform: scale(0.95);
  }

  .shutdown-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .shutdown-sequence {
    animation: fadeIn 0.5s;
  }

  .pulse {
    font-size: 2em;
    color: #ff0000;
    animation: pulse 0.5s infinite;
    margin-bottom: 10px;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
