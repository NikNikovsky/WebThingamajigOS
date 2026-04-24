# Copilot Instructions for Fatuus

## Project Overview

Fatuus is a browser-based OS-like UI built with Svelte and Vite. It includes onboarding, login, a desktop shell, window management, and app-style components.

User context: beginner-friendly explanations are required.

Rule: do not silently replace any code. Explain what will change and why before proposing code, unless the user explicitly asks for direct implementation.

## Current Architecture

### Runtime screen flow

`src/App.svelte` determines what to render:

1. OOBE (`src/components/OOBE.svelte`) when `hasCompletedOOBE` is false
2. Login (`src/components/LoginScreen.svelte`) when OOBE is done but user is not logged in and mode is not offline
3. Desktop shell (`Desktop`, `WindowManager`, `Taskbar`) once logged in

Global overlays loaded by root app:

- `src/components/ServerStatusWarning.svelte` (server-health warning screen)
- `src/components/FileDialog.svelte` (shared file picker modal)

### Main state stores

- `src/state/windowStore.ts`
  - Handles open/close/focus/move/resize/minimize/restore
  - Registers and unregisters pseudo-processes in `processStore`
- `src/state/settingsStore.ts`
  - Persists onboarding mode, server URL, and login state to localStorage (`fatuus-settings`)
- `src/state/preferencesStore.ts`
  - Persists app and UI preferences, used by Settings and apps like TextManipulator
- `src/state/healthStore.ts`
  - Periodic health checks and alive/down state
- `src/state/processStore.ts`
  - Simple PID-like tracking for open windows/apps

### App registration pattern

Apps are declared in `src/lib/appRegistry.ts` as a `Map<string, AppMetadata>`.

Current registered apps:

- TextManipulator
- FileMangler
- Jukebox
- TasqueMangler
- Settings
- Ultrakill

Taskbar start menu renders from the registry and launches by app key.

## Development Workflow

Use these scripts from `package.json`:

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run type-check
```

## Conventions For Changes

### Svelte patterns

- Prefer store update methods over direct mutation
- Use keyed each blocks for window/app lists
- Keep global style behavior in `src/app.css` or `:global(...)`
- Preserve taskbar and window layering behavior (`z-index`, pointer-event pass-through)

### Adding a new app

1. Add component at `src/apps/<AppName>/<AppName>.svelte`
2. Register it in `src/lib/appRegistry.ts` with `name`, `title`, `component`, and `defaultWindow`
3. Verify it appears automatically in the Start menu

### Window behavior expectations

- Focus should bring a window to front (`zIndex = max + 1`)
- Minimized windows should not render content in `Window.svelte`
- Maximized windows should account for the taskbar height

## Known Issues Snapshot (Keep Fresh)

From current README and code comments:

- Text editor has persistence edge cases (remember-last-file and font size behavior)
- File manager still uses mock storage and has incomplete folder/manual-path features
- Jukebox is still mostly placeholder-level
- Some settings and preferences may not persist as expected in all cases
- Desktop background contrast can reduce text readability

Whenever these are resolved, update this file and README together.

## Guidance Style For This User

- Explain first, then show code
- Keep steps concrete and beginner-friendly
- Point to `guide.html` for project refresher context
- Ask clarifying questions for UI/UX issues before changing visuals
