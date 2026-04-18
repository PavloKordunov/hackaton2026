"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 1. Створюємо допоміжний компонент, який живе ВСЕРЕДИНІ MapContainer
function FitBounds({ plots }: { plots: any[] }) {
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

    // Якщо межі валідні, центруємо карту з невеликим відступом (padding)
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] }); // 50px відступу від країв екрану
    }
  }, [plots, map]); // useEffect спрацює щоразу, коли зміняться дані ділянок

  return null; // Цей компонент не рендерить HTML, він лише керує логікою карти
}

interface MapProps {
  plots: any[];
}

export default function Map({ plots }: MapProps) {
  // Тепер center і zoom тут є лише "стартовими" значеннями.
  // Наш компонент FitBounds миттєво їх перевизначить.
  const initialCenter: [number, number] = [50.35, 24.25];

  return (
    <MapContainer
      center={initialCenter}
      zoom={13}
      style={{ height: "600px", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        maxZoom={20}
        subdomains={["mt0", "mt1", "mt2", "mt3"]}
      />

      {/* 2. Додаємо наш новий компонент всередину карти */}
      <FitBounds plots={plots} />

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
    </MapContainer>
  );
}
