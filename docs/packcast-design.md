# PackCast v1 Design

**Status:** Approved for implementation by the maintainer request to proceed  
**Input:** [PackCast plan](packcast-plan.md) and [design canvas](workflow-design-canvas.md)

## Recommendation

Build a mobile-first Vite + TypeScript web app with three small boundaries:

1. `rules.ts` contains framework-independent data and a pure `generatePackingList` function.
2. `weather.ts` owns the weather-provider interface and a deterministic demo weather fallback for the first slice. Open-Meteo integration can be added without changing the rule engine or UI contract.
3. `main.ts` owns the trip form, checklist interactions, and localStorage persistence.

Use localStorage for the first release because it satisfies offline viewing without introducing accounts or a backend. Store the normalized trip, weather days, and generated items as one versioned record.

## Data Contracts

`TripInput` contains destination, dates, activities, laundry availability, luggage type, and units. `DayWeather` contains date, source, high/low temperature, precipitation probability, wind, and UV. `PackingItem` contains a stable id, name, category, quantity, reasons, sources, and checked state.

Rules are data-driven in `rules.json`: base items, activity mappings, and numeric weather thresholds are separate from the engine. The engine converts Celsius/Fahrenheit at its boundary and deduplicates by normalized item name.

## User Flow

1. The landing view presents destination, dates, activity chips, laundry, luggage, and units.
2. Submit validates required fields and generates a trip from deterministic demo weather until the provider adapter is connected.
3. The result view shows source status, a horizontal weather strip, overall progress, and category sections.
4. Checklist rows support check/uncheck, quantity edits, and deletion. A compact add-item control supports custom items.
5. Refresh regenerates weather-dependent recommendations and reports the number of changed items. Reload restores the saved record.

## Risks and Mitigations

- **Provider availability:** retain a visible “weather unavailable” state and generate base/activity items without invented conditions.
- **Rule sprawl:** keep thresholds and mappings in JSON and test boundary values.
- **Checklist data loss:** persist after every mutation and include a storage version.
- **Forecast boundary ambiguity:** use a single provider boundary constant and expose the source on every weather day.
- **Scope expansion:** defer authentication, cloud sync, sharing, and LLM suggestions.

## Test Strategy

- Unit-test base and duration quantities, laundry caps, activity mappings, all weather thresholds, unit conversion, interactions, and deduplication.
- Test the UI build and typecheck on every change.
- Keep provider calls replaceable; the initial UI uses deterministic local weather so tests and offline behavior do not depend on a network.

## Smallest Implementation Slice

Implement the trip form, deterministic weather summary, pure generator, categorized editable checklist, local persistence, and focused rule tests. Open-Meteo networking and historical climate averaging remain the next implementation slice behind the documented provider boundary.