import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { useNavigate } from 'react-router-dom';

type LatLng = {
    lat: number;
    lng: number;
};

interface ProblemsMapProps {
    selectedLocation?: LatLng | null;              // делаем опциональным
    onLocationSelect?: (coords: LatLng) => void;   // тоже опционально
}

function ClickHandler({
                          onLocationSelect,
                      }: {
    onLocationSelect?: (coords: LatLng) => void;
}) {
    const navigate = useNavigate();

    useMapEvents({
        click(e: LeafletMouseEvent) {
            const coords = { lat: e.latlng.lat, lng: e.latlng.lng };

            // если родитель хочет знать — сообщаем
            onLocationSelect?.(coords);

            // сразу переходим на страницу добавления проблемы,
            // передаём координаты через state
            navigate('/add', { state: { location: coords } });
        },
    });

    return null;
}

export default function ProblemsMap({ selectedLocation, onLocationSelect }: ProblemsMapProps) {
    const [center, setCenter] = useState<LatLng>({ lat: 42.8746, lng: 74.5698 });

    // Центрируем по геолокации пользователя, если разрешил
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {}
        );
    }, []);

    return (
        <div className="relative w-full h-[80vh] md:h-[86vh] lg:h-[calc(100vh-80px)] border border-gray-800 shadow-xl rounded-none md:rounded-2xl overflow-hidden">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                className="w-full h-full touch-pan-y"
            >
                <TileLayer
                    attribution="© OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickHandler onLocationSelect={onLocationSelect} />

                {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                            Выбранная точка: <br />
                            {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
}