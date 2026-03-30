import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, FeatureGroup } from 'react-leaflet';
import { motion } from 'motion/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { PROVINCES, getProvinceFromCoords, PROVINCE_JOB_DEMAND } from '../data/mapData';

// CSS for heatmap pulse animation
const heatmapAnimationStyle = `
  @keyframes heatmapPulse {
    0% { opacity: 0.2; }
    50% { opacity: 0.35; }
    100% { opacity: 0.2; }
  }
  .heatmap-pulse {
    animation: heatmapPulse 3s ease-in-out infinite;
  }
`;

interface UserLocation {
  lat: number;
  lng: number;
  label: string;
  province?: string;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'user' | 'career' | 'university' | 'tvet';
  title: string;
}

interface MapDisplayProps {
  center: [number, number];
  zoom?: number;
  userLocation?: UserLocation;
  markers?: MapMarker[];
  activeLayers?: string[];
  onLayerToggle?: (layer: string) => void;
}

export default function MapDisplay({
  center,
  zoom = 8,
  userLocation,
  markers = [],
  activeLayers = ['demand', 'colleges'],
  onLayerToggle,
}: MapDisplayProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [animateCircles, setAnimateCircles] = useState(false);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Trigger animation on mount
  useEffect(() => {
    setAnimateCircles(true);
  }, []);

  // Get demand color based on level
  const getDemandColor = (level: string) => {
    switch (level) {
      case 'high':
        return '#DC2626'; // red
      case 'medium':
        return '#FBBF24'; // amber
      default:
        return '#22C55E'; // green
    }
  };

  // Custom user location icon
  const userIcon = L.divIcon({
    className: 'user-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #1B5E20;
        border: 4px solid white;
        box-shadow: 0 0 0 2px #1B5E20;
        display: flex;
        align-items: center;
        justify-items: center;
        animation: pulse 2s infinite;
      ">
        📍
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 2px #1B5E20; }
          50% { box-shadow: 0 0 0 6px rgba(27, 94, 32, 0.3); }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  // Career marker icon
  const careerIcon = L.divIcon({
    className: 'career-marker',
    html: '<div style="font-size: 20px;">💼</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  // College marker icons
  const universityIcon = L.divIcon({
    className: 'university-marker',
    html: '<div style="font-size: 20px;">🎓</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  const tvetIcon = L.divIcon({
    className: 'tvet-marker',
    html: '<div style="font-size: 20px;">🏗️</div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      <style>{heatmapAnimationStyle}</style>
      <MapContainer ref={mapRef} center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        {/* Base Map */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={19}
        />

        {/* Province Demand Heatmap Circles */}
        {activeLayers.includes('demand') &&
          PROVINCES.map((province) => {
            const demand = PROVINCE_JOB_DEMAND.find(
              (p: any) => p.province === province.name
            );
            const color = getDemandColor(demand?.level || 'low');

            return (
              <FeatureGroup key={`demand-${province.name}`}>
                {/* Outer ring - most transparent */}
                <Circle
                  center={[province.centroid.lat, province.centroid.lng]}
                  radius={150000}
                  fillColor={color}
                  color={color}
                  weight={0}
                  fillOpacity={0.05}
                />

                {/* Mid ring */}
                <Circle
                  center={[province.centroid.lat, province.centroid.lng]}
                  radius={90000}
                  fillColor={color}
                  color={color}
                  weight={0}
                  fillOpacity={0.12}
                />

                {/* Inner ring - most opaque, with pulsing animation via CSS */}
                <motion.div
                  className="heatmap-pulse"
                  style={{ pointerEvents: 'none' }}
                >
                  <Circle
                    center={[province.centroid.lat, province.centroid.lng]}
                    radius={45000}
                    fillColor={color}
                    color={color}
                    weight={0}
                    fillOpacity={0.25}
                  />
                </motion.div>
              </FeatureGroup>
            );
          })}

        {/* User Location Marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup className="rounded-lg">
              <div className="font-semibold text-slate-900">{userLocation.label}</div>
            </Popup>
          </Marker>
        )}

        {/* Career Markers */}
        {activeLayers.includes('careers') &&
          markers
            .filter((m) => m.type === 'career')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={careerIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}

        {/* University Markers */}
        {activeLayers.includes('colleges') &&
          markers
            .filter((m) => m.type === 'university')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={universityIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}

        {/* TVET Markers */}
        {activeLayers.includes('colleges') &&
          markers
            .filter((m) => m.type === 'tvet')
            .map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lng]}
                icon={tvetIcon}
              >
                <Popup className="rounded-lg">
                  <div className="text-sm font-semibold text-slate-900">{marker.title}</div>
                </Popup>
              </Marker>
            ))}
      </MapContainer>

      {/* Layer Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 z-40 space-y-2">
        <div className="text-xs font-bold text-slate-700 px-2 py-1 uppercase tracking-widest">Layers</div>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
          <input
            type="checkbox"
            checked={activeLayers.includes('demand')}
            onChange={() => onLayerToggle?.('demand')}
            className="w-4 h-4"
          />
          <span>🔥 Demand</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
          <input
            type="checkbox"
            checked={activeLayers.includes('colleges')}
            onChange={() => onLayerToggle?.('colleges')}
            className="w-4 h-4"
          />
          <span>🏫 Colleges</span>
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
          <input
            type="checkbox"
            checked={activeLayers.includes('careers')}
            onChange={() => onLayerToggle?.('careers')}
            className="w-4 h-4"
          />
          <span>💼 Careers</span>
        </label>
      </div>

      {/* Demand Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4 z-40 text-sm">
        <div className="font-bold text-slate-900 mb-2">Job Demand</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#DC2626' }}></div>
            <span className="text-slate-700">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FBBF24' }}></div>
            <span className="text-slate-700">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22C55E' }}></div>
            <span className="text-slate-700">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
