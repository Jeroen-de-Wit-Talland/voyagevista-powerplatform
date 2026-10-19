import * as React from 'react';
import { Spinner, Text } from '@fluentui/react-components';
import * as L from 'leaflet';

export interface IOSMMapProps {
  address?: string;
  height: number;
}

interface ILocation {
  lat: number;
  lon: number;
}

const GEOCODE_DELAY_MS = 1000;
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

async function geocode(address: string, signal: AbortSignal): Promise<ILocation | undefined> {
  const params = new URLSearchParams({ format: 'jsonv2', limit: '1', q: address });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, { signal });
  if (!response.ok) {
    throw new Error(`Nominatim request failed (${response.status})`);
  }
  const results = (await response.json()) as { lat: string; lon: string }[];
  return results.length > 0 ? { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) } : undefined;
}

export const OSMMap: React.FC<IOSMMapProps> = ({ address, height }) => {
  const [location, setLocation] = React.useState<ILocation | undefined>();
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | undefined>();

  React.useEffect(() => {
    const query = address?.trim();
    if (!query) {
      setLocation(undefined);
      setMessage('No address to display.');
      return;
    }
    const controller = new AbortController();
    // Debounce so edits on the form don't exceed Nominatim's 1 request/second limit.
    const lookup = async (): Promise<void> => {
      setLoading(true);
      setMessage(undefined);
      try {
        const loc = await geocode(query, controller.signal);
        setLocation(loc);
        setMessage(loc ? undefined : 'Address not found.');
      } catch {
        if (!controller.signal.aborted) {
          setLocation(undefined);
          setMessage('Map lookup failed.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    const timer = setTimeout(() => void lookup(), GEOCODE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [address]);

  const box = { width: '100%', height };

  const containerRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<L.Map | undefined>();
  const markerRef = React.useRef<L.CircleMarker | undefined>();

  React.useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const map = L.map(containerRef.current).setView([0, 0], 2);
    L.tileLayer(TILE_URL, { maxZoom: 12, attribution: TILE_ATTRIBUTION }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = undefined;
      markerRef.current = undefined;
    };
  }, []);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }
    markerRef.current?.remove();
    markerRef.current = undefined;
    if (location) {
      const latLng: L.LatLngExpression = [location.lat, location.lon];
      // Circle marker avoids Leaflet's default marker images, which the PCF bundle doesn't ship.
      markerRef.current = L.circleMarker(latLng, { radius: 9, color: '#c50f1f', fillOpacity: 0.7 }).addTo(map);
      map.setView(latLng, 12);
    }
  }, [location]);

  React.useEffect(() => {
    mapRef.current?.invalidateSize();
  }, [height]);

  return (
    <div style={{ ...box, position: 'relative' }}>
      <div ref={containerRef} style={box} />
      {(loading || message) && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.6)',
            pointerEvents: 'none',
          }}
        >
          {loading ? <Spinner size="small" /> : <Text>{message}</Text>}
        </div>
      )}
    </div>
  );
};
