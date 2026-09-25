# PackCast v1 Plan

**Status:** Pending maintainer review  
**Recommended priority:** P1  
**Source:** PackCast product brief and [workflow design canvas](workflow-design-canvas.md)

## Problem

Travelers currently combine a weather app, activity-specific memory, and static packing templates by hand. That creates avoidable omissions and duplicate work, especially when weather changes.

## Desired Outcome

Given one destination, a date range, and at least one activity, PackCast generates a categorized, editable packing checklist with a compact day-by-day weather summary and a short reason for weather-driven items.

The first release must work locally after a list has been generated. It must remain useful when weather lookup fails by generating a clearly labeled base plus activity list.

## v1 Scope

### Included

- Trip creation with destination, dates, activities, laundry availability, luggage type, and temperature units.
- Preset activities: casual sightseeing, business meetings, formal event, hiking, beach/pool, gym/running, nightlife/dinner out, and snow activities.
- Destination geocoding and weather access through an Open-Meteo provider adapter.
- Forecast, historical climate, mixed-source, and unavailable-weather states.
- Pure rule engine with base, duration, weather, activity, interaction, and deduplication layers.
- Categorized checklist with quantities, reasons, provenance, check state, add/edit/delete, and local persistence.
- Weather refresh with a visible summary of changed packing recommendations.
- Unit tests for the rule engine and focused tests for persistence and the weather boundary.

### Explicitly Excluded

Accounts, cloud sync, sharing, family lists, multi-destination trips, booking integrations, push notifications, monetization, and LLM-generated suggestions.

## Acceptance Criteria

1. A valid trip with at least one activity generates a categorized checklist.
2. Forecast data is used inside the forecast window; far-future trips use historical climate data and display the source label.
3. Boundary trips label each day as forecast or climate, and weather-unavailable trips never present invented weather as fact.
4. Weather thresholds add only the applicable items and explain why each item was added.
5. Quantities scale with duration and respect the laundry cap.
6. Duplicate items merge to the highest quantity with combined reasons and provenance.
7. Users can check, uncheck, add, edit, and delete items; state survives reload and offline viewing.
8. Refreshing weather identifies additions, removals, and changed weather-driven reasons.
9. Invalid dates, missing destinations, and no activities block generation with actionable validation.
10. Tests cover base, duration, weather, activity, interaction, units, thresholds, deduplication, caps, and provider failure.

## Proposed Delivery Slices

1. **Rules foundation:** data-driven rules, normalized models, pure generator, and unit tests.
2. **Weather boundary:** provider interface, Open-Meteo geocoding/forecast/climate adapters, caching contract, and failure state.
3. **Trip and checklist flow:** creation form, generated list, local persistence, checklist edits, and responsive mobile-first UI.
4. **Refresh and polish:** change detection, source labels, offline behavior, edge cases, and end-to-end coverage.

## Open Questions

- Which client stack and local persistence library fit the target project environment?
- What exact forecast-window boundary should determine forecast versus climate data?
- Should “umbrella” and “rain jacket” be alternatives or independent recommendations in v1?
- Which weather response fields are guaranteed by the selected Open-Meteo endpoints?
- Is a user-maintained “always pack” list deferred to v1.1?

## Gate

**Maintainer action required:** Confirm the P1 priority, included scope, excluded scope, and open-question treatment. After approval, create a `design-request` work item for the architecture and test strategy. Do not begin implementation from this plan alone.