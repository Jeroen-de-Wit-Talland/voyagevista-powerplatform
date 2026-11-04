# Genpage Plan

## User Requirements
Create Quote Creator. Display and filter Flights, Stays, and Excursions from the `Get Products By Destination` custom connector in a modern card gallery; select products and create Quote Line Items for the connected Quote in one Dataverse batch, then invoke `CalculateQuote` for `voy_quote`. Use a recordId input parameter for the Quote ID to create line items (voy_quoteid attribute logical name). Use a destination input parameter to call the Get Products By Destination connector which expects a destination string. Add components to the existing Voyage Vista Sales solution.

## Assumptions
### A1 — Default product type view
- Decision: Initially show all connector products; the user can filter locally loaded cards to Flights, Stays, or Excursions.
- Alternatives considered: Initially show Flights, Stays, or Excursions only.
- Evidence: default: requirements require type filtering but do not state an initial type.
- Resolution: planner-default

### A2 — Quote Line Item field mapping
- Decision: For every selected connector product, create one `voy_quotelineitem` in one Dataverse batch: map product `name` to `voy_name`, product type and available product details to `voy_description`, set `voy_amount` to `1`, map `price` to `voy_priceperunit`, and bind `voy_QuoteId@odata.bind` to the input Quote. Invoke `voy_CalculateQuote` only after the batch succeeds.
- Alternatives considered: Use a quantity picker; populate discount or total fields; make individual create calls; invoke Calculate Quote before or during the batch.
- Evidence: metadata: verified Quote Line Item fields, entity set, and `voy_quoteid` relationship; default: no quantity or alternate field mapping was requested.
- Resolution: planner-default

## Working Directory
C:/dev/powerplatform/voyagevista/genpages/genpage

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
|------|------|---------|----------|
| Quote Creator | quote-creator.tsx | Browse connector products by destination, select products, and batch-create Quote Line Items for the current Quote. | voy_quote, voy_quotelineitem |

## Entity Creation Required
No entity creation required — all entities already exist.

## Existing Entities
voy_quote, voy_quotelineitem

## Connector Bindings
| Logical Name | Connector Id | Dataset | Tables (GUIDs) | Table Display Names | Operations | Fields | Parameters | Response |
|--------------|--------------|---------|----------------|---------------------|------------|--------|------------|----------|
| voy_quotecreator_LPj7XG.cr.shared_voy-5fget-20p.cf104bbd-f4d0-4530-bb27-d212f32d11d9 | /providers/Microsoft.PowerApps/apis/shared_voy-5fget-20products-20by-20destination-5f6ef52b94ce739058 |  |  |  | GetFlightsForDestination; GetStaysForDestination; GetExcursionsForDestination | GetFlightsForDestination: flightNumber (string), airline (string), departureAirportCode (string), arrivalAirportCode (string), departureTime (datetime), arrivalTime (datetime), terminal (string), gate (string), availableSeats (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). GetStaysForDestination: rating (number), numberOfNights (integer), type (string), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). GetExcursionsForDestination: category (string), durationInHours (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). | GetFlightsForDestination: destination (string, required). GetStaysForDestination: destination (string, required). GetExcursionsForDestination: destination (string, required). | GetFlightsForDestination: array of { flightNumber (string), airline (string), departureAirportCode (string), arrivalAirportCode (string), departureTime (datetime), arrivalTime (datetime), terminal (string), gate (string), availableSeats (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number) }. GetStaysForDestination: array of { rating (number), numberOfNights (integer), type (string), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number) }. GetExcursionsForDestination: array of { category (string), durationInHours (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number) }. |

## Custom API Bindings
| Name | Kind | Bound Entity | Display Name | Parameters (name: kind) |
|------|------|--------------|--------------|-------------------------|
| voy_CalculateQuote | Action | voy_quote | Calculate Quote | (none) |

