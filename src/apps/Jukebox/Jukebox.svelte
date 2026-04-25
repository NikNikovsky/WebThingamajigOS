<script lang="ts">
  import { fileDialogStore } from '../../state/fileDialogStore';
  import { parseBuffer } from 'music-metadata-browser';
  export let windowId: string;

  type SelectedFile = {
    name: string;
    path: string;
    content: string;
    type: string;
    size: string;
  };

  type Track = {
    name: string;
    path: string;
    src: string;
    size: string;
    title: string;
    artist: string;
    album: string;
    duration: number;
    metadataLoaded: boolean;
  };

  const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.flac', '.m4a'];

  let audioEl: HTMLAudioElement | null = null;
  let tracks: Track[] = [];
  let currentIndex = -1;

  let isPlaying = false;
  let isReady = false;
  let duration = 0;
  let currentTime = 0;
  let volume = 0.8;
  let status = 'Open an audio file from FileMangler to start listening.';

  function isAudioFile(name: string): boolean {
    const dot = name.lastIndexOf('.');
    if (dot === -1) return false;
    const ext = name.substring(dot).toLowerCase();
    return AUDIO_EXTENSIONS.includes(ext);
  }

  function stripExtension(fileName: string): string {
    const dot = fileName.lastIndexOf('.');
    return dot === -1 ? fileName : fileName.substring(0, dot);
  }

function parseFilenameMetadata(fileName: string): { title: string; artist: string } {
  const base = stripExtension(fileName).replace(/_/g, ' ');
  const parts = base.split(' - ');
  if (parts.length >= 2) {
    return {
      artist: parts[0].trim() || 'Unknown Artist',
      title: parts.slice(1).join(' - ').trim() || base
    };
  }
  return {
    artist: 'Unknown Artist',
    title: base
  };
}

async function loadTrackMetadata(trackPath: string): Promise<void> {
  const index = tracks.findIndex((t) => t.path === trackPath);
  if (index === -1 || tracks[index].metadataLoaded) return;

  const current = tracks[index];

  try {
    const response = await fetch(current.src);
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const metadata = await parseBuffer(new Uint8Array(arrayBuffer), response.headers.get('content-type') || undefined);

    const title = metadata.common.title || current.title;
    const artist =
      metadata.common.artist ||
      (metadata.common.artists && metadata.common.artists.length > 0
        ? metadata.common.artists.join(', ')
        : current.artist);
    const album = metadata.common.album || current.album;

    tracks[index] = {
      ...tracks[index],
      title,
      artist,
      album,
      metadataLoaded: true
    };
    tracks = [...tracks];
  } catch (error) {
    console.warn('Metadata parse failed for', current.name, error);
    tracks[index] = {
      ...tracks[index],
      metadataLoaded: true
    };
    tracks = [...tracks];
  }
}

  function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }

  function setCurrentTrack(index: number, autoplay: boolean): void {
    if (index < 0 || index >= tracks.length || !audioEl) return;

    currentIndex = index;
    const track = tracks[currentIndex];
    isReady = false;
    status = `Loading: ${track.artist} - ${track.title}`;

    audioEl.src = track.src;
    audioEl.load();

    if (autoplay) {
      void audioEl.play().catch(() => {
        status = 'Playback blocked by browser autoplay policy. Press Play.';
      });
    }
  }

  function addOrActivateTrack(file: SelectedFile): void {
    const existingIndex = tracks.findIndex((t) => t.path === file.path);

    if (!file.content || file.content.startsWith('[')) {
  status = `Missing audio source for ${file.name}.`;
  return;
}
if (existingIndex !== -1) {
      setCurrentTrack(existingIndex, true);
      void loadTrackMetadata(tracks[existingIndex].path);
      return;
    }

    const fallback = parseFilenameMetadata(file.name);
    const newTrack: Track = {
      name: file.name,
      path: file.path,
      src: file.content,
      size: file.size,
      title: fallback.title,
      artist: fallback.artist,
      album: 'Unknown Album',
      duration: 0,
      metadataLoaded: false
    };

    tracks = [...tracks, newTrack];
    const newIndex = tracks.length - 1;
    setCurrentTrack(newIndex, true);
    void loadTrackMetadata(newTrack.path);
  }

  function togglePlayPause(): void {
    if (!audioEl || currentIndex === -1) return;

    if (audioEl.paused) {
      void audioEl.play().catch(() => {
        status = 'Could not start playback. Check file source.';
      });
    } else {
      audioEl.pause();
    }
  }

  function playTrack(index: number): void {
    setCurrentTrack(index, true);
  }

  function playNext(): void {
    if (tracks.length === 0) return;
    const nextIndex = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    setCurrentTrack(nextIndex, true);
  }

  function playPrevious(): void {
    if (tracks.length === 0) return;
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(prevIndex, true);
  }

  function onLoadedMetadata(): void {
    if (!audioEl) return;

    duration = audioEl.duration || 0;
    isReady = true;

    if (currentIndex >= 0) {
      tracks[currentIndex] = {
        ...tracks[currentIndex],
        duration
      };
      tracks = [...tracks];
      status = `Now playing: ${tracks[currentIndex].artist} - ${tracks[currentIndex].title}`;
    }
  }

  function onTimeUpdate(): void {
    if (!audioEl) return;
    currentTime = audioEl.currentTime || 0;
  }

  function onPlay(): void {
    isPlaying = true;
  }

  function onPause(): void {
    isPlaying = false;
  }

  function onEnded(): void {
    playNext();
  }

  function onError(): void {
    const name = currentIndex >= 0 ? tracks[currentIndex].name : 'track';
    status = `Failed to load ${name}. Check that the audio file exists at the expected path.`;
  }

  function onSeek(event: Event): void {
    if (!audioEl) return;
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    audioEl.currentTime = value;
    currentTime = value;
  }

  function onVolumeChange(event: Event): void {
    if (!audioEl) return;
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    volume = value;
    audioEl.volume = value;
  }

  fileDialogStore.subscribe((state) => {
    if (
      state.requestedBy === 'Jukebox' &&
      state.requestedByWindowId === windowId &&
      state.selectedFile &&
      isAudioFile(state.selectedFile.name)
    ) {
      addOrActivateTrack(state.selectedFile);
    }
  });
