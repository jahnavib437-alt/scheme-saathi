import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeoLocation } from '../hooks/useGeoLocation';
import { MapPin, Navigation, Phone, Clock, Loader2, AlertCircle } from 'lucide-react';

// Fix Leaflet default icon path in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FlyToLocation({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 13, { animate: true, duration: 1 });
    }
  }, [coords, map]);
  return null;
}

const TYPE_LABELS = {
  CSC: 'Common Service Centre (CSC)',
  SevaKendra: 'Karnataka Seva Kendra',
  PostOffice: 'India Post Seva',
  Bank: 'Designated Public Bank',
  GramaOne: 'Karnataka GramaOne Centre',
  Other: 'Enrolment Centre',
};

export const CentresMapPage = () => {
  const { coords, loading: geoLoading, error: geoError, request: requestGeo } = useGeoLocation();
  const [centres, setCentres] = useState([]);
  const [loadingCentres, setLoadingCentres] = useState(false);
  const [centreError, setCentreError] = useState(null);
  const [selectedType, setSelectedType] = useState('All');

  // Default fallback center — Tumakuru District HQ, Karnataka
  const defaultCenter = [13.3409, 77.1010];

  useEffect(() => {
    requestGeo();
  }, [requestGeo]);

  useEffect(() => {
    if (!coords) return;
    setLoadingCentres(true);
    setCentreError(null);
    fetch(`/api/centres/nearby?lat=${coords.lat}&lng=${coords.lng}&maxDistance=25000&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setCentres(data.centres || data || []);
        setLoadingCentres(false);
      })
      .catch(() => {
        setCentreError('Could not load nearby centres.');
        setLoadingCentres(false);
      });
  }, [coords]);

  const types = ['All', ...new Set(centres.map((c) => c.type))];
  const filtered = selectedType === 'All' ? centres : centres.filter((c) => c.type === selectedType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-saathi-ink flex items-center gap-2.5">
            <MapPin className="text-saathi-primary w-7 h-7" />
            Nearby Application Centres
          </h1>
          <p className="text-sm text-saathi-muted mt-1 max-w-2xl">
            Locate official GramaOne, CSC, Seva Sindhu, and Post Office centres for offline scheme registration.
            Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline hover:text-saathi-primary">OpenStreetMap</a> contributors.
          </p>
        </div>

        <button
          onClick={requestGeo}
          disabled={geoLoading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-saathi-primary hover:bg-saathi-primary-hover text-white text-sm font-semibold transition-colors shadow-soft-sm self-start shrink-0"
        >
          {geoLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          {geoLoading ? 'Detecting Location...' : 'Use My GPS Location'}
        </button>
      </div>

      {geoError && (
        <div className="flex items-center gap-2 p-3 bg-saathi-danger-light border border-saathi-danger/20 text-saathi-danger rounded-2xl text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{geoError} — Displaying Tumakuru district centres by default.</span>
        </div>
      )}

      {/* Filter Chips */}
      {types.length > 1 && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-semibold text-saathi-muted">Filter:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedType === t
                  ? 'bg-saathi-ink text-white shadow-soft-sm'
                  : 'bg-saathi-card border border-saathi-border text-saathi-muted hover:text-saathi-ink'
              }`}
            >
              {TYPE_LABELS[t] || t}
            </button>
          ))}
        </div>
      )}

      {/* Leaflet Map Card */}
      <div className="rounded-3xl overflow-hidden border border-saathi-border shadow-soft-md bg-saathi-card h-[400px] lg:h-[480px] relative z-0">
        <MapContainer
          center={coords ? [coords.lat, coords.lng] : defaultCenter}
          zoom={coords ? 13 : 11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {coords && <FlyToLocation coords={coords} />}
          {coords && (
            <>
              <Marker position={[coords.lat, coords.lng]} icon={userIcon}>
                <Popup>
                  <div className="text-xs font-semibold text-saathi-ink">You are here</div>
                </Popup>
              </Marker>
              <Circle
                center={[coords.lat, coords.lng]}
                radius={3000}
                pathOptions={{ color: '#1F6F5B', fillColor: '#1F6F5B', fillOpacity: 0.08 }}
              />
            </>
          )}

          {filtered.map((c) => {
            const lat = c.location?.coordinates?.[1] || defaultCenter[0];
            const lng = c.location?.coordinates?.[0] || defaultCenter[1];
            return (
              <Marker key={c._id || c.name} position={[lat, lng]}>
                <Popup>
                  <div className="p-1 max-w-[200px]">
                    <h4 className="font-semibold text-xs text-saathi-ink leading-tight">{c.name}</h4>
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-saathi-primary-light text-saathi-primary font-medium mt-1">
                      {TYPE_LABELS[c.type] || c.type}
                    </span>
                    {c.address && <p className="text-[11px] text-saathi-muted mt-1 leading-snug">{c.address}</p>}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1 mt-1 text-[11px] text-saathi-primary font-medium">
                        <Phone size={10} /> {c.phone}
                      </a>
                    )}
                    {coords && (
                      <a
                        href={`https://www.openstreetmap.org/directions?from=${coords.lat},${coords.lng}&to=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1.5 text-[10px] text-saathi-accent underline font-semibold"
                      >
                        Get Directions ↗
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Centre list below map */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg font-bold text-saathi-ink">
            {filtered.length} Centres Found {coords ? 'Near You' : 'in Seed Area'}
          </h2>
          {loadingCentres && (
            <span className="flex items-center gap-1.5 text-xs text-saathi-muted">
              <Loader2 size={13} className="animate-spin" /> Fetching centres...
            </span>
          )}
        </div>

        {filtered.length === 0 && !loadingCentres ? (
          <div className="p-8 text-center rounded-3xl bg-saathi-card border border-saathi-border text-saathi-muted text-sm">
            No physical centres found within 25 km of your location. You can apply directly through online state portals.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const lat = c.location?.coordinates?.[1];
              const lng = c.location?.coordinates?.[0];
              return (
                <div key={c._id || c.name} className="p-4 rounded-2xl bg-saathi-card border border-saathi-border shadow-soft-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-saathi-ink leading-tight">{c.name}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-saathi-primary-light text-saathi-primary shrink-0">
                        {c.type}
                      </span>
                    </div>
                    <p className="text-xs text-saathi-muted mt-1.5 leading-relaxed">{c.address || `${c.district}, ${c.state}`}</p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-saathi-border flex items-center justify-between text-xs">
                    {c.phone ? (
                      <a href={`tel:${c.phone}`} className="flex items-center gap-1 text-saathi-primary font-medium hover:underline">
                        <Phone size={12} /> {c.phone}
                      </a>
                    ) : (
                      <span className="flex items-center gap-1 text-saathi-muted">
                        <Clock size={12} /> {c.hours || '9:30 AM - 5:30 PM'}
                      </span>
                    )}

                    {coords && lat && lng && (
                      <a
                        href={`https://www.openstreetmap.org/directions?from=${coords.lat},${coords.lng}&to=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-saathi-accent font-semibold hover:underline"
                      >
                        Directions ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CentresMapPage;
