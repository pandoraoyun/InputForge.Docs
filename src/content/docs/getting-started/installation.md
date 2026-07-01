---
title: Installation
description: Install InputForge into a Godot 4.7+ (.NET) project via the Asset Library, degit, or a manual copy, then enable the plugin.
---

InputForge is a pure C# plugin, so it requires the **.NET / Mono build of Godot 4.7 or newer** — the standard (GDScript-only) build won't compile the addon. Pick whichever installation method fits your workflow; all three drop the same `addons/input_forge` folder into your project.

## Requirements

- Godot **4.7+** — **.NET (C#/Mono)** build
- A .NET SDK compatible with your Godot version (.NET 8 or newer)
- For the *degit* method only: [Node.js](https://nodejs.org)

## Option A — degit (recommended)

[degit](https://github.com/Rich-Harris/degit) pulls only the plugin folder — no git history, no demo project, no extra files. From your project root:

```bash
npx degit pandoraoyun/InputForge/addons/input_forge addons/input_forge
```

Run the exact same command again whenever you want to update to the latest version — it overwrites the folder in place.

## Option B — Manual

Clone or download the [InputForge repository](https://github.com/pandoraoyun/InputForge) and copy its `addons/input_forge` folder into your own project's `addons/` directory.

## A note on the in-editor Asset Store

Godot 4.7 replaced the in-editor **AssetLib** with the new **Asset Store**, and the legacy Asset Library is now deprecated / read-only. InputForge is currently published on the legacy Asset Library only — its listing on the new Asset Store is still pending — so the in-editor store tab in 4.7+ won't find it yet. Until that listing lands, use the degit or manual method above. This page will be updated once InputForge is live on the Asset Store.

## Enable the plugin

After the files are in place, build the project once (so the C# assembly compiles), then enable the plugin:

**Project → Project Settings → Plugins → InputForge → Enable**

Enabling it registers `EnhancedInputSystem` as an autoload automatically — you don't need to add the singleton by hand. You can confirm it under **Project → Project Settings → Autoload**.

## Verify

If the plugin loaded correctly, `EnhancedInputSystem.GetInstance()` returns a valid instance at runtime, and the InputForge resource types (`InputAction`, `InputKey`, `InputMapping`, `InputMappingContext`) appear in the **New Resource** dialog.

---

With the plugin installed and enabled, continue to the [Quick Start](/InputForge.Docs/getting-started/quick-start) to wire up your first action.
