"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  MapPin,
  Sparkles,
  Scale,
  Camera,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

const MOCK_DISCREPANCIES = [
  {
    id: "d1",
    title: "Розбіжність площі будівлі",
    location: "Львів, вул. Зелена, 12",
    registryValue: "620",
    realValue: "780",
    unit: "м²",
    diff: "+160 м²",
    severity: "error", // Критична помилка
    coords: { x: 45, y: 35 },
    taxImpact: "2 340 грн",
  },
  {
    id: "d2",
    title: "Межі земельної ділянки",
    location: "Львівська обл., Пустомити",
    registryValue: "0.12",
    realValue: "0.14",
    unit: "га",
    diff: "+0.02 га",
    severity: "warning", // Попередження
    coords: { x: 70, y: 60 },
    taxImpact: "850 грн",
  },
];

export const DiscrepanciesView = () => {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-700">
      {/* Головна колонка: Карта та Список */}
      <div className="xl:col-span-2 space-y-8">
        {/* Карта з пульсуючими маркерами */}
        <Card className="relative h-[450px] overflow-hidden border-slate-200 shadow-sm group">
          {/* Декоративний градієнт-оверлей для кращого контрасту маркерів */}
          <div className="absolute inset-0 bg-slate-900/10 mix-blend-multiply z-0 pointer-events-none transition-opacity duration-500 group-hover:opacity-0" />

          <img
            src="https://picsum.photos/seed/mapview99/1200/600"
            className="w-full h-full object-cover opacity-60 grayscale contrast-125 transition-transform duration-1000 group-hover:scale-105"
            alt="Map Preview"
            referrerPolicy="no-referrer"
          />

          {MOCK_DISCREPANCIES.map((d) => (
            <motion.div
              key={d.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              style={{ left: `${d.coords.x}%`, top: `${d.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center cursor-pointer"
              onClick={() => setSelected(d)}
            >
              {/* Пульсуюче кільце */}
              <div
                className={`absolute w-12 h-12 rounded-full opacity-40 animate-ping ${
                  d.severity === "error" ? "bg-rose-500" : "bg-amber-500"
                }`}
              />
              {/* Сам маркер */}
              <div
                className={`relative p-2.5 rounded-full shadow-xl border-2 border-white transition-transform duration-300 hover:scale-110 ${
                  selected?.id === d.id
                    ? "bg-indigo-600 scale-110 ring-4 ring-indigo-600/20"
                    : d.severity === "error"
                      ? "bg-rose-500"
                      : "bg-amber-500"
                }`}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          ))}
        </Card>

        {/* Список розбіжностей */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Знайдені розбіжності
            </h3>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {MOCK_DISCREPANCIES.length} знайдено
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_DISCREPANCIES.map((d) => (
              <Card
                key={d.id}
                className={`p-5 cursor-pointer transition-all duration-300 group ${
                  selected?.id === d.id
                    ? "border-indigo-600 ring-1 ring-indigo-600 shadow-md bg-indigo-50/10"
                    : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                }`}
                onClick={() => setSelected(d)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl shrink-0 transition-colors ${
                        d.severity === "error"
                          ? "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                          : "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                      }`}
                    >
                      {d.severity === "error" ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {d.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {d.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Міні-дашборд всередині картки */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {d.registryValue}
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-sm font-bold text-indigo-600">
                      {d.realValue} {d.unit}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                      d.severity === "error"
                        ? "bg-rose-50 text-rose-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {d.diff}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Бокова колонка: Деталі (Sticky) */}
      <div className="xl:col-span-1 relative">
        <div className="sticky top-8">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 border-slate-200 shadow-xl shadow-slate-200/40 bg-white">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Деталі проблеми
                    </h3>
                  </div>

                  <div className="space-y-6">
                    {/* Блок порівняння */}
                    <div className="bg-slate-50 rounded-xl p-1 grid grid-cols-2 gap-1 border border-slate-100">
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                          В реєстрі
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          {selected.registryValue}{" "}
                          <span className="text-sm text-slate-500 font-medium">
                            {selected.unit}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 ring-1 ring-indigo-50">
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mb-1">
                          Фактично
                        </p>
                        <p className="text-lg font-bold text-indigo-600">
                          {selected.realValue}{" "}
                          <span className="text-sm opacity-80 font-medium">
                            {selected.unit}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* AI Підказка (Преміум стиль) */}
                    <div className="p-5 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                      <div className="flex items-center gap-2 mb-2 relative z-10">
                        <Sparkles className="w-4 h-4 text-indigo-200" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">
                          AI Аналіз
                        </p>
                      </div>
                      <p className="text-sm leading-relaxed relative z-10 text-indigo-50">
                        Виправлення цієї помилки у реєстрі дозволить законно
                        зменшити податкове навантаження на{" "}
                        <span className="font-bold text-white text-base bg-indigo-900/40 px-1.5 py-0.5 rounded ml-1">
                          {selected.taxImpact}
                        </span>{" "}
                        на рік.
                      </p>
                    </div>

                    {/* Кнопки дій */}
                    <div className="space-y-3 pt-2">
                      <Button className="w-full h-12 text-sm font-bold shadow-md shadow-slate-200/50 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-transform">
                        <FileText className="w-4 h-4" />
                        Подати заяву на виправлення
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full h-12 text-sm font-bold text-slate-600 border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Завантажити докази
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="h-[400px] flex flex-col items-center justify-center p-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-slate-100">
                    <MapPin className="w-6 h-6 text-slate-300" />
                  </div>
                  <h4 className="text-slate-700 font-bold mb-2">
                    Оберіть об'єкт
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">
                    Натисніть на маркер на карті або оберіть пункт зі списку,
                    щоб переглянути деталі та можливу економію.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DiscrepanciesView;
