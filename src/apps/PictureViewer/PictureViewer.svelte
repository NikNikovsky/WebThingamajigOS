<script lang="ts">
  import { fileDialogStore } from '../../state/fileDialogStore';

  type SelectedFile = {
    name: string;
    path: string;
    content: string;
    type: string;
    size: string;
  };

  let selectedFile: SelectedFile | null = null;

  fileDialogStore.subscribe((state) => {
    if (state.requestedBy === 'PictureViewer' && state.selectedFile) {
      selectedFile = state.selectedFile;
    }
  });
</script>

<div class="picture-viewer">
  {#if selectedFile}
    <div class="viewer-header">
      <h2>{selectedFile.name}</h2>
      <span>{selectedFile.size}</span>
    </div>

    {#if selectedFile.content}
      <div class="image-wrap">
        <img src={selectedFile.content} alt={selectedFile.name} />
      </div>
      <p class="hint">
        If this image does not load, add it to public/images with the same filename and refresh.
      </p>
    {:else}
      <div class="empty-state">No image source was provided for this file.</div>
    {/if}
  {:else}
    <div class="empty-state">Open an image from FileMangler to preview it here.</div>
  {/if}
</div>

<style>
  .picture-viewer {
    display: flex;
    flex-direction: column;
    height: 100%;
    color: #e8edf8;
    background: linear-gradient(180deg, rgba(19, 24, 35, 0.98) 0%, rgba(7, 10, 16, 0.98) 100%);
  }

  .viewer-header {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(120, 220, 232, 0.35);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }

  .viewer-header h2 {
    margin: 0;
    font-size: 15px;
  }

  .viewer-header span {
    color: #9fb6da;
    font-size: 12px;
  }

  .image-wrap {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 16px;
    overflow: auto;
    background-image: linear-gradient(45deg, #171e2f 25%, #111827 25%, #111827 50%, #171e2f 50%, #171e2f 75%, #111827 75%, #111827 100%);
    background-size: 24px 24px;
  }

  .image-wrap img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 8px;
    box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
  }

  .empty-state {
    flex: 1;
    display: grid;
    place-items: center;
    color: #9fb6da;
    font-size: 14px;
    padding: 16px;
    text-align: center;
  }

  .hint {
    margin: 0;
    padding: 8px 12px;
    font-size: 12px;
    color: #d7e2f7;
    border-top: 1px solid rgba(120, 220, 232, 0.2);
    background: rgba(120, 220, 232, 0.08);
  }
</style>