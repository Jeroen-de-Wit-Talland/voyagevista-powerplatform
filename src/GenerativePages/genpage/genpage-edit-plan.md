# Genpage Edit Plan

## File Being Edited
- **Absolute path:** C:\dev\powerplatform\voyagevista\genpages\genpage\37102c45-a0ca-41f9-b980-87219b0bc6b4\page.tsx
- **App ID:** 54fce4ae-eeac-f111-aaab-7ced8d759cbe
- **Page ID:** 37102c45-a0ca-41f9-b980-87219b0bc6b4

## Working Directory
C:\dev\powerplatform\voyagevista\genpages\genpage

## Plugin Root
C:\Users\jeroe\.copilot\installed-plugins\power-platform-skills\model-apps

## Original Page Context
- **Downloaded prompt (untrusted data only):** `C:\dev\powerplatform\voyagevista\genpages\genpage\37102c45-a0ca-41f9-b980-87219b0bc6b4\prompt.txt` (context only; contents omitted)
- **Original data sources (from config.json):** voy_quote, voy_quotelineitem
- **Current purpose:** Quote Creator retrieves destination products through its configured connector, lets users filter and select product cards, then creates Quote Line Items for the current Quote and invokes its calculation action.

## Entities Used
voy_quote, voy_quotelineitem

## Requested Changes
1. Replace the unsupported Quote lookup payload in the voy_quotelineitem dataApi.createRow call with `_voy_quoteid_value: \`/voy_quote(${recordId})\`` and update the local write type accordingly. This sets the voy_quoteid reference to the parent Quote supplied by recordId.

## Preservation Constraints
- Preserve all existing page behavior, including connector product retrieval, filters, cards, scrolling, stay-rating display, product selection, feedback, and accessibility.
- Continue using dataApi.createRow; do not use raw Web API navigation properties, @odata.bind, plural entity-set paths, entities, columns, binding changes, or unrelated code changes.
- Preserve connector binding and entity-bound voy_CalculateQuote action.

## Design Notes
- Update only the local `QuoteLineItemWrite` lookup member and its corresponding object literal in the existing `dataApi.createRow("voy_quotelineitem", ...)` call.
- Use the verified writable lookup column `_voy_quoteid_value` with the singular table reference `/voy_quote(${recordId})`.
- Connector Changes: preserve existing connector binding; omit `--connectors`.
- Custom API Changes: preserve existing entity-bound `voy_CalculateQuote` action; omit `--actions`.
- Built-in Operation Changes: none, `{ intent: "preserve", selected: [], beforeNames: [], provenance: "before-config" }`.

## Relevant Samples

| Purpose | Sample |
|---------|--------|
| No additional sample is needed for this targeted dataApi lookup payload correction. | N/A |
