# Copilot Instructions for WebThingamajigOS

## Project Overview

WebThingamajigOS is a browser-based operating system built with **Svelte + TypeScript + Vite**. It mimics a desktop OS with window management, a taskbar, applications, and state management - inspired by ArcOS.

**Key Context**: User is a beginner learning to code. Prioritize **explanation over auto-fixing** - guide them through changes instead of implementing directly.

---

## Architecture Essentials

### Core Layers (Understand Before Suggesting Changes)

1. **Presentation Layer** (`src/components/`) - Svelte components: `Desktop`, `Taskbar`, `WindowManager`, `Window`
2. **State Layer** (`src/state/`) - Svelte stores using `writable()`: `windowStore`, `systemStore`
3. **Business Logic** (`src/lib/`) - Registry patterns and utilities: `appRegistry`, `windowManager` (planned)
4. **Type Layer** (`src/types/`) - TypeScript interfaces: `Window`, `App`, `System`, `File` (planned)
5. **Applications** (`src/apps/`) - Individual app components (TextEditor example exists in guide)

### Data Flow
- **Window Operations**: UI → `Taskbar.launchApp()` → `windowStore.openWindow()` → Windows array updates → `WindowManager` renders
- **Window Focus**: Click window → `windowStore.focusWindow()` → Z-index recalculated → Svelte reactivity updates view
- **App Launch**: Start menu button → `launchApp(appName)` → Registry lookup → Window creation with app component

---

## Critical Files & Patterns

### State Management (`src/state/windowStore.ts`)
- **Pattern**: Custom store factory returning object with `subscribe` + custom methods
- **Operations**: `openWindow()`, `closeWindow()`, `focusWindow()`, `moveWindow()`, `resizeWindow()`
- **Z-Index Logic**: Auto-calculated; focus sets to `maxZIndex + 1`
- **Don't**: Directly mutate store - always use update functions

### Component Structure
- **App.svelte**: Root component that renders `<Desktop>`, `<WindowManager>`, `<Taskbar>` in order
- **Taskbar.svelte**: Handles Start menu state, app launching, time display (updates every 60s)
- **WindowManager.svelte**: Subscribes to `windowStore`, renders `Window` components for each entry
- **Window.svelte**: Individual window with drag/resize (handlers exist but need completion)
- **Desktop.svelte**: Fixed background with title; uses `pointer-events: none` so it doesn't block clicks

### Svelte-Specific Patterns
- **Subscriptions**: Use `store.subscribe(value => state = value)` in `onMount()` or reactive statements
- **Conditionals**: Svelte conditional blocks with nesting/indentation matters (common beginner error)
- **Loops**: Svelte each blocks with keys - always include `(key)` for reactivity
- **Global Styles**: Use `:global()` pseudo-selector in `<style>` blocks; avoid `<style global>`

---

## Development Workflow

### Running the Project
```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # Production build
npm run type-check # TypeScript type checking
npm run lint       # ESLint (if configured)
```

### File Locations by Task
- **Creating new app**: `src/apps/[AppName]/[AppName].svelte`
- **Adding UI component**: `src/components/[Component].svelte`
- **Adding state**: `src/state/[featureStore].ts`
- **Adding types**: `src/types/[feature].ts`
- **Global styles**: `src/app.css` (already configured with gradient, removed default flex centering)

### CSS Gotchas
- Taskbar is `position: fixed; bottom: 0; z-index: 1000`
- Windows should avoid overlapping taskbar (add `padding-bottom: 50px` or adjust window min-y)
- Desktop uses `pointer-events: none` so clicks pass through to windows
- Body background is gradient in `app.css`, not in component styles

---

## Common Patterns & Conventions

### Creating a New Application
1. Create folder: `src/apps/[AppName]/`
2. Create component: `src/apps/[AppName]/[AppName].svelte` with `<script lang="ts">` block
3. Register in `src/lib/appRegistry.ts`:
   ```typescript
   import [AppName] from '../apps/[AppName]/[AppName].svelte';
   
   export const appRegistry: Map<string, AppMetadata> = new Map([
     ['[AppName]', {
       name: '[AppName]',
       title: '[Display Name]',
       icon: 'icon-name',
       component: [AppName],
       defaultWindow: { width: 800, height: 600 }
     }],
   ]);
   ```
4. Add launch button in `Taskbar.svelte` start menu

### Window Lifecycle
```typescript
// Opening
windowStore.openWindow({
  id: `app-${Date.now()}`,
  title: 'App Title',
  appName: 'AppName', // Must match registry key
  x: 100, y: 100,
  width: 800, height: 600,
  zIndex: 100,
  isMinimized: false,
  isMaximized: false,
  isFocused: true,
});

// Closing
windowStore.closeWindow(windowId);

// Focusing (brings to front)
windowStore.focusWindow(windowId);
```

### Store Subscription Example
```svelte
<script lang="ts">
  import { windowStore } from '../state/windowStore';
  
  let windows: any[] = [];
  
  // Reactive subscription
  windowStore.subscribe(w => {
    windows = w;
  });
</script>
```

---

## Learning Resources

- **Guide**: Open `guide.html` in browser for interactive documentation
- **Svelte Docs**: https://svelte.dev/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/
- **Inspiration**: ArcOS v6 (https://github.com/ArcOS-Project/v6)

---

## Current Known Issues & TODOs

- **Window dragging/resizing**: Handlers stubbed in `Window.svelte`, needs implementation
- **Window minimize/maximize**: Buttons exist but logic not implemented
- **File manager app**: Not yet created
- **Settings app**: Not yet created
- **CSS positioning**: Windows may overlap taskbar - needs padding adjustment

---

## Guidance Style for This User

- **Always explain first** - Describe what needs to happen before showing code
- **Reference the guide** - Link to `guide.html` sections for learning context
- **No auto-fixes** - User implements to learn; only fix syntax errors breaking compilation
- **Ask clarifying questions** - When visual issues reported, ask what specifically looks wrong
- **Celebrate progress** - This is a beginner's first project; encourage incremental wins
