"use client";

import { Camera, MapPinned, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Button } from "@/components/ui";

const PrecisePlotsView = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-4xl font-black tracking-tighter leading-[0.9] text-slate-800 uppercase">
          Ваші точні
          <br />
          <span className="text-indigo-600">межі</span>
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          Система «Точні шматки» дозволяє порівняти фактичні межі з реєстром за
          допомогою GPS-фото.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="p-4 border-2 border-dashed border-indigo-100 hover:border-indigo-300 cursor-pointer group transition-all">
            <Camera className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold">Фото з GPS</h4>
            <p className="text-xs text-slate-400">
              Автоматичне порівняння координат
            </p>
          </Card>
          <Card className="p-4 border-2 border-dashed border-indigo-100 hover:border-indigo-300 cursor-pointer group transition-all">
            <MapPinned className="w-8 h-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
            <h4 className="font-bold">Малювання меж</h4>
            <p className="text-xs text-slate-400">Вкажіть точні межі вручну</p>
          </Card>
        </div>
        <Button className="w-full py-4 text-lg rounded-xl flex items-center justify-center gap-3">
          <Zap className="fill-white" /> Перевірити мій шматок
        </Button>
      </div>
      <Card className="relative min-h-[400px] bg-slate-900 overflow-hidden group">
        <img
          src="https://picsum.photos/seed/sat/1000/1000"
          className="w-full h-full object-cover opacity-50 grayscale"
          alt="Satellite View"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 self-start">
            <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">
              GPS Позиція
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white text-sm font-bold tracking-tight">
                Висока точність (±0.4м)
              </span>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500 p-5 rounded-xl text-white shadow-2xl shadow-emerald-500/40"
          >
            <p className="font-bold mb-1 tracking-tight">Результат перевірки</p>
            <p className="text-sm opacity-90 leading-snug">
              Ваш шматок збігається на 98%. Виявлено розбіжність у 42 м² біля
              північної межі.
            </p>
          </motion.div>
        </div>
      </Card>
    </div>
  </div>
);

export default PrecisePlotsView;
