'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RegionTelemetry } from '@/lib/types';
import {
  MapPin,
  Flame,
  Wind,
  Layers,
  ArrowUp,
  ArrowDown,
  Minus,
  Info,
  Crosshair,
  Maximize2,
  Globe2,
  Compass,
  Radio
} from 'lucide-react';

interface DelhiNCRMapProps {
  regions: RegionTelemetry[];
  selectedDistrict: string;
  onSelectDistrict: (districtKey: string) => void;
}

type MapLayer = 'aqi' | 'stations' | 'fires' | 'plume';
type BasemapStyle = 'dark' | 'satellite';

// Extended station coordinates & monitoring nodes in Delhi NCR
const caaqmsStations = [
  { id: 'st-1', name: 'Anand Vihar, Delhi', districtKey: 'delhi', lat: 28.6476, lng: 77.3158, aqi: 342, pm25: 184 },
  { id: 'st-2', name: 'RK Puram, Delhi', districtKey: 'delhi', lat: 28.5638, lng: 77.1867, aqi: 278, pm25: 132 },
  { id: 'st-3', name: 'Connaught Place, Delhi', districtKey: 'delhi', lat: 28.6315, lng: 77.2167, aqi: 265, pm25: 120 },
  { id: 'st-4', name: 'Sector 62, Noida', districtKey: 'noida', lat: 28.6258, lng: 77.3648, aqi: 312, pm25: 156 },
  { id: 'st-5', name: 'Sector 125, Noida', districtKey: 'noida', lat: 28.5447, lng: 77.3332, aqi: 295, pm25: 144 },
  { id: 'st-6', name: 'Vikas Sadan, Gurugram', districtKey: 'gurugram', lat: 28.4552, lng: 77.0315, aqi: 265, pm25: 124 },
  { id: 'st-7', name: 'Cyber City, Gurugram', districtKey: 'gurugram', lat: 28.4950, lng: 77.0890, aqi: 272, pm25: 129 },
  { id: 'st-8', name: 'Vasundhara, Ghaziabad', districtKey: 'ghaziabad', lat: 28.6603, lng: 77.3573, aqi: 338, pm25: 174 },
  { id: 'st-9', name: 'Loni Industrial, Ghaziabad', districtKey: 'ghaziabad', lat: 28.7511, lng: 77.2882, aqi: 356, pm25: 191 },
  { id: 'st-10', name: 'New Industrial Town, Faridabad', districtKey: 'faridabad', lat: 28.3965, lng: 77.3060, aqi: 294, pm25: 142 },
  { id: 'st-11', name: 'Knowledge Park III, Greater Noida', districtKey: 'greater_noida', lat: 28.4720, lng: 77.4890, aqi: 308, pm25: 150 }
];

// NASA FIRMS agricultural fire detection coordinates (North-West upwind corridor)
const satelliteFires = [
  { id: 'f-1', lat: 29.85, lng: 76.35, state: 'Haryana', intensity: 'High', tempK: 345 },
  { id: 'f-2', lat: 30.12, lng: 75.95, state: 'Punjab', intensity: 'Extreme', tempK: 368 },
  { id: 'f-3', lat: 29.55, lng: 76.65, state: 'Haryana', intensity: 'Moderate', tempK: 328 },
  { id: 'f-4', lat: 30.35, lng: 75.60, state: 'Punjab', intensity: 'High', tempK: 352 },
  { id: 'f-5', lat: 29.25, lng: 76.85, state: 'Sonipat Belt', intensity: 'Moderate', tempK: 330 },
  { id: 'f-6', lat: 30.50, lng: 75.20, state: 'Punjab Central', intensity: 'Extreme', tempK: 374 }
];

