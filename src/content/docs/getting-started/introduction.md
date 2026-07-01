---
title: Introduction
description: InputForge — a UE5-inspired Enhanced Input System for Godot 4 (C#), with context-based mapping, a modifier/trigger pipeline, and source-aware callbacks.
---

InputForge is an Enhanced Input System for Godot 4 (C#), inspired by Unreal Engine 5's input architecture. It replaces scattered `_Input` handlers and hard-coded key checks with a structured pipeline: physical input sources are described as resources, transformed through modifiers, gated by triggers, and delivered to typed callbacks — all configured in the Inspector, no code required for the wiring itself.

## Why InputForge

Godot's built-in input map is action-based but flat: an action is either pressed or not, and remapping or context-switching (gameplay vs. menu vs. vehicle) is left entirely to your own code. InputForge adds the layer that's missing:

- **Context stack** — the same physical key can mean different things depending on what the player is doing. Push a context when entering a state, pop it when leaving; the topmost context wins.
- **Modifier pipeline** — transform raw values (deadzone, normalize, invert, scale, swizzle) before they reach your code, composably and per-binding.
- **Trigger system** — decide *when* an action fires (on press, on release, on change, continuously, or pulsed) independently of the input source.
- **Source-aware callbacks** — when one action is driven by several inputs (e.g. WASD *and* mouse), the callback can tell which physical source fired.
- **Inspector-driven** — `InputKey`, `InputMapping`, `InputMappingContext`, modifiers, and triggers are all resources. A single `InputKey` covers keyboard, gamepad, mouse buttons, analog axes, mouse delta, and pointer position, selected from dropdowns.

## How it fits together

```
Godot _Input(event)
  └── EnhancedInputSystem            (autoload singleton)
        └── active InputMappingContext stack  (topmost = highest priority)
              └── InputMapping
                    ├── InputKey      → does this event match? what's the raw value?
                    ├── Modifiers     → transform the value
                    ├── Triggers      → should it fire this event?
                    └── PushAction    → deliver to your typed callback
```

Continue to the [Quick Start](/InputForge.Docs/getting-started/quick-start) to wire up your first action, or jump to the [Architecture](/InputForge.Docs/concepts/architecture) overview for the full picture.
