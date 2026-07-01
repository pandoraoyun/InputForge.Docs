---
title: Architecture
description: How InputForge processes an input event through its layered pipeline — from Godot's _Input to your typed callback.
---

InputForge processes input through a layered pipeline. Understanding this pipeline makes it easy to reason about why an action fires or doesn't.

```
Godot _Input(event)
  └── EnhancedInputSystem
        └── for each active InputMappingContext (last-in, highest priority)
              └── for each InputMapping
                    ├── InputKey.HandleInput(event)    → does this event match?
                    ├── InputKey.GetValue()            → raw Vector3 value
                    ├── InputMapping.ApplyModifiers()  → transform the value
                    ├── InputMapping.EvaluateTriggers() → should it fire?
                    └── InputMappingContext.PushAction() → deliver to subscribers
```

## Core Types

### EnhancedInputSystem

A singleton `Node` added as an autoload. Receives all Godot input events and routes them through the active context stack. Contexts are evaluated in reverse order — the most recently added context has the highest priority. When a context handles an input event, the event is consumed and lower-priority contexts do not see it. Mouse motion events are never consumed.

### InputAction

A `Resource` with a single `ActionName` string. Acts as a value object — two `InputAction` instances with the same name are equal and share the same subscriber list. Assign one per logical action (e.g. `"Jump"`, `"Move"`, `"Attack"`).

### InputKey

A unified `Resource` that captures one physical input source. Configured entirely in the Inspector — no subclasses needed. Produces a `Vector3` carrier value, where the shape depends on the input type (Boolean, Digital, Analog, Delta, Pointer). See the [InputKey reference](/InputForge.Docs/reference/input-key) for the full breakdown.

### InputMapping

Binds an `InputKey` to an `InputAction` and holds the modifier and trigger lists for that specific binding. Multiple mappings can target the same action (multi-key binding), and a [source-aware callback](#source-aware-callbacks) can tell which one fired.

### InputMappingContext

A named collection of `InputMapping` entries. Push it onto the `EnhancedInputSystem` stack when it becomes relevant (entering gameplay, opening a menu, entering a vehicle) and pop it when it no longer applies. See [Context Stack](/InputForge.Docs/concepts/context-stack).

### InputModifier

Transforms the raw `Vector3` value before trigger evaluation. Modifiers are applied in array order. See [Modifiers](/InputForge.Docs/reference/modifiers).

### InputTrigger

Decides whether the processed value should cause the action to fire this event. Triggers are evaluated with OR logic — if any trigger returns true, the action fires. See [Triggers](/InputForge.Docs/reference/triggers).

## Value Shape

All values flow as `Vector3` internally. This lets a single modifier and trigger interface work across every input type. Subscribers receive the value cast to the type they bound:

| Callback type                  | Receives                                       |
|--------------------------------|------------------------------------------------|
| `Action<bool>`                 | `value.X > 0.5f`                               |
| `Action<float>`                | `value.X`                                      |
| `Action<Vector2>`              | `new Vector2(value.X, value.Y)`                |
| `Action<Vector3>`              | `value` (raw)                                  |
| `Action<ContextualInputEvent>` | the full event — value, raw event, and `Source` |

## Source-aware callbacks

When one action is driven by several mappings (for example WASD *and* mouse delta both feeding a single `Move`), a plain value callback can't tell which physical source produced the value. Binding `Action<ContextualInputEvent>` solves this: the callback receives a `ContextualInputEvent` whose `Source` is the `InputKey` that fired, so you can branch on `Source.InputType` or `Source.DeviceType`.

```csharp
context.BindAction(moveAction, (ContextualInputEvent e) =>
{
    if (e.Source.InputType == InputType.Delta)
        HandleMouseLook(e.RawValue);
    else
        HandleWasd(new Vector2(e.RawValue.X, e.RawValue.Y));
});
```

The existing value-typed overloads are unchanged — use the contextual overload only when you actually need to know the source.

## Default Triggers

When no triggers are assigned to a mapping, InputForge selects a sensible default:

- **Boolean input** → `TriggerOnKeyDown` (fires on the rising edge only)
- **Axis input** (Digital, Analog, Delta, Pointer) → `TriggerOnChange` (fires whenever the value changes, including returning to zero)
