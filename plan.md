# NOOP Home Assistant Card Plan

## Goal

Create a wide, compact Home Assistant card based on the supplied design. The card should display:

- Charge
- Effort
- Rest
- Time since the last sync
- Battery percentage
- Step count

The card should be wide and avoid taking excessive vertical space on the dashboard.

## Confirmed NOOP Entities

The current Home Assistant instance exposes these relevant entities:

| Metric | Entity | Current value |
|---|---|---:|
| Charge | `sensor.noop_tim_noop_charge` | `18` |
| Effort | `sensor.noop_tim_daily_effort` | `4` |
| Rest | `sensor.noop_tim_noop_rest` | `93` |
| Battery | `sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_battery` | `40%` |
| Steps | `sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_steps` | `6764` |

The latest reported sync time is available from the entity state metadata. The current entities were last updated at approximately `11:58` on 2026-11-07.

## Card Configuration

The card should allow one primary NOOP entity to be specified:

```yaml
type: custom:noop-card
entity: sensor.noop_tim_noop_charge
```

The card should use the configured entity as its anchor and automatically locate the related NOOP entities where possible.

To support different NOOP devices and entity naming schemes, provide optional explicit overrides:

```yaml
type: custom:noop-card
entity: sensor.noop_tim_noop_charge
entities:
  charge: sensor.noop_tim_noop_charge
  effort: sensor.noop_tim_daily_effort
  rest: sensor.noop_tim_noop_rest
  battery: sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_battery
  steps: sensor.noop_b3207b93_5202_419c_a6c0_13a6eb61cd92_noop_steps
  sync: sensor.noop_tim_noop_charge
```

The `sync` entity's `last_updated` or `last_reported` timestamp should drive the relative sync display, such as `2 min ago`.

## Visual Design

- Use three large circular metric displays for Charge, Effort, and Rest.
- Use distinct colors for the metric circles, matching the supplied reference image.
- Place the labels below each metric.
- Add a compact bottom information row for:
  - Last sync
  - Battery
  - Steps
- Use a horizontal layout with a constrained height.
- Make the card responsive on narrower screens.

## Implementation Structure

The project directory is currently empty. Create:

- `noop-card.js` — custom element and rendering
- `noop-card-editor.js` — optional visual editor
- `README.md` — installation and configuration examples
- `package.json` — build and development tooling
- `src/` and `dist/` if TypeScript or a bundler is used

Recommended implementation:

- Lit-based custom element
- Home Assistant card lifecycle through `set hass()`
- Explicit entity validation with visible error messages
- CSS grid or flex layout for the wide, compact presentation
- A small scheduled update to refresh relative time

## Validation

Test the card with:

- The current NOOP entities from Home Assistant
- Missing entities
- Unavailable entities
- A different NOOP device
- Narrow mobile widths
- Long relative-time values
- Battery and steps changing independently
- Configuration containing only `entity`
- Configuration containing explicit `entities` overrides

## Home Assistant Integration Notes

The Home Assistant dashboard guidance indicates that a custom card is appropriate for this design because the circular metric visuals and compact synchronized layout are not practical to reproduce with only built-in cards.
