"use client";

import React, { useEffect } from "react";
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPlot {
  id: string;
  cadastralNumber: string;
  owner: string;
  coordinates: number[][];
  discrepancy?: string;
  color?: string;
  fillOpacity?: number;
  actualCoordinates?: number[][];
}

const toLatLngTuple = (coord: number[]): [number, number] => [
  coord[0] ?? 0,
  coord[1] ?? 0,
];

const normalizeCoordinates = (coordinates: number[][]): [number, number][] =>
  coordinates.map(toLatLngTuple);

function FitBounds({
  plots,
  userLocation,
}: {
  plots: MapPlot[];
  userLocation?: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!plots.length) return;

    const bounds = L.latLngBounds([]);

    plots.forEach((plot) => {
      plot.coordinates.forEach((coord) => {
        bounds.extend(toLatLngTuple(coord));
      });
    });

    if (userLocation) {
      bounds.extend(userLocation);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [plots, map, userLocation]);

  return null;
}

function SelectedPlotPanner({
  plots,
  selectedPlotId,
}: {
  plots: MapPlot[];
  selectedPlotId?: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedPlotId) return;

    const plot = plots.find((item) => item.id === selectedPlotId);
    if (!plot) return;

    const bounds = L.latLngBounds(normalizeCoordinates(plot.coordinates));
    if (bounds.isValid()) {
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1 });
    }
  }, [selectedPlotId, plots, map]);

  return null;
}

interface MapProps {
  plots: MapPlot[];
  userLocation?: [number, number] | null;
  selectedPlotId?: string | null;
}

export default function Map({ plots, userLocation, selectedPlotId }: MapProps) {
  const initialCenter: [number, number] = [50.35, 24.25];

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

      {!selectedPlotId && <FitBounds plots={plots} userLocation={userLocation} />}
      <SelectedPlotPanner plots={plots} selectedPlotId={selectedPlotId} />

      {plots.map((plot) => {
        const isSelected = selectedPlotId === plot.id;

        return (
          <React.Fragment key={plot.id}>
            <Polygon
              positions={normalizeCoordinates(plot.coordinates)}
              pathOptions={{
                color: plot.color || "#00ffaa",
                fillOpacity: isSelected ? 0.7 : plot.fillOpacity || 0.4,
                weight: isSelected ? 4 : 2,
              }}
            >
              <Popup>
                <div className="p-2 text-gray-800 max-w-[250px]">
                  <p className="border-b pb-1 mb-2 font-bold text-lg">
                    Деталі об&apos;єкта
                  </p>
                  <p className="mb-1">
                    <strong>Кадастровий:</strong> {plot.cadastralNumber}
                  </p>
                  <p className="mb-2">
                    <strong>Власник:</strong> {plot.owner}
                  </p>
                  {plot.discrepancy && (
                    <div className="mt-2 p-2 bg-red-100 text-red-800 text-xs rounded border border-red-200">
                      <strong>Увага:</strong> {plot.discrepancy}
                    </div>
                  )}
                </div>
              </Popup>
            </Polygon>

            {plot.actualCoordinates && (
              <Polygon
                positions={normalizeCoordinates(plot.actualCoordinates)}
                pathOptions={{
                  color: "#ef4444",
                  fillOpacity: 0.3,
                  weight: 3,
                  dashArray: "5, 5",
                }}
              />
            )}
          </React.Fragment>
        );
      })}

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
