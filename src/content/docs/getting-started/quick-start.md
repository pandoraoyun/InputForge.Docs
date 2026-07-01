---
title: Quick Start
description: Wire up your first InputForge action from scratch using the Inspector — no code required for resource configuration.
---

This guide walks through setting up InputForge from scratch using only the Inspector — no code required for resource configuration.

## Step 1 — Create an InputAction

Right-click in the FileSystem panel → **New Resource** → search for `InputAction` → **Create**.

Set `Action Name` to a descriptive string such as `MoveAction`. Save as `MoveAction.tres`.

## Step 2 — Create an InputMappingContext

Right-click in the FileSystem panel → **New Resource** → search for `InputMappingContext` → **Create**.

Set `Context Name` to something descriptive such as `GameplayContext`. Save as `GameplayMappingContext.tres`.

## Step 3 — Add a Mapping

Click **Mappings** → set **Size** to `1`. A new `InputMapping` entry appears.

- Set **Target Action** to your `MoveAction.tres`
- Set **Input Source** to a new `InputKey` resource
- Set `Input Type` → `Digital`, `Axis Dimension` → `Axis2D`
- Assign `D / A / S / W` to the positive/negative keys

## Step 4 — Assign to your Node

Select your player node in the scene tree. In the Inspector, assign:

- **Gameplay Context** → `GameplayMappingContext.tres`
- **Move Action** → `MoveAction.tres`

## Step 5 — Subscribe in code

```csharp
public override void _Ready()
{
    EnhancedInputSystem.GetInstance().AddContext(GameplayContext);
    GameplayContext.BindAction(MoveAction, OnMove);
}

private void OnMove(Vector2 value)
{
    _moveInput = value;
}
```

## Swapping input without changing code

The key advantage of InputForge is that the `InputKey` resource is fully decoupled from your code. To switch from WASD to mouse delta, simply change `Input Type` from `Digital` to `Delta` in the Inspector — your `OnMove` callback receives the new value with zero code changes.

Next: read how the [Context Stack](/InputForge.Docs/concepts/context-stack) lets the same key mean different things in different states, or browse the [InputKey reference](/InputForge.Docs/reference/input-key) for every input type.
