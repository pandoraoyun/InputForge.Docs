---
title: Context Stack
description: The context stack lets the same physical key mean different things depending on what the player is doing.
---

The context stack is the core of InputForge's runtime flexibility. It lets the same physical key mean different things depending on what the player is currently doing.

## How the Stack Works

`EnhancedInputSystem` maintains an ordered list of active `InputMappingContext` resources. When a Godot input event arrives, contexts are evaluated **in reverse order** — the most recently added context has the highest priority.

When a context successfully handles an event (at least one mapping matches and passes its triggers), the event is consumed via `GetViewport().SetInputAsHandled()` and no lower-priority context sees it.

Mouse motion events are **never consumed** because multiple systems may need to react to them simultaneously.

```
Stack (bottom → top):
  [0] BaseContext      ← lowest priority
  [1] VehicleContext
  [2] MenuContext      ← highest priority (last added)
```

## Pushing and Popping Contexts

```csharp
var system = EnhancedInputSystem.GetInstance();

// Push when entering a state
system.AddContext(vehicleContext);

// Pop when leaving
system.RemoveContext(vehicleContext);
```

There is no strict push/pop ordering enforced — you can remove any context at any time regardless of insertion order. This means you can layer contexts arbitrarily:

```csharp
// Gameplay + vehicle simultaneously
system.AddContext(gameplayContext);
system.AddContext(vehicleContext);

// Only vehicle input reaches the vehicle; gameplay input still works for
// actions not handled by vehicleContext (e.g. pause, map)
```

### PreventFallbackContext

By default, an event that the topmost context doesn't handle falls through to lower-priority contexts. Set `PreventFallbackContext = true` to stop that — only the topmost context is evaluated, regardless of whether it matched. Useful for modal states like a pause menu, where nothing underneath should react.

```csharp
system.AddContext(menuContext);
system.PreventFallbackContext = true;   // gameplay beneath the menu goes silent
// ... on close:
system.RemoveContext(menuContext);
system.PreventFallbackContext = false;
```

### Checking the active context

`GetCurrentContext()` returns the topmost active context, and `InputMappingContext` compares by `ContextName`, so you can check which context is on top without holding the exact resource instance:

```csharp
if (system.GetCurrentContext() == drivingContext)
{
    // driving is the active context right now
}
```

## Binding and Unbinding Callbacks

Callbacks are registered on the context, not the system. This means the same context resource can be shared across multiple objects, each with their own callbacks:

```csharp
// Player A and Player B share the same GameplayContext resource
// but bind different callbacks
playerA.GameplayContext.BindAction(jumpAction, playerA.OnJump);
playerB.GameplayContext.BindAction(jumpAction, playerB.OnJump);
```

Always unbind callbacks when the subscriber is removed from the scene to avoid dangling references:

```csharp
public override void _ExitTree()
{
    EnhancedInputSystem.GetInstance().RemoveContext(GameplayContext);
    GameplayContext.UnbindAction(JumpAction, OnJump);
    GameplayContext.UnbindAction(MoveAction, OnMove);
}
```

## Callback Overloads

`BindAction` accepts five callback signatures. Choose the one that matches what you actually need from the value:

```csharp
// Boolean — pressed or released
context.BindAction(jumpAction, (bool pressed) => { });

// Float — single axis value (X component)
context.BindAction(scrollAction, (float delta) => { });

// Vector2 — two-axis value (XY components)
context.BindAction(moveAction, (Vector2 dir) => { });

// Vector3 — full raw value, all three components
context.BindAction(rawAction, (Vector3 raw) => { });

// ContextualInputEvent — value plus the InputKey Source that fired
context.BindAction(moveAction, (ContextualInputEvent e) => { });
```

The last overload is for [source-aware](/InputForge.Docs/concepts/architecture#source-aware-callbacks) handling — when one action is fed by multiple mappings and the callback needs to know which physical source produced the value. The other four are unchanged; reach for the contextual one only when you need the source.
