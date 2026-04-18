"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Card, Button } from "@/components/ui";

const MOCK_DISCREPANCIES: any[] = [
  {
    id: "d1",
    title: "Розбіжність площі будівлі",
    location: "Львів, вул. Зелена, 12",
    registryValue: "620 м²",
    realValue: "780 м²",
    severity: "error",
    coords: { x: 45, y: 30 },
  },
  {
    id: "d2",
    title: "Межі земельної ділянки",
    location: "Львівська обл., Пустомити",
    registryValue: "0.12 га",
    realValue: "0.14 га",
    severity: "warning",
    coords: { x: 70, y: 60 },
  },
];

export const DiscrepanciesView = () => {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <Card className="relative h-[500px] overflow-hidden">
          <img
            src="https://picsum.photos/seed/mapview/1000/1000"
            className="w-full h-full object-cover opacity-40 grayscale contrast-125"
            alt="Map Preview"
            referrerPolicy="no-referrer"
          />
          {MOCK_DISCREPANCIES.map((d) => (
            <motion.button
              key={d.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSelected(d)}
              style={{ left: `${d.coords.x}%`, top: `${d.coords.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div
                className={`p-2 rounded-full shadow-lg border-4 border-white ${d.severity === "error" ? "bg-rose-500" : "bg-amber-500"}`}
              >
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          ))}
        </Card>
        <div className="space-y-4">
          <h3 className="text-xl font-bold px-1 tracking-tight">
            Активні розбіжності
          </h3>
          {MOCK_DISCREPANCIES.map((d) => (
            <Card
              key={d.id}
              className={`p-4 cursor-pointer hover:border-indigo-200 transition-colors ${selected?.id === d.id ? "border-indigo-600 ring-1 ring-indigo-600" : ""}`}
              onClick={() => setSelected(d)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${d.severity === "error" ? "bg-rose-50 text-rose-500" : "bg-amber-50 text-amber-500"}`}
                  >
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{d.title}</h4>
                    <p className="text-xs text-slate-400">{d.location}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="lg:col-span-1">
        {selected ? (
          <Card className="p-6 sticky top-24 border-indigo-100 bg-indigo-50/10">
            <h3 className="text-lg font-bold mb-4">Деталі проблеми</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 mb-1 leading-none uppercase font-bold tracking-widest">
                  Тип
                </p>
                <p className="text-sm font-medium">
                  Невідповідність площі ({selected.registryValue} vs{" "}
                  {selected.realValue})
                </p>
              </div>
              <Button className="w-full">Подати заяву на виправлення</Button>
              <Button variant="outline" className="w-full">
                Завантажити доказ (Фото/Відео)
              </Button>
              <div className="p-4 bg-indigo-600 rounded-xl text-white">
                <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">
                  AI Підказка
                </p>
                <p className="text-sm">
                  Виправлення цієї помилки зменшить ваші річні податки на{" "}
                  <span className="underline font-bold tracking-tight">
                    2 340 грн
                  </span>
                  .
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <div className="h-full min-h-[300px] flex items-center justify-center p-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 text-center text-sm font-medium">
              Оберіть об'єкт на карті для перегляду деталей
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscrepanciesView;
