import * as React from "react";
import {
  Badge, Button, Card, CardHeader, Checkbox, Image, MessageBar, MessageBarBody,
  Spinner, Tab, TabList, Text, makeStyles, tokens,
} from "@fluentui/react-components";
import { AddRegular, AirplaneRegular, BuildingRegular, CalendarRegular } from "@fluentui/react-icons";
import type { GeneratedComponentProps } from "./RuntimeTypes";

type ProductType = "Flight" | "Stay" | "Excursion";
type ConnectorResult = { ok: boolean; body: unknown };
type ActionResult = { ok: boolean; indeterminate?: boolean; error?: { code?: string; message?: string } };
type ProductApi = {
  executeConnectorOperation?: (connector: string, operation: string, parameters: Record<string, unknown>) => Promise<ConnectorResult>;
  executeAction?: (request: { name: string; boundTo: { entityName: string; id: string } }) => Promise<ActionResult>;
};
type QuoteLineItemWrite = {
  "voy_QuoteId@odata.bind": string;
  voy_name: string;
  voy_description: string;
  voy_amount: number;
  voy_priceperunit: number;
};
type QuoteLineItemApi = {
  createRow: (tableName: "voy_quotelineitem", row: QuoteLineItemWrite) => Promise<string>;
};
type Product = { id: string; name: string; destination: string; currency: string; price: number; type: ProductType; detail: string; rating?: number; thumbnailURL?: string };
type PageState = { products: Product[]; loading: boolean; error: string; status: string };

const CONNECTOR = "voy_quotecreator_LPj7XG.cr.shared_voy-5fget-20p.cf104bbd-f4d0-4530-bb27-d212f32d11d9";
const cacheKey = "__ppQuoteCreatorProducts";
const inflightKey = "__ppQuoteCreatorProductsInflight";
const winAny = window as unknown as Record<string, unknown>;

const useStyles = makeStyles({
  root: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalL, padding: tokens.spacingHorizontalL, boxSizing: "border-box", width: "100%", height: "100%", minHeight: "0" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.spacingHorizontalM, flexWrap: "wrap" },
  results: { maxHeight: "42rem", overflowY: "auto", paddingRight: tokens.spacingHorizontalS },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(17rem, 1fr))", gap: tokens.spacingHorizontalM, "@media (max-width: 480px)": { gridTemplateColumns: "1fr" } },
  card: { display: "flex", flexDirection: "column", gap: tokens.spacingVerticalS, padding: tokens.spacingHorizontalM },
  image: { width: "100%", height: "10rem", objectFit: "cover", borderRadius: tokens.borderRadiusMedium },
  actions: { display: "flex", alignItems: "center", gap: tokens.spacingHorizontalM, flexWrap: "wrap" },
  rating: { color: tokens.colorPaletteMarigoldForeground2, letterSpacing: "0.1em" },
});

