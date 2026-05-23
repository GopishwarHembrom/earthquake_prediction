import L from "leaflet";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationSelector({ onLocationChange }) {
  useMapEvents({
    click(event) {
      const { lat, lng } = event.latlng;
      onLocationChange({ lat, lon: lng });
    },
  });
  return null;
}

export default function MapView({ location, onLocationChange }) {
  const mapCenter = useMemo(() => [location.lat, location.lon], [location]);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-panel shadow-soft backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="font-heading text-lg font-semibold text-slate-100">
          Seismic Location Map
        </h3>
        <span className="text-xs text-slate-300">Click map to choose coordinates</span>
      </div>

      <div className="h-[420px] w-full">
        <MapContainer center={mapCenter} zoom={4} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationSelector onLocationChange={onLocationChange} />
          <Marker position={mapCenter} />
        </MapContainer>
      </div>
    </div>
  );
}
