<script lang="ts">
  import { writable } from 'svelte/store';
  
  let content = writable('');
  let fileName = 'Titled.txt';
  let activeMenu: string | null = null;
  let showFindReplace = false;
 
 function toggleMenu(menuName: string) {
  activeMenu = activeMenu === menuName ? null : menuName;
}

function closeMenus() {
  activeMenu = null;
}

function newDocument() {
  $content = '';
  fileName = 'Untitled.txt';
  activeMenu = null;
}

// Saves, duh!
function saveFile() {
  save();
  activeMenu = null;
}

function selectAll() {
  // Handled by text area
}

function undo() {
  // Holceplader - would need history tracking
  activeMenu = null;
}

function redo() {
  // Holceplader - would need history tracking
  activeMenu = null;
}

function toggleWordWrap() {
  // Holceplader
}
function openFindReplace() {
  showFindReplace = true;
  activeMenu = null;
}

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
  
  <div class="menubar-container">
    <div class="menubar" role="menubar">
      <button class="menu-item" on:click={() => toggleMenu('file')} aria-expanded={activeMenu === 'file'}>
        File
      </button>
      
      <button class="menu-item" on:click={() => toggleMenu('edit')} aria-expanded={activeMenu === 'edit'}>
        Edit
      </button>
      
      <button class="menu-item" on:click={() => toggleMenu('view')} aria-expanded={activeMenu === 'view'}>
        View
      </button>
    </div>

    {#if activeMenu === 'file'}
      <div class="dropdown" data-menu="file">
        <button class="dropdown-item" on:click={newDocument}>New</button>
        <button class="dropdown-item" on:click={saveFile}>Save</button>
        <hr>
        <button class="dropdown-item" on:click={closeMenus}>Close Menu</button>
      </div>
    {/if}

    {#if activeMenu === 'edit'}
      <div class="dropdown" data-menu="edit">
        <button class="dropdown-item" on:click={undo}>Undo</button>
        <button class="dropdown-item" on:click={redo}>Redo</button>
        <hr>
        <button class="dropdown-item" on:click={selectAll}>Select All</button>
        <button class="dropdown-item" on:click={openFindReplace}>Find & Replace</button>
      </div>
    {/if}

    {#if activeMenu === 'view'}
      <div class="dropdown" data-menu="view">
        <button class="dropdown-item" on:click={toggleWordWrap}>Toggle Word Wrap</button>
      </div>
    {/if}
  </div>

{#if showFindReplace}
  <div class="find-replace-modal">
    <button on:click={openFindReplace}>Find & Replace</button>
  </div>
{/if}
  
  <textarea bind:value={$content} placeholder="Just do it..."></textarea>
</div>
<style>
.editor {
  display: flex;
  flex-direction: column;
  height: 100%;
 
  color: #e0e0e0;
}

.menubar {
  
  border-bottom: 1px solid var(--accent-color);
  display: flex;
  height: 32px;
}

.menubar-container {
  position: relative;
}

.menu-item {
  position: relative;
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 6px 15px;
  font-size: 13px;
  transition: background 0.2s;
}
.dropdown-item {
  display: block;
  width: 100%;
  padding: 8px 15px;
  background: none;
  border: none;
  color: inherit;
  text-align: left;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
  font-family: inherit;
}

.dropdown-item:hover {
  background: var(--accent-color);
  color: white;
}

.dropdown hr {
  margin: 4px 0;
  border: none;
  border-top: 1px solid var(--accent-color);
}

.dropdown {
  position: absolute;
  top: 32px;
  left: 0;
  background: var(--accent-color);
  backdrop-filter: blur(10px);
  border: 1px solid var(--accent-color);
  min-width: 150px;
  z-index: 1000;
  border-radius: 6px;
  overflow: hidden;
}

.dropdown[data-menu="edit"] {
  left: 50px;
}

.dropdown[data-menu="view"] {
  left: 100px;
}

.menu-item:hover {
  background: var(--accent-color);
  color: white;
}

textarea {
  flex: 1;
  border: none;
  padding: 15px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  color: var(--accent-color);
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