## Design Preferences
- Styling: Fluent UI V9 defaults.
- Features: destination-scoped connector retrieval, All/Flights/Stays/Excursions filtering, responsive modern card gallery, multi-select, one batch create of Quote Line Items, then Quote recalculation.
- Accessibility: WCAG AA defaults; keyboard-accessible type controls and card selection, visible focus states, labelled controls, descriptive card imagery, and announced selection count and error/success status.

## Relevant Samples
| Page | Sample | Reason |
|------|--------|--------|
| Quote Creator | 7-responsive-cards.tsx | Closest structural match for a responsive, selectable product card gallery. |

## Per-Page Specifications

### Quote Creator
- **File:** quote-creator.tsx
- **Purpose:** Browse connector products by destination, select products, and batch-create Quote Line Items for the current Quote.
- **Entities:** voy_quote, voy_quotelineitem
- **Needs caching:** true
- **Key Features:** Retrieve Flights, Stays, and Excursions for `pageInput.data.destination`; show All, Flights, Stays, and Excursions tabs; support accessible multi-selection; create all selected products as one atomic `voy_quotelineitem` batch for the current Quote; then invoke `voy_CalculateQuote` after a successful batch.
- **Components:** Fluent UI V9 `TabList`/`Tab`, `Card`, `Image`, `Button`, `Badge`, `Checkbox`, `Spinner`, `MessageBar`, and responsive layout primitives.
- **Layout:** Responsive modern card gallery that reflows from multiple columns to one column; type tabs and selected-count/action area remain clearly visible.
- **Data Binding:** On mount, call the three bound connector operations with `pageInput.data.destination`, normalize their optional dynamic response fields into connector product cards with declared Flight, Stay, or Excursion types, cache/dedupe the initial reads, and filter locally per F1. Build one `dataApi.executeBatch` create request for selected `voy_quotelineitems` per A2; invoke the bound Action only after its success.
- **Interactions:** Type tabs apply F1. Card checkbox/click selection updates an announced selected count. The create action validates `pageInput.recordId`, performs the R1 binding and A2 batch, then calls `dataApi.executeAction` for `voy_CalculateQuote` with `boundTo: { entityName: 'voy_quote', id: recordId }`; loading, error, and completion states are announced. The page consumes record context via `pageInput.recordId` and connector input via `pageInput.data.destination` (string).

#### Data semantics

##### R1
- Kind: relationship
- Definition: Each created `voy_quotelineitem` binds its single-target `voy_quoteid` lookup using `voy_QuoteId@odata.bind` to `/voy_quotes(<pageInput.recordId>)`; a missing or invalid record ID prevents creation, and no roll-up or alternate target is used.
- Source: User Requirements
- Requirement quote: Use a recordId input parameter for the Quote ID to create line items (voy_quoteid attribute logical name).

##### F1
- Kind: filter
- Definition: Client-side type tabs retain only normalized connector records whose declared type is Flight, Stay, or Excursion; All retains every retrieved record. The initial type is All per A1.
- Source: A1

##### F2
- Kind: filter
- Definition: Each connector operation receives `pageInput.data.destination` as its required `destination` string, so only products returned for that supplied destination are displayed.
- Source: User Requirements
- Requirement quote: Use a destination input parameter to call the Get Products By Destination connector which expects a destination string.

#### Lookup metadata

| Table | Column | Read property | Targets | Used by | Metadata state |
|-------|--------|---------------|---------|---------|----------------|
| voy_quotelineitem | voy_quoteid | _voy_quoteid_value | voy_quote | R1; create Quote Line Item bound to the current Quote | observed |

| Table | Column | Target | Navigation property | Referenced key |
|-------|--------|--------|---------------------|----------------|
| voy_quotelineitem | voy_quoteid | voy_quote | voy_QuoteId | voy_quoteid |

- Evidence: successful source/target metadata discovery: `voy_quotelineitem.voy_quoteid` targets `voy_quote`, its concrete binding navigation property is `voy_QuoteId`, and the line-item entity set is `voy_quotelineitems`.
- Read target strategy: This lookup is write-only in this page. Bind the verified `voy_QuoteId` navigation property directly to the validated input Quote ID; do not infer alternate targets or navigation paths.
