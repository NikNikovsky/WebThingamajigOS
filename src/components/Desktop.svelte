<script lang="ts">
  // This component represents the desktop background
</script>

<div class="desktop">
  <h1 class="desktop-title">WebOS</h1>
  <p class="desktop-subtitle">A browser-based operating system</p>
</div>

<style>
  .desktop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1;
    pointer-events: none; /* Allow clicks to pass through */
  }

  .desktop-title {
    font-size: 48px;
    color: white;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .desktop-subtitle {
    font-size: 18px;
    color: rgba(255, 255, 255, 0.8);
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
  }
</style>
