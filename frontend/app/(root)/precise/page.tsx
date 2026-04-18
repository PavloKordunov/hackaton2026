"use client";

import {
  Camera,
  MapPinned,
  Zap,
  Crosshair,
  Satellite,
  CheckCircle2,
  Focus,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button } from "@/components/ui";

export const PrecisePlotsView = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Ліва колонка: Контент та Дії */}
        <div className="xl:col-span-5 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2">
              <Satellite className="w-4 h-4" />
              GEO-Аналіз
            </div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 leading-[1.1]">
              Ваші точні <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
                фактичні межі
              </span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              Використовуйте супутникові дані та метадані фотографій для
              автоматичного зіставлення реальних меж з кадастровим реєстром.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Інструмент 1 */}
            <Card className="group relative p-6 border-2 border-transparent ring-1 ring-slate-200 hover:ring-indigo-500 hover:border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 cursor-pointer overflow-hidden transition-all duration-300 bg-white">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Camera className="w-16 h-16 -mr-4 -mt-4 text-indigo-900" />
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-300">
                <Camera className="w-6 h-6 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors">
                Фото з GPS
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Завантажте фото ділянки, система сама витягне координати.
              </p>
            </Card>

            {/* Інструмент 2 */}
            <Card className="group relative p-6 border-2 border-transparent ring-1 ring-slate-200 hover:ring-violet-500 hover:border-violet-100 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 cursor-pointer overflow-hidden transition-all duration-300 bg-white">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MapPinned className="w-16 h-16 -mr-4 -mt-4 text-violet-900" />
              </div>
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-violet-600 transition-all duration-300">
                <MapPinned className="w-6 h-6 text-violet-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 group-hover:text-violet-700 transition-colors">
                Малювання меж
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Вкажіть точний контур вручну на супутниковому знімку.
              </p>
            </Card>
          </div>

          <Button className="w-full h-14 text-lg font-bold rounded-xl flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
            <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
            Розпочати аналіз
          </Button>
        </div>

        {/* Права колонка: Інтерактивна Мапа */}
        <div className="xl:col-span-7">
          <Card className="relative h-[550px] bg-slate-950 overflow-hidden rounded-2xl border-slate-200 shadow-2xl shadow-indigo-500/10 group">
            {/* Супутниковий знімок */}
            <img
              src="https://picsum.photos/seed/satellite123/1200/1000"
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000"
              alt="Satellite View"
              referrerPolicy="no-referrer"
            />

            {/* Сітка координат поверх карти */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Відмальований полігон (ділянка) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient
                  id="polyGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="rgba(79, 70, 229, 0.4)" />
                  <stop offset="100%" stopColor="rgba(124, 58, 237, 0.1)" />
                </linearGradient>
              </defs>
              <polygon
                points="200,150 450,120 500,350 180,400"
                className="fill-[url(#polyGrad)] stroke-indigo-400 stroke-[3] stroke-dasharray-4 animate-pulse"
              />
              {/* Точки (піни) на кутах */}
              <circle
                cx="200"
                cy="150"
                r="6"
                className="fill-white stroke-indigo-500 stroke-[3]"
              />
              <circle
                cx="450"
                cy="120"
                r="6"
                className="fill-white stroke-indigo-500 stroke-[3]"
              />
              <circle
                cx="500"
                cy="350"
                r="6"
                className="fill-white stroke-indigo-500 stroke-[3]"
              />
              <circle
                cx="180"
                cy="400"
                r="6"
                className="fill-white stroke-indigo-500 stroke-[3]"
              />
            </svg>

            {/* Анімований "лазер" сканера */}
            <motion.div
              className="absolute left-0 right-0 h-1 bg-indigo-400 shadow-[0_0_20px_4px_rgba(99,102,241,0.5)] z-20 pointer-events-none opacity-50"
              animate={{ top: ["0%", "100%", "0%"] }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
            />

            {/* UI Мапи: Верхня панель статусів (Glassmorphism) */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-30 pointer-events-none">
              {/* Статус GPS */}
              <div className="bg-slate-900/60 backdrop-blur-md p-3 rounded-xl border border-white/10 shadow-lg flex items-center gap-3">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20">
                  <div className="absolute w-full h-full rounded-full border border-emerald-500/50 animate-ping" />
                  <Crosshair className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mb-0.5">
                    Сигнал GPS
                  </p>
                  <p className="text-white text-sm font-bold tracking-tight">
                    Висока точність (±0.4м)
                  </p>
                </div>
              </div>

              {/* Інструменти карти */}
              <div className="flex flex-col gap-2">
                <div className="w-10 h-10 bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-center text-white hover:bg-slate-800 transition-colors pointer-events-auto cursor-pointer">
                  <Focus className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* UI Мапи: Нижня панель результату (Поп-ап) */}
            <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-xl mt-1 sm:mt-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1 tracking-tight">
                      Аналіз завершено
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                      Фактичні межі збігаються з реєстром на{" "}
                      <span className="text-white font-bold">98%</span>.
                      Виявлено незначну розбіжність (
                      <span className="text-rose-400 font-bold">+42 м²</span>)
                      біля північної межі.
                    </p>
                  </div>
                </div>

                <Button className="w-full sm:w-auto pointer-events-auto bg-white hover:bg-slate-100 text-slate-900 font-bold border-0 shadow-lg">
                  Переглянути звіт
                </Button>
              </motion.div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrecisePlotsView;
