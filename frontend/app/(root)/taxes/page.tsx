"use client";

import {
  Receipt,
  CreditCard,
  Home,
  Map as MapIcon,
  CheckCircle2,
  Smile,
  CalendarCheck,
} from "lucide-react";
import { Card, Button } from "@/components/ui";

export const TaxesView = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Дружня головна картка */}
      <Card className="overflow-hidden border-indigo-100 shadow-xl shadow-indigo-100/70 bg-white relative">
        {/* Легкий декоративний фон, не перебиває текст */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="relative z-10 p-8 sm:p-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-full">
                <CalendarCheck className="w-4 h-4" />
                Оновлено сьогодні
              </div>

              <div>
                <h2 className="text-slate-500 text-lg mb-1">
                  Ваші податки на майно за 2024 рік
                </h2>
                <div className="flex items-baseline justify-center md:justify-start gap-2">
                  <span className="text-5xl sm:text-6xl font-extrabold text-slate-800 tracking-tight">
                    8 740
                  </span>
                  <span className="text-2xl font-bold text-slate-400">грн</span>
                </div>
              </div>

              {/* Людське пояснення економії */}
              <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50 max-w-md">
                <Smile className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p className="text-sm text-slate-600 leading-relaxed">
                  Гарні новини! Завдяки уточненню площі ділянки, ми законно{" "}
                  <span className="font-bold text-indigo-700">
                    зменшили цю суму на 2 340 грн
                  </span>
                  . Більше ви не переплачуєте.
                </p>
              </div>
            </div>

            {/* Прості, зрозумілі дії */}
            <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
              <Button className="h-14 px-8 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 rounded-xl transition-transform hover:-translate-y-0.5">
                <CreditCard className="w-5 h-5" />
                Сплатити 8 740 грн
              </Button>
              <Button
                variant="outline"
                className="h-14 px-6 text-base font-medium text-slate-600 border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2 rounded-xl"
              >
                <Receipt className="w-5 h-5" />
                Завантажити квитанцію
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* За що я плачу? */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 px-1">
            За що нараховано?
          </h3>

          <div className="space-y-3">
            {/* Нерухомість */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Житловий будинок</p>
                  <p className="text-xs text-slate-500">
                    780 м², вул. Зелена, 12
                  </p>
                </div>
              </div>
              <p className="font-bold text-slate-800">5 340 ₴</p>
            </div>

            {/* Земля */}
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-lg hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MapIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Земельні ділянки</p>
                  <p className="text-xs text-slate-500">2 об'єкти, 0.26 га</p>
                </div>
              </div>
              <p className="font-bold text-slate-800">3 400 ₴</p>
            </div>
          </div>
        </div>

        {/* Минулі платежі */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-800 px-1">
            Минулі платежі
          </h3>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden">
            <div className="divide-y divide-slate-50">
              {[
                {
                  year: "За 2023 рік",
                  date: "12 березня 2023",
                  amount: "8 400 ₴",
                },
                {
                  year: "За 2022 рік",
                  date: "14 березня 2022",
                  amount: "8 400 ₴",
                },
                {
                  year: "За 2021 рік",
                  date: "10 березня 2021",
                  amount: "8 400 ₴",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-800 text-sm">
                      {item.year}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Сплачено {item.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-sm">
                      {item.amount}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" /> Успішно
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors bg-slate-50/50">
              Показати старіші
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxesView;