</script>

<div class="jukebox">
<audio
  bind:this={audioEl}
  on:loadedmetadata={onLoadedMetadata}
  on:timeupdate={onTimeUpdate}
  on:play={onPlay}
  on:pause={onPause}
  on:ended={onEnded}
  on:error={onError}
></audio>

  <div class="header">
    <h2>Jukebox</h2>
    <p>{status}</p>
  </div>

  <div class="now-playing">
    {#if currentIndex >= 0}
      <div class="np-left">
        <strong>{tracks[currentIndex].title}</strong>
        <span>{tracks[currentIndex].artist}</span>
        <small>{tracks[currentIndex].album}</small>
      </div>
      <div class="np-right">
        <span>{tracks[currentIndex].size}</span>
        <small>{formatTime(tracks[currentIndex].duration || duration)}</small>
      </div>
    {:else}
      <strong>No track selected</strong>
      <span>Use FileMangler to open a music file</span>
    {/if}
  </div>

  <div class="controls">
    <button on:click={playPrevious} disabled={tracks.length === 0}>Prev</button>
    <button on:click={togglePlayPause} disabled={tracks.length === 0}>
      {isPlaying ? 'Pause' : 'Play'}
    </button>
    <button on:click={playNext} disabled={tracks.length === 0}>Next</button>
  </div>

  <div class="timeline">
    <span>{formatTime(currentTime)}</span>
    <input
      type="range"
      min="0"
      max={Math.max(duration, 0)}
      step="0.1"
      value={currentTime}
      on:input={onSeek}
      disabled={!isReady}
    />
    <span>{formatTime(duration)}</span>
  </div>

  <div class="volume">
    <label for="volume-slider">Volume</label>
    <input
      id="volume-slider"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={volume}
      on:input={onVolumeChange}
    />
  </div>

  <div class="playlist">
    <h3>Playlist</h3>
    {#if tracks.length === 0}
      <p class="empty">No tracks queued yet.</p>
    {:else}
      {#each tracks as track, i (track.path)}
        <button
          class="track"
          class:active={i === currentIndex}
          on:click={() => playTrack(i)}
        >
          <div class="track-main">
            <span>{track.title}</span>
            <small>{track.artist}</small>
          </div>
          <div class="track-meta">
            <small>{track.duration > 0 ? formatTime(track.duration) : '--:--'}</small>
          </div>
        </button>
      {/each}
    {/if}
  </div>
</div>

<style>
  .jukebox {
    display: grid;
    grid-template-rows: auto auto auto auto auto 1fr;
    gap: 12px;
    height: 100%;
    padding: 14px;
    color: #e8edf8;
    background: linear-gradient(150deg, #101827 0%, #1f2937 65%, #111827 100%);
  }

  .header h2 {
    margin: 0;
    font-size: 20px;
    color: #9fe8ff;
  }

  .header p {
    margin: 4px 0 0;
    font-size: 13px;
    color: #bfd0e5;
  }

  .now-playing {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    padding: 10px;
    border: 1px solid rgba(159, 232, 255, 0.3);
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.18);
  }

  .np-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .np-left strong,
  .track-main span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .np-left span,
  .track-main small {
    color: #c9d8ee;
    font-size: 12px;
  }

  .np-left small {
    color: #9fb4cf;
    font-size: 11px;
  }

  .np-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    color: #bfd0e5;
  }

  .controls {
    display: flex;
    gap: 8px;
  }

  .controls button,
  .track {
    border: 1px solid rgba(159, 232, 255, 0.4);
    border-radius: 7px;
    background: rgba(17, 24, 39, 0.85);
    color: #e8edf8;
    cursor: pointer;
    transition: 0.15s ease;
  }

  .controls button {
    padding: 8px 12px;
  }

  .controls button:hover:not(:disabled),
  .track:hover {
    background: rgba(159, 232, 255, 0.16);
  }

  .controls button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  .timeline {
    display: grid;
    grid-template-columns: 44px 1fr 44px;
    align-items: center;
    gap: 10px;
    font-size: 12px;
  }

  .timeline input,
  .volume input {
    width: 100%;
  }

  .volume {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 10px;
  }

  .playlist {
    min-height: 0;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .playlist h3 {
    margin: 0;
    font-size: 14px;
    color: #9fe8ff;
  }

  .track {
    width: 100%;
    text-align: left;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
  }

  .track.active {
    border-color: #9fe8ff;
    background: rgba(159, 232, 255, 0.22);
  }

  .track-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
    flex: 1;
  }

  .track-meta {
    color: #bfd0e5;
    margin-left: 8px;
  }

  .empty {
    color: #9fb4cf;
    margin: 0;
    font-size: 13px;
  }
</style>