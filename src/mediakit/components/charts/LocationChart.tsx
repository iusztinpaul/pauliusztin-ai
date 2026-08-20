import { useRef, useState } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { Minus, Move, Plus } from 'lucide-react';
import type { AudienceLocation, LocationItem } from '../../data/types';
import { BRAND, valueShade } from '../../lib/colors';
import BarList from './BarList';
import WORLD_TOPOJSON from 'world-atlas/countries-110m.json?url';

// Start a touch wider than before so the now-lit southern hemisphere
// (Brazil, South Africa, SE Asia, Australia) is visible on load too.
const INITIAL_CENTER: [number, number] = [10, 10];
const INITIAL_ZOOM = 1.4;

/** Compact subscriber count for the hover tooltip: 9,906 → "10k", 732 → "732". */
function formatCount(n: number): string {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : n.toLocaleString('en-US');
}

interface LocationChartProps {
  data: AudienceLocation;
}

interface HoverTip {
  name: string;
  count: number;
  /** Cursor position relative to the map wrapper, in px. */
  x: number;
  y: number;
}

export default function LocationChart({ data }: LocationChartProps) {
  const { items, countries } = data;
  const maxVal = Math.max(...items.map((i) => i.count ?? i.pct), 1);
  const byName = new Map(items.map((i) => [i.atlasName, i]));
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<HoverTip | null>(null);
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
  });

  const setZoom = (z: number) =>
    setPosition((p) => ({ ...p, zoom: Math.min(8, Math.max(1, z)) }));

  const showTip = (item: LocationItem | undefined, e: React.MouseEvent) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!item || !rect) {
      setTip(null);
      return;
    }
    setTip({
      name: item.country,
      count: item.count ?? 0,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
      {/* World choropleth — draggable & zoomable */}
      <div ref={wrapRef} className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-brand-black1/30 bg-brand-black3/60">
          <ComposableMap
            projection="geoEqualEarth"
            projectionConfig={{ scale: 150 }}
            width={800}
            height={420}
            style={{ width: '100%', height: 'auto' }}
          >
            <ZoomableGroup
              center={position.coordinates}
              zoom={position.zoom}
              minZoom={1}
              maxZoom={8}
              onMoveEnd={(pos) => setPosition(pos)}
            >
              <Geographies geography={WORLD_TOPOJSON}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const name = geo.properties?.name as string | undefined;
                    const item = name ? byName.get(name) : undefined;
                    const v = item ? item.count ?? item.pct : undefined;
                    const fill = v != null ? valueShade(v, maxVal) : BRAND.black2;
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={fill}
                        stroke={BRAND.black3}
                        strokeWidth={0.4}
                        onMouseEnter={(e) => showTip(item, e)}
                        onMouseMove={(e) => showTip(item, e)}
                        onMouseLeave={() => setTip(null)}
                        style={{
                          default: { outline: 'none' },
                          hover: { outline: 'none', fill: v != null ? BRAND.redCoral : BRAND.black1 },
                          pressed: { outline: 'none' },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>

          {/* Zoom controls */}
          <div className="absolute right-3 top-3 flex flex-col gap-1.5">
            <button
              onClick={() => setZoom(position.zoom * 1.5)}
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-black1/50 bg-brand-black3/80 text-brand-grey backdrop-blur transition-colors hover:text-brand-orange"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => setZoom(position.zoom / 1.5)}
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-black1/50 bg-brand-black3/80 text-brand-grey backdrop-blur transition-colors hover:text-brand-orange"
            >
              <Minus size={15} />
            </button>
          </div>

          <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] text-brand-black1">
            <Move size={12} /> drag or scroll to explore
          </div>
        </div>

        {/* Hover tooltip — country/area name + subscriber count */}
        {tip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-brand-black1/50 bg-brand-black3/95 px-2.5 py-1.5 text-xs text-brand-white shadow-lg backdrop-blur"
            style={{ left: tip.x, top: tip.y - 10 }}
          >
            <span className="font-semibold">{tip.name}</span>
            <span className="text-brand-grey">
              : {formatCount(tip.count)} {tip.count === 1 ? 'subscriber' : 'subscribers'}
            </span>
          </div>
        )}
      </div>

      {/* Country ranking */}
      <div>
        <div className="mb-5">
          <p className="text-base font-bold text-brand-white">Audience Location</p>
          <p className="text-xs text-brand-grey">
            Global audience across {countries} countries
          </p>
        </div>
        {/* Round to the nearest whole percent (.5 rounds up): 26.4→26, 23.9→24. */}
        <BarList items={items.slice(0, 5).map((i) => ({ label: i.country, pct: Math.round(i.pct) }))} />
      </div>
    </div>
  );
}
