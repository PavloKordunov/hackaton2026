"use client";

import { useState, useRef } from "react";
import {
  Satellite,
  Smartphone,
  Crosshair,
  Zap,
  ShieldCheck,
  AlertTriangle,
  RefreshCcw,
  Signal,
  MapPinned
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { Card, Button } from "@/components/ui";

// Dynamic import of the existing Map component to avoid SSR issues
const MapWithNoSSR = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 rounded-2xl">
      <Satellite className="animate-spin w-8 h-8 mr-2" />
      Ініціалізація карти...
    </div>
  ),
});

// 1. MOCK_PLOT object (Rectangle)
const MOCK_PLOT_COORDS: [number, number][] = [
  [50.350, 24.250],
  [50.352, 24.250],
  [50.352, 24.254],
  [50.350, 24.253],
];

const MOCK_PLOT = {
  id: "mock-plot-1",
  cadastralNumber: "8000000000:90:123:4567",
  owner: "Тестовий Полігон",
  coordinates: MOCK_PLOT_COORDS,
};

// 2. Geofencing Algorithm (Ray-casting)
function isPointInPolygon(point: [number, number], polygon: [number, number][]) {
  const [lat, lng] = point;
  let isInside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [latI, lngI] = polygon[i];
    const [latJ, lngJ] = polygon[j];

    const intersect =
      lngI > lng !== lngJ > lng &&
      lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI;
    if (intersect) isInside = !isInside;
  }
  return isInside;
}

type ScanState = "IDLE" | "SCANNING" | "RESULT";

