"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface CountryDataItem {
  name: string;
  value: number;
  color: string;
  lat?: number;
  lng?: number;
}

// Country coordinates for major countries
const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'India': { lat: 20.5937, lng: 78.9629 },
  'USA': { lat: 39.8283, lng: -98.5795 },
  'UK': { lat: 55.3781, lng: -3.4360 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'UAE': { lat: 23.4241, lng: 53.8478 },
  'Singapore': { lat: 1.3521, lng: 103.8198 }
};

interface SecureMapProps {
  data: CountryDataItem[];
  isDark?: boolean;
}

const SecureMapComponent: React.FC<SecureMapProps> = ({ data, isDark = false }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-[400px] bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }

  // Add coordinates to data
  const mapData = data.map(item => ({
    ...item,
    ...COUNTRY_COORDINATES[item.name]
  })).filter(item => item.lat && item.lng);

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
        style={{ 
          backgroundColor: isDark ? '#1f2937' : '#f9fafb',
          filter: isDark ? 'hue-rotate(180deg) invert(1)' : 'none'
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {mapData.map((country, index) => {
          const radius = Math.max(5, (country.value / maxValue) * 30);
          
          return (
            <CircleMarker
              key={index}
              center={[country.lat!, country.lng!]}
              radius={radius}
              pathOptions={{
                fillColor: country.color,
                color: country.color,
                weight: 2,
                opacity: 0.8,
                fillOpacity: 0.6
              }}
            >
              <Popup>
                <div className="text-center p-2">
                  <h3 className="font-semibold text-gray-900">{country.name}</h3>
                  <p className="text-sm text-gray-600">{country.value} users</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default SecureMapComponent; 