function RatingStars({ rating }: { rating: number }) {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));
  return <span className={useStyles().rating} role="img" aria-label={`${roundedRating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => <span aria-hidden="true" key={index}>{index < roundedRating ? "★" : "☆"}</span>)}
  </span>;
}

function asProducts(body: unknown, type: ProductType): Product[] {
  const rows = Array.isArray(body) ? body : Array.isArray((body as { value?: unknown[] })?.value) ? (body as { value: unknown[] }).value : [];
  return rows.map((row, index) => {
    const r = row as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name : `${type} ${index + 1}`;
    const id = typeof r.id === "string" ? r.id : `${type}-${index}-${name}`;
    const price = typeof r.price === "number" ? r.price : 0;
    const rawRating = typeof r.rating === "number" ? r.rating : typeof r.rating === "string" ? Number(r.rating) : undefined;
    const rating = typeof rawRating === "number" && Number.isFinite(rawRating) ? rawRating : undefined;
    const detail = type === "Flight" ? `${String(r.airline ?? "")} ${String(r.departureAirportCode ?? "")} - ${String(r.arrivalAirportCode ?? "")}` : type === "Stay" ? `${String(r.numberOfNights ?? "")} nights` : `${String(r.category ?? "")} ${String(r.durationInHours ?? "")} hours`;
    return { id, name, price, type, detail, rating, destination: typeof r.destination === "string" ? r.destination : "", currency: typeof r.currency === "string" ? r.currency : "USD", thumbnailURL: typeof r.thumbnailURL === "string" ? r.thumbnailURL : undefined };
  });
}

function PageBody(props: GeneratedComponentProps) {
  const styles = useStyles();
  const { dataApi, pageInput } = props;
  const recordId = pageInput?.recordId ?? "";
  const pageData = pageInput?.data as { destination?: unknown } | undefined;
  const destination = typeof pageData?.destination === "string" ? pageData.destination : "";
  const api = dataApi as unknown as ProductApi;
  const [filter, setFilter] = React.useState<"All" | ProductType>("All");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [{ products, loading, error, status }, setState] = React.useState<PageState>({ products: [], loading: !!destination, error: "", status: "" });

  React.useEffect(() => {
    if (!destination || typeof api.executeConnectorOperation !== "function") { setState({ products: [], loading: false, error: destination ? "Product retrieval is unavailable on this runtime." : "A destination is required.", status: "" }); return; }
    const key = `${cacheKey}:${destination}`;
    const cached = winAny[key] as Product[] | undefined;
    if (cached) { setState({ products: cached, loading: false, error: "", status: "" }); return; }
    let active = true;
    let pending = winAny[inflightKey] as Promise<Product[]> | undefined;
    if (!pending) {
      const request = Promise.all([
        api.executeConnectorOperation(CONNECTOR, "GetFlightsForDestination", { destination }),
        api.executeConnectorOperation(CONNECTOR, "GetStaysForDestination", { destination }),
        api.executeConnectorOperation(CONNECTOR, "GetExcursionsForDestination", { destination }),
      ]).then(([flights, stays, excursions]) => {
        if (!flights.ok || !stays.ok || !excursions.ok) throw new Error("Unable to retrieve products.");
        const all = asProducts(flights.body, "Flight").concat(asProducts(stays.body, "Stay"), asProducts(excursions.body, "Excursion"));
        winAny[key] = all; return all;
      }).finally(() => { if (winAny[inflightKey] === request) delete winAny[inflightKey]; });
      pending = request;
      winAny[inflightKey] = request;
    }
    const productRequest = pending;
    productRequest.then((items) => { if (active) setState({ products: items, loading: false, error: "", status: "" }); }).catch(() => { if (active) setState({ products: [], loading: false, error: "Unable to retrieve products. Try reopening the page.", status: "" }); });
    return () => { active = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, !!dataApi]);

  const visible = filter === "All" ? products : products.filter((p) => p.type === filter);
  function toggle(id: string) { setSelected((current) => current.indexOf(id) >= 0 ? current.filter((value) => value !== id) : current.concat(id)); }
  async function createLines() {
    if (!recordId) { setState((current) => ({ ...current, error: "Open this page from a Quote record to create line items." })); return; }
    if (!selected.length || submitting) return;
    if (typeof dataApi.createRow !== "function" || typeof api.executeAction !== "function") {
      setState((current) => ({ ...current, error: "Quote Line Item creation is unavailable on this runtime." }));
      return;
    }
    setSubmitting(true); setState((current) => ({ ...current, error: "", status: "" }));
    try {
      const chosen = products.filter((product) => selected.indexOf(product.id) >= 0);
      const lineItemApi = dataApi as unknown as QuoteLineItemApi;
      await Promise.all(chosen.map((product) => lineItemApi.createRow("voy_quotelineitem", {
        "voy_QuoteId@odata.bind": `/voy_quotes(${recordId})`,
        voy_name: product.name,
        voy_description: `${product.type}: ${product.detail}`,
        voy_amount: 1,
        voy_priceperunit: product.price,
      })));
      const calculated = await api.executeAction({ name: "voy_CalculateQuote", boundTo: { entityName: "voy_quote", id: recordId } });
      if (!calculated.ok || calculated.indeterminate) throw new Error("Line items were created, but quote recalculation could not be confirmed.");
      setSelected([]); setState((current) => ({ ...current, status: `${chosen.length} Quote Line Item${chosen.length === 1 ? "" : "s"} created and the quote recalculated.` }));
    } catch { setState((current) => ({ ...current, error: "Unable to create Quote Line Items. Refresh the Quote before retrying." })); } finally { setSubmitting(false); }
  }
  return <main className={styles.root} aria-label="Quote Creator">
    <header className={styles.header}><div><Text as="h1" size={700} weight="semibold">Quote Creator</Text><Text block>Products for {destination || "the selected destination"}</Text></div><div className={styles.actions}><Badge>{selected.length} selected</Badge><Button appearance="primary" icon={<AddRegular />} disabled={!recordId || !selected.length || submitting} onClick={() => void createLines()}>{submitting ? "Creating…" : "Create Quote Line Items"}</Button></div></header>
    {!recordId && <MessageBar intent="warning"><MessageBarBody>Open this page from a Quote record to create line items.</MessageBarBody></MessageBar>}
    {error && <MessageBar intent="error"><MessageBarBody>{error}</MessageBarBody></MessageBar>}
    {status && <MessageBar intent="success"><MessageBarBody>{status}</MessageBarBody></MessageBar>}
    <TabList selectedValue={filter} onTabSelect={(_event, data) => setFilter(data.value as "All" | ProductType)} aria-label="Product type"><Tab value="All">All</Tab><Tab value="Flight">Flights</Tab><Tab value="Stay">Stays</Tab><Tab value="Excursion">Excursions</Tab></TabList>
    {loading ? <Spinner label="Loading destination products" /> : <div className={styles.results}><section className={styles.grid} aria-live="polite">{visible.map((product) => <Card key={product.id} className={styles.card}><CardHeader image={product.type === "Flight" ? <AirplaneRegular /> : product.type === "Stay" ? <BuildingRegular /> : <CalendarRegular />} header={<Text weight="semibold">{product.name}</Text>} description={<Text>{product.type}</Text>} />{product.thumbnailURL && <Image className={styles.image} src={product.thumbnailURL} alt="" />}{product.type === "Stay" && typeof product.rating === "number" && <RatingStars rating={product.rating} />}<Text>{product.detail}</Text><Text weight="semibold">{new Intl.NumberFormat(undefined, { style: "currency", currency: product.currency || "USD" }).format(product.price)}</Text><Checkbox checked={selected.indexOf(product.id) >= 0} onChange={() => toggle(product.id)} label={`Select ${product.name}`} /></Card>)}</section></div>}
  </main>;
}
export default function QuoteCreator(props: GeneratedComponentProps) { return <PageBody {...props} />; }
