<script lang="ts">
  import { healthStore } from '../state/healthStore';
  
  let health: any;
  
  healthStore.subscribe(h => {
    health = h;
  });
</script>

{#if !health?.isAlive}
  <div class="server-down-warning">
    <div class="warning-content">
      <div class="icon">⚠️</div>
      <h1>Server Connection Lost</h1>
      <p>The development server has stopped responding.</p>
      <p class="timestamp">Last checked: {health?.lastChecked?.toLocaleTimeString()}</p>
      <button on:click={() => location.reload()}>
        Reload Page
      </button>
    </div>
  </div>
{/if}

<style>
  .server-down-warning {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a0000 0%, #330000 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    font-family: 'Courier New', monospace;
  }

  .warning-content {
    text-align: center;
    color: #ff0000;
    padding: 40px;
    max-width: 500px;
  }

  .icon {
    font-size: 5em;
    margin-bottom: 30px;
    animation: pulse 0.5s infinite;
  }

  h1 {
    font-size: 2.5em;
    margin: 0 0 20px 0;
    text-shadow: 0 0 10px #ff0000;
    letter-spacing: 2px;
  }

  p {
    font-size: 1.1em;
    margin: 10px 0;
    color: #ff6666;
  }

  .timestamp {
    font-size: 0.9em;
    color: #ff3333;
    margin-top: 20px;
  }

  button {
    margin-top: 30px;
    background: #ff0000;
    color: #000;
    border: 3px solid #ff0000;
    padding: 15px 40px;
    font-size: 1.1em;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s;
    font-family: 'Courier New', monospace;
    letter-spacing: 1px;
  }

  button:hover {
    background: #ff3333;
    border-color: #ff3333;
    box-shadow: 0 0 15px #ff0000;
    transform: scale(1.05);
  }

  button:active {
    transform: scale(0.95);
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.3;
    }
  }
</style>