export default function PrecisionSurveyingPage() {
  const [scanState, setScanState] = useState<ScanState>("IDLE");
  const [scanText, setScanText] = useState("");
  const [result, setResult] = useState<{
    isInside: boolean;
    coords: [number, number];
  } | null>(null);

  const [accuracy, setAccuracy] = useState<number | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);

  const startScan = () => {
    setScanState("SCANNING");
    setResult(null);
    setAccuracy(null);
    lastPositionRef.current = null;

    // Sequential scanning state text updates
    setTimeout(() => setScanText("Acquiring L1/L2 satellite signals..."), 0);
    setTimeout(() => setScanText("Applying RTK corrections..."), 2000);
    setTimeout(() => setScanText("Averaging position..."), 4000);

    const startTime = Date.now();

    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setAccuracy(position.coords.accuracy);
          lastPositionRef.current = position;
        },
        (error) => {
          console.error("Error getting location:", error);
          setScanText("GPS Error: " + error.message);
          setTimeout(() => resetScan(), 3000);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
      );

      const checkInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime >= 6000 && lastPositionRef.current) {
          clearInterval(checkInterval);
          navigator.geolocation.clearWatch(watchId);
          
          const position = lastPositionRef.current;
          const generatedCoords: [number, number] = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          const isInside = isPointInPolygon(generatedCoords, MOCK_PLOT_COORDS);

          setResult({ isInside, coords: generatedCoords });
          setScanState("RESULT");
        } else if (elapsedTime >= 30000) {
          clearInterval(checkInterval);
          navigator.geolocation.clearWatch(watchId);
          setScanText("GPS Timeout");
          setTimeout(() => resetScan(), 3000);
        }
      }, 500);
    } else {
      setScanText("Geolocation is not supported by your browser");
      setTimeout(() => resetScan(), 3000);
    }
  };

  const resetScan = () => {
    setScanState("IDLE");
    setResult(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center w-max gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-1">
          <Satellite className="w-4 h-4" />
          GEO-Аналіз
        </div>
        <h2 className="text-3xl lg:text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
          High-Precision GPS Survey
        </h2>
        <p className="text-slate-500 text-lg">
          Professional calibration tool with RTK simulation and real-time geofencing algorithm.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Panel: Calibration Interface */}
        <div className="lg:col-span-5 flex flex-col h-[500px]">
          <Card className="relative overflow-hidden p-8 border-0 shadow-2xl shadow-indigo-900/10 bg-slate-950 text-white flex-1 flex flex-col justify-center items-center text-center">
            
            <AnimatePresence mode="wait">
              {/* IDLE STATE */}
              {scanState === "IDLE" && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center gap-6"
                >
                  <div className="w-24 h-24 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                    <Smartphone className="w-12 h-12 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3 text-white">Device Ready</h3>
                    <p className="text-slate-400 text-sm max-w-[280px] leading-relaxed mx-auto">
                      Place the device flat on the ground for GPS stabilization and RTK synchronization.
                    </p>
                  </div>
                  <Button 
                    onClick={startScan}
                    className="mt-4 h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 hover:-translate-y-1 transition-all"
                  >
                    <Zap className="w-5 h-5 fill-current" />
                    Start Calibration
                  </Button>
                </motion.div>
              )}

              {/* SCANNING STATE */}
              {scanState === "SCANNING" && (
                <motion.div
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center gap-10 w-full px-4"
                >
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Rotating Radars */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-t-4 border-indigo-500 opacity-80"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 rounded-full border-b-4 border-cyan-400 opacity-60"
                    />
                    <motion.div
                      animate={{ rotate: 180 }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-8 rounded-full border-r-2 border-slate-500 opacity-40"
                    />
                    {/* Pulsing Core */}
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-14 h-14 bg-indigo-500 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.9)] flex items-center justify-center"
                    >
                      <Signal className="w-7 h-7 text-white animate-pulse" />
                    </motion.div>
                  </div>
                  
                  <div className="w-full space-y-4">
                    <h3 className="text-xl font-bold text-indigo-300 uppercase tracking-widest animate-pulse">
                      Calibrating
                    </h3>
                    <div className="h-20 bg-slate-900/80 backdrop-blur-md rounded-xl flex flex-col items-center justify-center border border-white/10 px-4 shadow-inner">
                      <p className="text-slate-200 font-mono text-sm mb-1">
                        {scanText}
                      </p>
                      {accuracy !== null && (
                        <p className="text-emerald-400 font-mono text-xs font-bold animate-pulse">
                          Live Accuracy: ±{accuracy.toFixed(2)}m
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* RESULT STATE */}
              {scanState === "RESULT" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-6 w-full px-4"
                >
                  {result.isInside ? (
                    <>
                      <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                        <ShieldCheck className="w-12 h-12 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-emerald-400 mb-2">Inside Boundaries</h3>
                        <p className="text-slate-300">Point within boundaries</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center border border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.4)]">
                        <AlertTriangle className="w-12 h-12 text-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-rose-400 mb-2">Outside Boundaries</h3>
                        <p className="text-slate-300">Boundary violation detected</p>
                      </div>
                    </>
                  )}

                  <div className="w-full bg-slate-900/60 backdrop-blur-md p-5 rounded-xl border border-white/10 font-mono text-sm text-left mb-2 shadow-lg">
                    <div className="flex justify-between items-center text-slate-400 mb-2 pb-2 border-b border-white/5">
                      <span className="uppercase text-[10px] tracking-widest">Coordinates</span>
                      <Crosshair className="w-4 h-4" />
                    </div>
                    <div className="text-slate-300 mb-1">LAT: <span className="text-white font-bold">{result.coords[0].toFixed(6)}</span></div>
                    <div className="text-slate-300 mb-1">LNG: <span className="text-white font-bold">{result.coords[1].toFixed(6)}</span></div>
                    {accuracy !== null && (
                      <div className="text-slate-300">ACCURACY: <span className="text-emerald-400 font-bold">±{accuracy.toFixed(2)}m</span></div>
                    )}
                  </div>

                  <Button 
                    onClick={resetScan}
                    className="w-full h-14 bg-transparent border-2 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600 transition-colors rounded-xl font-bold"
                  >
                    <RefreshCcw className="w-5 h-5 mr-2" />
                    Reset & Rescan
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Right Panel: Map */}
        <div className="lg:col-span-7 h-[500px]">
          <Card className="h-full w-full overflow-hidden border border-slate-200 shadow-xl relative bg-slate-100 rounded-2xl">
            <MapWithNoSSR 
              plots={[MOCK_PLOT]} 
              userLocation={result ? result.coords : null}
            />
            
            {/* Overlay Glassmorphism Info */}
            <div className="absolute top-6 left-6 z-[400] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-slate-200 flex items-center gap-4">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <MapPinned className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Live Map</p>
                  <p className="text-sm font-black text-slate-900">RTK Polygon Viewer</p>
                </div>
              </div>
            </div>
            
            {/* Status Indicator */}
            {scanState === "SCANNING" && (
              <div className="absolute top-6 right-6 z-[400] pointer-events-none">
                <div className="bg-indigo-600/90 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-indigo-500 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Live Sync</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
