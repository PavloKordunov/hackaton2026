"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  Layers,
  Search,
  Filter,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { Card } from "@/components/ui";

const MapWithNoSSR = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 rounded-2xl border border-slate-800">
      <Layers className="animate-spin w-8 h-8 mr-2" />
      Loading Map Interface...
    </div>
  ),
});

const MOCK_PLOTS = [
  {
    id: "1",
    cadastralNumber: "4624884200:15:000:0956",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.448218, 24.187842],
      [50.448044, 24.187801],
      [50.448044, 24.187801],
      [50.447785, 24.190827],
      [50.448072, 24.190891],
    ],
    status: "Discrepancy",
    discrepancyType: "Самовільне захоплення (Encroachment)",
    discrepancy:
      "Фактичні межі ділянки зміщені на північний схід. Спостерігається накладання на сусідню територію.",
    color: "#f59e0b",
    fillOpacity: 0.5,
    actualCoordinates: [
      [50.448418, 24.187942],
      [50.448244, 24.187901],
      [50.448244, 24.187901],
      [50.447985, 24.190927],
      [50.448272, 24.190991],
    ],
  },
  {
    id: "2",
    cadastralNumber: "4624884200:06:000:0486",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.426283, 24.172519],
      [50.426235, 24.173002],
      [50.422247, 24.171097],
      [50.422263, 24.170602],
    ],
    status: "Verified",
    color: "#10b981",
    fillOpacity: 0.4,
  },
  {
    id: "3",
    cadastralNumber: "4624884200:19:004:0024",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.420708, 24.18828],
      [50.419316, 24.187904],
      [50.419273, 24.188376],
      [50.420656, 24.188767],
    ],
    status: "Verified",
    color: "#10b981",
    fillOpacity: 0.4,
  },
  {
    id: "4",
    cadastralNumber: "4624881300:08:000:0020",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.319224, 24.313249],
      [50.319195, 24.313369],
      [50.317793, 24.31263],
      [50.317817, 24.312503],
    ],
    status: "Verified",
    color: "#10b981",
    fillOpacity: 0.4,
  },
  {
    id: "5",
    cadastralNumber: "4624884200:08:000:0086",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.398199, 24.15032],
      [50.398166, 24.15073],
      [50.392571, 24.150982],
      [50.39282, 24.150549],
    ],
    status: "Discrepancy",
    discrepancyType: "Розбіжність площі (Area Mismatch)",
    discrepancy:
      "Фактична площа обробітку перевищує кадастрові межі, зачіпаючи дорогу.",
    color: "#ef4444",
    fillOpacity: 0.5,
    actualCoordinates: [
      [50.398399, 24.15022],
      [50.398366, 24.15083],
      [50.392471, 24.151182],
      [50.39262, 24.150449],
    ],
  },
  {
    id: "6",
    cadastralNumber: "4611800000:02:008:0043",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.397479, 24.234986],
      [50.397453, 24.235077],
      [50.397414, 24.235045],
      [50.39744, 24.234964],
    ],
    status: "Verified",
    color: "#10b981",
    fillOpacity: 0.4,
  },
  {
    id: "7",
    cadastralNumber: "4624884200:16:000:0195",
    owner: "Карпів Петро Іванович",
    coordinates: [
      [50.442895, 24.216017],
      [50.442895, 24.216184],
      [50.441855, 24.216005],
      [50.441847, 24.215826],
    ],
    status: "Verified",
    color: "#10b981",
    fillOpacity: 0.4,
  },
];

export default function DiscrepanciesPage() {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Discrepancy" | "Verified">(
    "All",
  );

  const filteredPlots = MOCK_PLOTS.filter((plot) => {
    if (filter === "All") return true;
    return plot.status === filter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold uppercase tracking-widest mb-2">
            <AlertCircle className="w-4 h-4" />
            Режим аудиту
          </div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            Аналіз розбіжностей земельних ділянок
          </h2>
          <p className="text-slate-500 mt-1">
            Виявити та усунути накладання меж, розбіжності площі та самовільні
            споруди.
          </p>
        </div>

        <div className="flex gap-2">
          {["All", "Discrepancy", "Verified"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 text-sm font-bold rounded-lg border transition-all ${
                filter === f
                  ? "bg-slate-900 text-white border-slate-900 shadow-md"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {f === "All"
                ? "Усі"
                : f === "Discrepancy"
                  ? "Розбіжності"
                  : "Перевірено"}
              {f === "Discrepancy" && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500 text-[10px] text-white">
                  3
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[750px]">
        {/* Left Sidebar: List of Plots */}
        <div className="xl:col-span-4 flex flex-col gap-4 overflow-hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Пошук по кадастровому номеру або власнику..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-medium"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar pb-4">
            {filteredPlots.map((plot, i) => {
              const isSelected = selectedPlotId === plot.id;
              const isDiscrepancy = plot.status === "Discrepancy";

              return (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={plot.id}
                >
                  <Card
                    onClick={() => setSelectedPlotId(plot.id)}
                    className={`cursor-pointer transition-all duration-300 overflow-hidden border-l-4 p-5 ${
                      isSelected
                        ? "bg-indigo-50/50 border-indigo-500 shadow-md ring-1 ring-indigo-500/20"
                        : "bg-white border-transparent hover:border-slate-300 hover:shadow-md"
                    } ${
                      isDiscrepancy && !isSelected
                        ? "border-l-rose-400"
                        : !isSelected
                          ? "border-l-emerald-400"
                          : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                          Кадастровий номер
                        </p>
                        <p className="font-mono text-sm font-bold text-slate-900">
                          {plot.cadastralNumber}
                        </p>
                      </div>
                      {isDiscrepancy ? (
                        <div className="bg-rose-100 text-rose-700 p-1.5 rounded-lg flex items-center gap-1 border border-rose-200">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase hidden sm:inline">
                            Потрібна дія
                          </span>
                        </div>
                      ) : (
                        <div className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg flex items-center gap-1 border border-emerald-200">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase hidden sm:inline">
                            Перевірено
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-slate-600">
                        <span className="font-semibold w-20">Власник:</span>
                        <span className="truncate">{plot.owner}</span>
                      </div>

                      {isDiscrepancy && (
                        <div className="mt-4 bg-rose-50 border border-rose-100 rounded-lg p-3">
                          <p className="text-xs font-bold text-rose-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            {plot.discrepancyType}
                          </p>
                          <p className="text-sm text-rose-700 leading-snug">
                            {plot.discrepancy}
                          </p>
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 pt-3 border-t border-indigo-100 flex items-center text-xs font-bold text-indigo-600 uppercase tracking-widest gap-1"
                      >
                        Перегляд на карті <ChevronRight className="w-3 h-3" />
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Map */}
        <div className="xl:col-span-8 h-full min-h-[500px]">
          <Card className="h-full w-full overflow-hidden border-2 border-slate-200 shadow-xl relative bg-slate-100 rounded-2xl group">
            <MapWithNoSSR
              plots={filteredPlots}
              selectedPlotId={selectedPlotId}
            />
            <div className="absolute top-4 left-4 z-[400] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-xl p-3 rounded-xl shadow-lg border border-slate-200 flex items-center gap-3">
                <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                  <Layers className="w-5 h-5 text-slate-700" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">
                    Шар
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    Кадастр vs Супутник
                  </p>
                </div>
              </div>
            </div>{" "}
          </Card>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `,
        }}
      />
    </div>
  );
}
