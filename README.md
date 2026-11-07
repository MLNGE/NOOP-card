# NOOP Card

A compact, wide Home Assistant Lovelace card for displaying NOOP charge, effort, rest, battery, steps, and the time since the last sync.

## Installation

1. Copy `noop-card.js` into your Home Assistant `/config/www/noop-card/` directory.
2. Add the resource under **Settings > Dashboards > Resources**:

   ```yaml
   url: /local/noop-card/noop-card.js
   type: module
   ```

3. Add the card to a dashboard using YAML mode.

After the card is added, it can also be configured through the visual card editor. The editor provides entity selectors for the primary NOOP entity, charge, effort, rest, battery, steps, and sync.

## Basic configuration

```yaml
type: custom:noop-card
entity: sensor.noop_tim_noop_charge
```

The card uses the configured entity as its anchor. The current default NOOP entities are included in `noop-card.js`.

## Explicit entity configuration

Use explicit mappings when the card is used with another NOOP device or when entity IDs differ:

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

The sync timestamp uses `last_reported`, falling back to `last_updated`. The relative time refreshes every 30 seconds.
