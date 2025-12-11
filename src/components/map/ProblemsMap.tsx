import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import type { ProblemStatus } from '../problems/ProblemCard';
import './ProblemsMap.css';

type LatLng = {
    lat: number;
    lng: number;
};

type Problem = {
    id: string;
    title: string;
    status: ProblemStatus;
    votes: number;
    lat: number;
    lng: number;
};

interface ProblemsMapProps {
    selectedLocation?: LatLng | null;
    onLocationSelect?: (coords: LatLng) => void;
    problems?: Problem[];
}

const getMarkerIcon = (status: ProblemStatus) => {
    const iconColors: Record<ProblemStatus, { bg: string; border: string }> = {
        'новая': { bg: '#ff4444', border: '#cc0000' },
        'принято': { bg: '#ff9900', border: '#cc6600' },
        'в_работе': { bg: '#4488ff', border: '#0055cc' },
        'решено': { bg: '#44cc44', border: '#00aa00' },
    };

    const { bg, border } = iconColors[status];

    const html = `
        <div style="
            width: 40px;
            height: 40px;
            background: ${bg};
            border: 3px solid ${border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 15px rgba(0,0,0,0.3), 0 0 25px ${bg}80;
            font-weight: bold;
            color: white;
            ${status === 'новая' ? 'animation: pulse 1.5s infinite;' : ''}
        ">
            ${status === 'новая' ? '🔴' : status === 'принято' ? '🟠' : status === 'в_работе' ? '🔵' : '🟢'}
        </div>
    `;

    return L.divIcon({
        html,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
    });
};

function ClickHandler({
    onLocationSelect,
}: {
    onLocationSelect?: (coords: LatLng) => void;
}) {
    const navigate = useNavigate();

    useMapEvents({
        click(e: LeafletMouseEvent) {
            const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
            onLocationSelect?.(coords);
            navigate('/add', { state: { location: coords } });
        },
    });

    return null;
}

export default function ProblemsMap({
    selectedLocation,
    onLocationSelect,
    problems = [],
}: ProblemsMapProps) {
    const [center, setCenter] = useState<LatLng>({ lat: 42.8746, lng: 74.5698 });

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            () => {}
        );
    }, []);

    const sortedProblems = [...problems].sort((a, b) => {
        const statusOrder = { 'новая': 0, 'принято': 1, 'в_работе': 2, 'решено': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="relative w-full h-full">
            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                className="w-full h-full"
                attributionControl={false}
            >
                <TileLayer
                    attribution="© OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <ClickHandler onLocationSelect={onLocationSelect} />

                {sortedProblems.map((problem) => (
                    <Marker
                        key={problem.id}
                        position={[problem.lat, problem.lng]}
                        icon={getMarkerIcon(problem.status)}
                        zIndexOffset={problem.status === 'новая' ? 1000 : 100}
                    >
                        <Popup className="problem-popup">
                            <div className="min-w-[200px]">
                                <p className="font-bold text-gray-900 mb-1">{problem.title}</p>
                                
                                <div className="flex gap-2 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                                        problem.status === 'новая' ? 'bg-red-500' :
                                        problem.status === 'принято' ? 'bg-orange-400' :
                                        problem.status === 'в_работе' ? 'bg-blue-500' :
                                        'bg-green-500'
                                    }`}>
                                        {problem.status}
                                    </span>
                                    <span className="px-2 py-1 rounded text-xs font-semibold bg-gray-200 text-gray-800">
                                        🔥 {problem.votes}
                                    </span>
                                </div>
                                
                                {problem.status === 'новая' && (
                                    <p className="text-xs text-red-600 font-semibold mb-1">⚠️ Новая заявка!</p>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {selectedLocation && (
                    <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                            Выбранная точка: <br />
                            {selectedLocation.lat.toFixed(5)}, {selectedLocation.lng.toFixed(5)}
                        </Popup>
                    </Marker>
                )}
            </MapContainer>

            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white p-2 sm:p-4 rounded-lg shadow-xl text-xs sm:text-sm space-y-1 sm:space-y-2 z-40 border-2 border-gray-300 max-w-[150px] sm:max-w-none">
                <p className="font-bold text-gray-900 text-sm">Статусы:</p>
                
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-red-500 flex-shrink-0"></div>
                        <p className="font-semibold text-red-600 text-xs">Новая</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-400 flex-shrink-0"></div>
                        <p className="text-orange-600 text-xs">Принято</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 flex-shrink-0"></div>
                        <p className="text-blue-600 text-xs">В работе</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 flex-shrink-0"></div>
                        <p className="text-green-600 text-xs">Решено</p>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-1 pt-1 border-t text-center">
                    📍 нажми на карту
                </p>
            </div>

            {problems.length > 0 && (
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-lg z-40 border-2 border-gray-300">
                    <p className="text-xs sm:text-sm font-bold text-gray-800">
                        📍 <span className="text-blue-600">{problems.length}</span>
                    </p>
                    {problems.filter(p => p.status === 'новая').length > 0 && (
                        <p className="text-xs text-red-600 font-bold">
                            ⚠️ {problems.filter(p => p.status === 'новая').length}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}