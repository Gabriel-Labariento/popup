import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Search, MapPin, Loader2 } from 'lucide-react';

// --- Fix for Leaflet Default Icon Bug in React/Vite ---
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


interface LocationPickerProps {
    onLocationSelect: (address: string, lat: number, lng: number) => void;
    defaultAddress?: string;
}

const LocationPicker = ({ onLocationSelect, defaultAddress }: LocationPickerProps) => {
    const [search, setSearch] = useState(defaultAddress || '');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [position, setPosition] = useState<[number, number]>([14.5995, 120.9842]); // Default Manila
    const [isSearching, setIsSearching] = useState(false);

    // Update map view when position changes
    function ChangeView({ center }: { center: [number, number] }) {
        const map = useMap();
        map.setView(center, 14);
        return null;
    }

    // Handle Search via Photon API (Free, no key)
    const handleSearch = async (query: string) => {
        setSearch(query);
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await res.json();
            setSuggestions(data.features || []);
        } catch (err) {
            console.error("Search error", err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (feature: any) => {
        const [lng, lat] = feature.geometry.coordinates;
        const address = [
            feature.properties.name,
            feature.properties.street,
            feature.properties.city,
            feature.properties.state
        ].filter(Boolean).join(", ");

        setSearch(address);
        setPosition([lat, lng]);
        setSuggestions([]);
        onLocationSelect(address, lat, lng);
    };

    return (
        <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {isSearching ? <Loader2 className="animate-spin text-slate-400" size={18} /> : <Search className="text-slate-400" size={18} />}
                </div>
                <input
                    type="text"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search for event address..."
                    className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                />

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-[1000] w-full bg-white border border-slate-200 mt-1 rounded-lg shadow-xl overflow-hidden">
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                onClick={() => selectLocation(s)}
                                className="p-3 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-0 flex items-start gap-2"
                            >
                                <MapPin size={16} className="mt-0.5 text-slate-400 flex-shrink-0" />
                                <span>
                                    <span className="font-bold">{s.properties.name}</span>
                                    {s.properties.city && <span className="text-slate-500">, {s.properties.city}</span>}
                                    {s.properties.country && <span className="text-slate-400 text-xs block">{s.properties.country}</span>}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Map Preview */}
            <div className="h-[250px] rounded-xl overflow-hidden border border-slate-200 z-0">
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position} />
                    <ChangeView center={position} />
                </MapContainer>
            </div>
            <p className="text-[10px] text-slate-400 italic">Address data provided by OpenStreetMap & Photon.</p>
        </div>
    );
};

export default LocationPicker;