# Genpage Plan

## User Requirements
Create a new generative page called QualifyInquiry. It's used as a dialog for users to qualify a travel inquiry by supplying the status reason to be adjust. Either Won or Lost using a picklist. The dialog has a submit and cancel button. The submit button calls the voy_QualifyInquiry custom action which has a Status input parameter (type Picklist) and a QuoteId Guid output parameter. The cancel button closes the custom page without saving any changes.

## Assumptions

### A1 — Status picklist values
- Decision: Render exactly two required status choices: Won (`629350005`) and Lost (`629350004`).
- Alternatives considered: Different numeric mappings or additional status choices.
- Evidence: metadata: `voy_QualifyInquiry` declares `Status` as Picklist; the maker supplied the numeric mappings.
- Resolution: user-confirmed
- Question: qualify-inquiry-status-values
- Answer: Won = 629350005; Lost = 629350004.

### A2 — Bound record context
- Decision: Submit invokes the entity-bound action for the current `voy_travelinquiry` record using `pageInput.recordId`; if context is absent, do not invoke the action and show an actionable error.
- Alternatives considered: Invoke against an unrelated record or use an unbound action.
- Evidence: metadata: `voy_QualifyInquiry` is bound to `voy_travelinquiry`.
- Resolution: planner-default

### A3 — Submit completion
- Decision: On successful action execution, retain the returned `QuoteId` only as the action result and close the dialog; do not navigate or modify additional records.
- Alternatives considered: Navigate to the returned quote, display quote details, or leave the dialog open.
- Evidence: default: no target page or post-submit behavior was requested.
- Resolution: planner-default

### A4 — Selection safety
- Decision: Start with no selected status and require the user to select Won or Lost before enabling Submit.
- Alternatives considered: Preselect Won or Lost.
- Evidence: default: an explicit selection reduces accidental qualification outcomes.
- Resolution: planner-default

## Working Directory
C:/dev/powerplatform/voyagevista2/src/GenerativePages/qualify-inquiry

## Plugin Root
C:/Users/jeroe/.copilot/installed-plugins/power-platform-skills/model-apps

## Environment
- URL: https://org93c235e6.crm4.dynamics.com
- App: Voyage Vista Sales App (54fce4ae-eeac-f111-aaab-7ced8d759cbe)
- Languages: English (United States) (1033, en-US)
- Solution: VoyageVistaSales
- Publisher Prefix: voy

## Pages
| Page | File | Purpose | Entities |
|---|---|---|---|
| Qualify Inquiry | qualify-inquiry.tsx | Dialog for qualifying the current travel inquiry as Won or Lost. | voy_travelinquiry |

## Entity Creation Required
No entity creation required — all entities already exist.

## Existing Entities
voy_travelinquiry

## Connector Bindings
No connector bindings.

## Custom API Bindings
| Name | Kind | Bound Entity | Display Name | Parameters (name: kind) |
|------|------|--------------|--------------|-------------------------|
| voy_QualifyInquiry | Action | voy_travelinquiry | Qualify Inquiry | Status: Picklist |

## Design Preferences
- Styling: Fluent UI V9 defaults.
- Features: Required Won/Lost picklist, submit action invocation, cancel without saving, disabled Submit until a status is selected, action error feedback.
- Accessibility: WCAG AA defaults; associate the status label with its control, use clear button labels, preserve keyboard operation and focus order.

## Relevant Samples
| Page | Sample | Reason |
|---|---|---|
| Qualify Inquiry | 12-dialog-form-overlay.tsx | Dialog layout with primary and cancel actions. |
| Qualify Inquiry | 13-custom-api-invocation.tsx | Entity-bound Custom API invocation and action-state handling. |

## Per-Page Specifications

### Qualify Inquiry
- **File:** qualify-inquiry.tsx
- **Purpose:** Qualify the current travel inquiry through the bound `voy_QualifyInquiry` action.
- **Entities:** voy_travelinquiry
- **Needs caching:** false
- **Key Features:** Required Won/Lost picker; Submit invokes the bound action with the selected numeric `Status`; Cancel closes without saving; prevent duplicate submits; show action failure feedback.
- **Components:** Fluent UI V9 `Dropdown`, `Option`, `Button`, `MessageBar`, `Spinner`, and dialog-oriented layout components.
- **Layout:** Compact responsive dialog layout with a labelled picker and right-aligned Cancel and Submit actions.
- **Data Binding:** No mount-time data read. Bind the picker to inline, user-confirmed Picklist values. Read `pageInput.recordId` only to bind the action target and invoke `executeAction` for `voy_QualifyInquiry`. Retain the `QuoteId` Guid output only as the action result.
- **Interactions:** Cancel closes the custom page without changes. Submit is enabled only after a selection; it invokes `voy_QualifyInquiry` against the current `voy_travelinquiry` record. On success, close the dialog; on failure, keep it open and show an accessible error.

#### Data semantics
None.

#### Lookup metadata
None.
