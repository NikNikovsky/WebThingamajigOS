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
  <div class="menubar">
    <div class="menu-item">File</div>
    <div class="menu-item">Edit</div>
    <div class="menu-item">View</div>
  </div>
  
  <div class="toolbar">
    <button on:click={save}>Write Out</button>
  </div>
  
  <textarea bind:value={$content} placeholder="Just do it..."></textarea>
</div>
<style>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1a1a1e;
  color: #e0e0e0;
}

.menubar {
  background: #2d2d44;
  border-bottom: 1px solid #667eea;
  display: flex;
  height: 32px;
}

.menu-item {
  padding: 6px 15px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}

.menu-item:hover {
  background: #667eea;
  color: white;
}

.toolbar {
  padding: 10px 15px;
  background: #1a1a1e;
  border-bottom: 1px solid #2d2d44;
  display: flex;
  gap: 8px;
}

.toolbar button {
  padding: 6px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.toolbar button:hover {
  background: #764ba2;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

textarea {
  flex: 1;
  border: none;
  padding: 15px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  background: #0f0f1e;
  color: #e0e0e0;
  resize: none;
  outline: none;
}

textarea:focus {
  background: #1a1a2e;
}

textarea::placeholder {
  color: #666;
}
</style>