"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Створюємо допоміжний компонент, який живе ВСЕРЕДИНІ MapContainer
function FitBounds({ plots, userLocation }: { plots: any[]; userLocation?: [number, number] | null }) {
  const map = useMap(); // Отримуємо доступ до об'єкта карти Leaflet

  useEffect(() => {
    if (!plots || plots.length === 0) return;

    // Створюємо порожній об'єкт меж
    const bounds = L.latLngBounds([]);

    // Проходимося по всіх координатах усіх ділянок і розширюємо межі
    plots.forEach((plot) => {
      plot.coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord);
      });
    });

    if (userLocation) {
      bounds.extend(userLocation);
    }

    // Якщо межі валідні, центруємо карту з невеликим відступом (padding)
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] }); // 50px відступу від країв екрану
    }
  }, [plots, map, userLocation]); // useEffect спрацює щоразу, коли зміняться дані ділянок або локація користувача

  return null; // Цей компонент не рендерить HTML, він лише керує логікою карти
}

interface MapProps {
  plots: any[];
  userLocation?: [number, number] | null;
}

export default function Map({ plots, userLocation }: MapProps) {
  // Тепер center і zoom тут є лише "стартовими" значеннями.
  // Наш компонент FitBounds миттєво їх перевизначить.
  const initialCenter: [number, number] = [50.35, 24.25];

  // Створюємо іконку для синьої крапки
  const pulsingBlueIcon = L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_15px_3px_rgba(59,130,246,0.8)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  return (
    <MapContainer
      center={initialCenter}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: "12px", minHeight: "400px" }}
    >
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      {/* 2. Додаємо наш новий компонент всередину карти */}
      <FitBounds plots={plots} userLocation={userLocation} />

      {plots.map((plot) => (
        <Polygon
          key={plot.id}
          positions={plot.coordinates}
          pathOptions={{
            color: "#00ffaa",
            fillOpacity: 0.4,
            weight: 2,
          }}
        >
          <Popup>
            <div className="p-2 text-gray-800 max-w-[250px]">
              {" "}
              {/* Додав max-w, щоб вікно не розтягувалось занадто сильно */}
              <p className="border-b pb-1 mb-2 font-bold text-lg">
                Деталі об'єкта
              </p>
              <p className="mb-1">
                <strong>Кадастровий:</strong> {plot.cadastralNumber}
              </p>
              <p className="mb-2">
                <strong>Власник:</strong> {plot.owner}
              </p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {userLocation && (
        <Marker position={userLocation} icon={pulsingBlueIcon}>
          <Popup>
            <div className="p-1 font-bold text-sm">Поточна позиція</div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