export default function DelhiNCRMap({
  regions,
  selectedDistrict,
  onSelectDistrict
}: DelhiNCRMapProps) {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('aqi');
  const [basemap, setBasemap] = useState<BasemapStyle>('dark');
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const selectedData = regions.find((r) => r.districtKey === selectedDistrict) || regions[0];

  const getAqiColor = (aqi: number) => {
    if (aqi <= 100) return '#10b981'; // emerald
    if (aqi <= 200) return '#f59e0b'; // amber
    if (aqi <= 300) return '#ea580c'; // amber-rose
    if (aqi <= 400) return '#e11d48'; // rose
    return '#9f1239'; // severe crimson
  };

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    // Dynamically load Leaflet on client side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      });

      // Initialize map centered at Delhi NCR
      const map = L.map(mapContainerRef.current, {
        center: [28.58, 77.25],
        zoom: 10,
        minZoom: 8,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: true
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Add Basemap Tile Layer
      const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_33ti_1_7848d2f224d11a28833578f6';
      const darkTileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;
      const darkTiles = L.tileLayer(
        darkTileUrl,
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
        }
      ).addTo(map);

      tileLayerRef.current = darkTiles;

      // Layer group for all dynamic overlays
      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;

      mapInstanceRef.current = map;

      // Initial render of overlays
      renderMapOverlays(L, map, layerGroup, activeLayer, regions, selectedDistrict);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Basemap (Dark Matter vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }

      const cartoKey = process.env.NEXT_PUBLIC_CARTO_API_KEY || 'cb1_33ti_1_7848d2f224d11a28833578f6';
      let newTileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${cartoKey}`;
      let attribution = '&copy; CARTO &copy; OpenStreetMap';
      let subdomains = 'abcd';

      if (basemap === 'satellite') {
        newTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS';
        subdomains = '';
      }

      const newTiles = L.tileLayer(newTileUrl, {
        attribution,
        subdomains,
        maxZoom: 18
      }).addTo(map);

      // Ensure tiles stay behind markers
      newTiles.bringToBack();
      tileLayerRef.current = newTiles;
    });
  }, [basemap]);

  // Update Overlays whenever activeLayer or selectedDistrict changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    import('leaflet').then((L) => {
      const map = mapInstanceRef.current;
      const layerGroup = layerGroupRef.current;
      if (!map || !layerGroup) return;

      renderMapOverlays(L, map, layerGroup, activeLayer, regions, selectedDistrict);
    });
  }, [activeLayer, selectedDistrict, regions]);

  // Function to draw overlays on Leaflet
  const renderMapOverlays = (
    L: any,
    map: any,
    layerGroup: any,
    layer: MapLayer,
    districts: RegionTelemetry[],
    activeDistKey: string
  ) => {
    layerGroup.clearLayers();

    // 1. Regional District Nodes
    districts.forEach((d) => {
      const isSelected = d.districtKey === activeDistKey;
      const color = getAqiColor(d.aqi);

      // A. Heatmap Diffusion Circle (when in 'aqi' layer)
      if (layer === 'aqi') {
        const circle = L.circle([d.lat, d.lng], {
          radius: isSelected ? 8500 : 6500,
          color: color,
          fillColor: color,
          fillOpacity: isSelected ? 0.28 : 0.16,
          weight: isSelected ? 2 : 1,
          dashArray: isSelected ? '4,4' : undefined
        });
        circle.addTo(layerGroup);
      }

      // B. Custom SVG DivIcon Marker for District
      const iconHtml = `
        <div class="relative flex flex-col items-center cursor-pointer group" style="transform: translate(-50%, -50%);">
          ${
            isSelected
              ? `<div class="absolute -inset-2.5 rounded-full border-2 border-cyan-400 border-dashed animate-spin" style="animation-duration: 9s;"></div>`
              : ''
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-all"
               style="background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 0 16px ${color}80;">
            <span style="font-family: monospace; font-size: 10px; font-weight: 800; color: #ffffff;">${d.aqi}</span>
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-md bg-[#080b11]/90 border border-white/20 text-white font-mono text-[10px] font-bold shadow-lg whitespace-nowrap">
            ${d.name}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-district-marker',
        iconSize: [0, 0]
      });

      const marker = L.marker([d.lat, d.lng], { icon: customIcon });

      // Popup content
      const popupHtml = `
        <div style="padding: 4px 6px; min-width: 170px;">
          <div style="font-size: 10px; text-transform: uppercase; color: #38bdf8; font-family: monospace; font-weight: bold;">
            ${d.hindiName} • Telemetry Hub
          </div>
          <div style="font-size: 16px; font-weight: 800; color: #ffffff; margin-top: 2px;">
            ${d.name}
          </div>
          <div style="margin-top: 8px; display: flex; align-items: baseline; gap: 6px;">
            <span style="font-size: 26px; font-weight: 900; font-family: monospace; color: ${color};">${d.aqi}</span>
            <span style="font-size: 11px; color: #94a3b8;">AQI (${d.aqiStatus})</span>
          </div>
          <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">
            PM2.5: <strong>${d.pm25} µg/m³</strong>
          </div>
          <div style="margin-top: 6px; font-size: 10px; font-family: monospace; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px;">
            Tomorrow: <strong style="color: #f43f5e;">${d.tomorrowAqi} ↑</strong>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false, offset: [0, -18] });

      marker.on('click', () => {
        onSelectDistrict(d.districtKey);
        map.flyTo([d.lat, d.lng], 11, { duration: 1 });
      });

      marker.addTo(layerGroup);
    });

    // 2. Pollution Stations Layer
    if (layer === 'stations') {
      caaqmsStations.forEach((st) => {
        const stColor = getAqiColor(st.aqi);
        const stationIconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer" style="transform: translate(-50%, -50%);">
            <div class="w-3.5 h-3.5 rounded-full" style="background: ${stColor}; border: 2px solid #ffffff; box-shadow: 0 0 10px ${stColor};"></div>
            <div class="absolute -inset-1 rounded-full border border-white/40 animate-ping opacity-70"></div>
          </div>
        `;

        const stIcon = L.divIcon({
          html: stationIconHtml,
          className: 'caaqms-station-marker',
          iconSize: [0, 0]
        });

        const stMarker = L.marker([st.lat, st.lng], { icon: stIcon });
        stMarker.bindPopup(`
          <div style="padding: 4px 6px; font-family: sans-serif;">
            <div style="font-size: 9px; font-family: monospace; color: #38bdf8; font-weight: bold;">CPCB CAAQMS STATION</div>
            <div style="font-weight: 700; color: #ffffff; font-size: 13px;">${st.name}</div>
            <div style="margin-top: 6px; font-size: 12px; color: #cbd5e1;">
              Live AQI: <strong style="color: ${stColor}; font-family: monospace;">${st.aqi}</strong>
            </div>
            <div style="font-size: 11px; color: #94a3b8;">PM2.5: ${st.pm25} µg/m³</div>
          </div>
        `, { closeButton: false, offset: [0, -10] });

        stMarker.addTo(layerGroup);
      });
    }

    // 3. Satellite Fire Anomalies (NASA FIRMS)
    if (layer === 'fires') {
      satelliteFires.forEach((f) => {
        const fireHtml = `
          <div class="relative flex flex-col items-center" style="transform: translate(-50%, -50%);">
            <div class="w-5 h-5 rounded-full bg-orange-600/30 flex items-center justify-center animate-pulse">
              <div class="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-lg shadow-orange-500"></div>
            </div>
            <span class="text-[9px] font-mono font-bold text-orange-300 bg-black/80 px-1 rounded mt-0.5 whitespace-nowrap border border-orange-500/30">
              🔥 ${f.state}
            </span>
          </div>
        `;

        const fireIcon = L.divIcon({
          html: fireHtml,
          className: 'firms-fire-marker',
          iconSize: [0, 0]
        });

        const fMarker = L.marker([f.lat, f.lng], { icon: fireIcon });
        fMarker.bindPopup(`
          <div style="padding: 4px 6px;">
            <div style="font-size: 9px; font-family: monospace; color: #f97316; font-weight: bold;">NASA FIRMS VIIRS ANOMALY</div>
            <div style="font-weight: 700; color: #ffffff; font-size: 13px;">${f.state} Agricultural Fire</div>
            <div style="font-size: 11px; color: #cbd5e1; margin-top: 4px;">Thermal Energy: <strong>${f.intensity}</strong> (${f.tempK} K)</div>
            <div style="font-size: 10px; color: #94a3b8; font-family: monospace; margin-top: 4px;">Trajectory: Drifting SE toward Delhi NCR</div>
          </div>
        `, { closeButton: false, offset: [0, -12] });

        fMarker.addTo(layerGroup);
      });
    }

    // 4. Plume Transport Corridors
    if (layer === 'plume' || layer === 'fires') {
      // Draw NW transport streamline vectors
      const plumeVectors = [
        [
          [30.2, 75.8],
          [29.7, 76.5],
          [28.9, 77.0],
          [28.65, 77.25]
        ],
        [
          [30.4, 75.4],
          [29.8, 76.2],
          [29.1, 76.8],
          [28.55, 77.35]
        ],
        [
          [29.9, 76.1],
          [29.4, 76.7],
          [28.75, 77.15],
          [28.45, 77.05]
        ]
      ];

      plumeVectors.forEach((coords, idx) => {
        const polyline = L.polyline(coords, {
          color: '#ea580c',
          weight: 4 - idx * 0.5,
          opacity: 0.75 - idx * 0.15,
          dashArray: '8, 8',
          lineCap: 'round'
        });
        polyline.addTo(layerGroup);
      });
    }
  };

  // Reset to full NCR overview
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([28.58, 77.25], 10, { duration: 1.2 });
    }
  };

  return (
    <section id="map" className="scroll-mt-24 mb-16">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-cyan-400 font-semibold mb-1">
            Section 03 / GEOGRAPHIC TELEMETRY
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Delhi NCR Regional Intelligence Map
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            Real interactive GIS map. Pan, zoom, switch satellite layers, and inspect real CAAQMS sensor nodes.
          </p>
        </div>

        {/* Controls: Basemap style + Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Basemap Toggle (Dark Matter vs Satellite) */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs font-medium">
            <button
              onClick={() => setBasemap('dark')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                basemap === 'dark'
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Dark Map
            </button>
            <button
              onClick={() => setBasemap('satellite')}
              className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                basemap === 'satellite'
                  ? 'bg-cyan-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              Satellite
            </button>
          </div>

          {/* 4 Feature Layer Toggles */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <button
              onClick={() => setActiveLayer('aqi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'aqi'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              AQI
            </button>
            <button
              onClick={() => setActiveLayer('stations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'stations'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Stations
            </button>
            <button
              onClick={() => setActiveLayer('fires')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'fires'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fires
            </button>
            <button
              onClick={() => setActiveLayer('plume')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeLayer === 'plume'
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Plume
            </button>
          </div>

        </div>
      </div>

      {/* Map Canvas + District Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Real Leaflet Map (8 Columns) */}
        <div className="lg:col-span-8 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[460px] sm:min-h-[520px]">
          
          {/* Top Floating Controls on Map */}
          <div className="absolute top-5 left-5 z-[500] flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080b11]/85 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md shadow-xl">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Center: 28.58° N, 77.25° E</span>
            </div>

            <button
              onClick={handleResetView}
              title="Reset View to NCR"
              className="px-2.5 py-1.5 rounded-lg bg-[#080b11]/85 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-400 backdrop-blur-md transition-all flex items-center gap-1 shadow-xl"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Active Status Badge */}
          <div className="absolute top-5 right-5 z-[500] px-3 py-1.5 rounded-lg bg-[#080b11]/85 border border-white/10 text-xs font-mono text-cyan-400 backdrop-blur-md shadow-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Layer: <strong className="text-white uppercase">{activeLayer}</strong></span>
          </div>

          {/* Real Leaflet Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[440px] sm:min-h-[490px] rounded-xl overflow-hidden z-10"
          />

          {/* Bottom Bar Legend */}
          <div className="pt-2 px-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400 z-10">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Good/Mod (0-200)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Poor (201-300)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                V.Poor/Severe (300+)
              </span>
            </div>
            <span>Pan & Zoom enabled • Click pins to inspect</span>
          </div>

        </div>

        {/* Selected District Telemetry Inspector (4 Columns) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.09] backdrop-blur-xl flex flex-col justify-between shadow-2xl">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  District Telemetry
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  {selectedData.name}
                  <span className="text-xs font-normal text-slate-400 font-sans">
                    ({selectedData.hindiName})
                  </span>
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  selectedData.aqiStatus === 'GOOD'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : selectedData.aqiStatus === 'MODERATE'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : selectedData.aqiStatus === 'POOR'
                    ? 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}
              >
                {selectedData.aqiStatus}
              </span>
            </div>

            {/* Main AQI & PM2.5 */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Live AQI</div>
                <div className="text-4xl font-extrabold text-white font-mono mt-1">
                  {selectedData.aqi}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06]">
                <div className="text-[11px] font-mono text-slate-400 uppercase">PM2.5</div>
                <div className="text-3xl font-bold text-white font-mono mt-1">
                  {selectedData.pm25} <span className="text-xs font-normal text-slate-400">µg/m³</span>
                </div>
              </div>
            </div>

            {/* Tomorrow Forecast Prediction */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-400">Tomorrow Projected</div>
                <div className="text-xl font-bold text-white font-mono mt-0.5">
                  AQI {selectedData.tomorrowAqi}
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold border ${
                selectedData.trend === 'down'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : selectedData.trend === 'up'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {selectedData.trend === 'down' ? <ArrowDown className="w-3.5 h-3.5" /> : selectedData.trend === 'up' ? <ArrowUp className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
                {selectedData.trend === 'down' ? 'Improving' : selectedData.trend === 'up' ? 'Rising' : 'Stable'}
              </div>
            </div>

            {/* 3 Atmospheric Sub-Parameters */}
            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-slate-400">Inversion Trapping</span>
                <span className="font-bold text-rose-400">{selectedData.inversion}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-slate-400">Dispersion Capacity</span>
                <span className="font-bold text-rose-400">{selectedData.dispersion}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-slate-400">Plume Influence</span>
                <span className="font-bold text-amber-400">{selectedData.plumeInfluence}</span>
              </div>
            </div>

            {/* Primary Stressor Note */}
            <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] text-slate-300">
              <span className="text-slate-500 font-mono block mb-0.5 uppercase">Primary Stressor</span>
              {selectedData.keySource}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Coordinates</span>
            <span className="text-slate-300">{selectedData.lat}° N, {selectedData.lng}° E</span>
          </div>
        </div>

      </div>
    </section>
  );
}
