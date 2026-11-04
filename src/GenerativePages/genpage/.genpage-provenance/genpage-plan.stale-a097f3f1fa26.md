# Genpage Plan

## User Requirements
Create the page Quote Creator, it's used to display and select Flights, Stays and Excursions using a custom connector ("Get Products By Destination"). Users should be able to filter by type and display only the relevant records retrieved from the connector. The records should be displayed in a modern card gallery. The user has to select one or more records with the ability to create Quote Line Items in Dataverse for the connected Quote. Use a recordId input parameter for the Quote ID to create line items (voy_quoteid attribute logical name). Use a destination input parameter to call the Get Products By Destination connector which expects a destination string. The Quote Line Items should be created in a single batch requests to prevent multiple calls to the Dataverse API. After the Quote Line Items have been created call the CalculateQuote Custom Action to recalculate the Quote. Use the recordId parameter and the voy_quote entity logical name to provide the Target for the custom action. Add all created components to the existing Voyage Vista Sales solution in the current authenticated environment.

## Assumptions

### A1 — Default product type view
- Decision: Initially show all connector products; the user can filter the locally loaded cards to Flights, Stays, or Excursions.
- Alternatives considered: Initially show Flights, Stays, or Excursions only.
- Evidence: default: the requirements require type filtering but do not state an initial type.
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
|---|---|---|---|
| Quote Creator | quote-creator.tsx | Browse connector products by destination, select products, and batch-create Quote Line Items for the current Quote. | voy_quote, voy_quotelineitem |

## Entity Creation Required
No entity creation required — all entities already exist.

## Existing Entities
voy_quote, voy_quotelineitem

## Connector Bindings
Connector bindings written for create mode.

| Logical Name | Connector Id | Dataset | Tables (GUIDs) | Table Display Names | Operations | Fields | Parameters | Response |
|--------------|--------------|---------|----------------|---------------------|------------|--------|------------|----------|
| voy_quotecreator_LPj7XG.cr.shared_voy-5fget-20p.cf104bbd-f4d0-4530-bb27-d212f32d11d9 | /providers/Microsoft.PowerApps/apis/shared_voy-5fget-20products-20by-20destination-5f6ef52b94ce739058 |  |  |  | GetFlightsForDestination; GetStaysForDestination; GetExcursionsForDestination | GetFlightsForDestination: flightNumber (string), airline (string), departureAirportCode (string), arrivalAirportCode (string), departureTime (datetime), arrivalTime (datetime), terminal (string), gate (string), availableSeats (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). GetStaysForDestination: rating (number), numberOfNights (integer), type (string), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). GetExcursionsForDestination: category (string), durationInHours (integer), id (uuid), name (string), destination (string), currency (string), thumbnailURL (string), price (number). | Each operation: destination (string, required). | Each operation returns an array of its listed fields. |

## Custom API Bindings
| Name | Kind | Bound Entity | Display Name | Parameters (name: kind) |
|------|------|--------------|--------------|-------------------------|
| voy_CalculateQuote | Action | voy_quote | Calculate Quote | (none) |

Invoke it after the successful line-item batch with `dataApi.executeAction` and `boundTo: { entityName: 'voy_quote', id: recordId }`. Discovery confirms `recordId` is the entity-bound target ID, not an Action parameter.

## Solution Packaging
- Package into solution: true
- Solution unique name: VoyageVistaSales
- Connection references: voy_quotecreator_LPj7XG.cr.shared_voy-5fget-20p.cf104bbd-f4d0-4530-bb27-d212f32d11d9

## Design Preferences
- Styling: Fluent UI V9 defaults.
- Features: Call all three destination-scoped connector operations; type filter; responsive modern card gallery; multi-select; one batch create of Quote Line Items; recalculate the Quote after a successful batch.
- Accessibility: WCAG AA defaults; keyboard-accessible type controls and card selection, visible focus states, labelled controls, descriptive card imagery, and an announced selection count and error/success status.

## Relevant Samples
| Page | Sample | Reason |
|---|---|---|
| Quote Creator | 7-responsive-cards.tsx | Responsive Fluent UI card gallery layout and accessible card interactions. |
| Quote Creator | 13-custom-api-invocation.tsx | Presence-checked, guarded entity-bound Custom Action invocation and error handling. |

## Per-Page Specifications

### Quote Creator
- **File:** quote-creator.tsx
- **Purpose:** Retrieve Flights, Stays, and Excursions for the provided destination, let users select products, then create matching Quote Line Items in one batch and recalculate the connected Quote.
- **Entities:** voy_quote, voy_quotelineitem
- **Needs caching:** true
- **Key Features:** Read `pageInput.recordId` as the Quote ID and `pageInput.data.destination` as the required connector destination; invoke the three discovered connector operations; normalize their optional response fields into a single typed product-card model with an explicit type; show an All/Flights/Stays/Excursions filter; preserve multi-selection while filtering; disable creation until at least one product is selected and a valid Quote ID is present; submit all selected line-item creates in a single batch; then invoke `voy_CalculateQuote`; show loading, empty, success, and retryable error states.
- **Components:** Fluent UI V9 `Card`, `CardHeader`, `Checkbox`, `Button`, `TabList`/`Tab`, `Badge`, `Image`, `Spinner`, `MessageBar`, `MessageBarActions`, `Text`, and responsive layout primitives.
- **Layout:** A responsive header with destination and selected-count summary, type tabs, and a responsive card grid that collapses from multiple columns to one column on narrow viewports. Each card presents an optional thumbnail, name, type, destination, currency-formatted price, and type-specific metadata.
- **Data Binding:** On valid destination input, execute `GetFlightsForDestination`, `GetStaysForDestination`, and `GetExcursionsForDestination` through connector logical name `voy_quotecreator_LPj7XG.cr.shared_voy-5fget-20p.cf104bbd-f4d0-4530-bb27-d212f32d11d9`, each with `{ destination }`. Cache and de-duplicate the in-flight destination request across host double-mounts. Build one Dataverse batch of `POST /voy_quotelineitems` requests for selected products, using the mapping in A2.
- **Interactions:** Type filtering follows F1. Card checkboxes toggle selected product IDs without opening records. The Create Quote Line Items button performs the atomic batch and, only on success, calls `dataApi.executeAction('voy_CalculateQuote', { boundTo: { entityName: 'voy_quote', id: recordId } })`; it is guarded against double submission and reports indeterminate outcomes without automatic retry.

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
|---|---|---|---|---|---|
| voy_quotelineitem | voy_quoteid | _voy_quoteid_value | voy_quote | R1; create Quote Line Item bound to the current Quote | observed |

| Table | Column | Target | Navigation property | Referenced key |
|---|---|---|---|---|
| voy_quotelineitem | voy_quoteid | voy_quote | voy_QuoteId | voy_quoteid |

- Evidence: successful source/target metadata discovery: `voy_quotelineitem.voy_quoteid` targets `voy_quote`, its concrete binding navigation property is `voy_QuoteId`, and the line-item entity set is `voy_quotelineitems`.
- Read target strategy: This lookup is write-only in this page. Bind the verified `voy_QuoteId` navigation property directly to the validated input Quote ID; do not infer alternate targets or navigation paths.
