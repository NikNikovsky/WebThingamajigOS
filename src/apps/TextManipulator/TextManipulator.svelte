<script lang="ts">
  import { writable } from 'svelte/store';
  
  let content = writable('');
  let fileName = 'Untitled.txt';

  function save() {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent($content)}`);
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
</script>

<div class="editor">
  <div class="toolbar">
    <button on:click={save}>Save</button>
  </div>
  <textarea bind:value={$content} placeholder="Start typing..."></textarea>
</div>

<style>
  .editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .toolbar {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  textarea {
    flex: 1;
    border: none;
    padding: 10px;
    font-family: monospace;
    resize: none;
  }
</style>