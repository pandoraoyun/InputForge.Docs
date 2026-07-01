---
title: InputKey
description: The unified input source resource — one class handles keyboard, gamepad, mouse buttons, analog axes, mouse delta, and pointer position.
---

`InputKey` is the unified input source resource. A single class handles all device types and axis configurations — select what you need from the Inspector dropdowns.

## InputType

The top-level selector. Determines which fields are shown in the Inspector and how the raw hardware event is interpreted.

| Value     | Device                     | Output shape            |
|-----------|----------------------------|-------------------------|
| `Boolean` | Key / button               | `Vector3(1 or 0, 0, 0)` |
| `Digital` | Keyboard pair              | `Vector3(x, y, 0)`      |
| `Analog`  | Joystick axis              | `Vector3(x, y, 0)`      |
| `Delta`   | Mouse motion               | `Vector3(x, y, 0)`      |
| `Pointer` | Absolute cursor position   | `Vector3(x, y, 0)`      |

---

## Boolean

Captures a single key, gamepad button, or mouse button press. Echo events (OS key-repeat) are filtered automatically.

| Property        | Description                                                        |
|-----------------|-------------------------------------------------------------------|
| `DeviceType`    | `Keyboard`, `MouseButton`, or `JoyButton`                         |
| `KeyboardKey`   | The keyboard scancode (visible when `DeviceType` = `Keyboard`)    |
| `MouseKey`      | The mouse button (visible when `DeviceType` = `MouseButton`)      |
| `GamepadButton` | The gamepad button index (visible when `DeviceType` = `JoyButton`) |

Output: `Vector3(1, 0, 0)` while pressed, `Vector3(0, 0, 0)` on release.

---

## Digital

Reads two keyboard keys as a signed axis. Each axis produces values in the range `[-1, 1]`.

| Property        | Description                              |
|-----------------|------------------------------------------|
| `AxisDimension` | `Axis1D` or `Axis2D`                     |
| `PositiveKey`   | Key that drives the axis toward +1       |
| `NegativeKey`   | Key that drives the axis toward -1       |
| `PositiveKeyY`  | Y-axis positive key (Axis2D only)        |
| `NegativeKeyY`  | Y-axis negative key (Axis2D only)        |

Tip: pair with `NormalizeModifier` to prevent diagonal movement being ~1.41× faster than cardinal.

---

## Analog

Reads one or two joystick axes directly. Raw hardware values are passed through — apply `DeadzoneModifier` to filter drift.

| Property        | Description                                   |
|-----------------|-----------------------------------------------|
| `AxisDimension` | `Axis1D` or `Axis2D`                          |
| `JoystickAxis`  | The X (or only) joystick axis                 |
| `JoystickAxisY` | The Y joystick axis (Axis2D only)             |

---

## Delta

Reads mouse motion as a frame delta. Produces a new value each time the mouse moves; returns to zero when the mouse stops.

| Property        | Description                                       |
|-----------------|---------------------------------------------------|
| `AxisDimension` | `Axis1D` or `Axis2D`                              |
| `Sensitivity`   | Multiplier applied to the raw delta               |
| `IsYAxis`       | Read Y motion instead of X (Axis1D only)          |

---

## Pointer

Reads the **absolute mouse cursor position** in viewport space — distinct from `Delta`, which reports relative motion. A mouse motion event still has to arrive for the value to update (InputForge stays event-driven, never polling every frame), but the value itself is the live cursor position read from the viewport, not derived from the event's relative movement.

No `Sensitivity` or `IsYAxis` — those are Delta concepts. Output: `Vector3(x, y, 0)` where `x`/`y` are the cursor's pixel coordinates. Pair with `PointerSpaceModifier` to reinterpret the raw pixels as screen-relative or rect-relative coordinates.

Use for: cursor-following UI, aim-at-cursor mechanics, anything that needs "where is the pointer" rather than "how much did it move".
