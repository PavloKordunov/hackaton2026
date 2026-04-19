"use client";

import {
  Map as MapIcon,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useRouter } from "next/navigation";

const METRIC_DATA = [
  {
    title: "Об'єкти",
    value: "3",
    trend: "+12%",
    trendColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    icon: MapIcon,
    color: "text-orange-600 bg-orange-50",
  },
  {
    title: "Нарахований податок",
    value: "8.7к",
    trend: "Заощаджено 2к",
    trendColor: "text-blue-600 bg-blue-50 border-blue-100",
    icon: CreditCard,
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Розбіжності",
    value: "2",
    trend: "Активно",
    trendColor: "text-amber-600 bg-amber-50 border-amber-100",
    icon: AlertCircle,
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Виправлено",
    value: "14",
    trend: "Всього",
    trendColor: "text-slate-600 bg-slate-50 border-slate-200",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50",
  },
];

export const DashboardView = () => {
  const router = useRouter();

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Метрики */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_DATA.map((item, index) => (
          <Card
            key={index}
            className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              {/* <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${item.trendColor}`}
              >
                {item.trend}
              </span> */}
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900">
                {item.value}
              </h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                {item.title}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Швидкий Доступ з Міні-Прев'ю */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Швидкі дії
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Керуйте вашими ділянками та податками в один клік
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Картка 1: Розбіжності */}
          <Card
            className="group flex flex-col p-5 border-none ring-1 ring-slate-200 hover:ring-amber-500/50 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer bg-white h-full"
            onClick={() => router.push("/discrepancies")}
          >
            {/* Міні-прев'ю: Список помилок */}
            <div className="h-32 w-full bg-gradient-to-br from-amber-50/80 to-orange-50/50 rounded-xl mb-6 p-4 border border-amber-100/50 relative overflow-hidden group-hover:border-amber-200 transition-colors">
              <div className="w-1/3 h-2 bg-amber-200/60 rounded-full mb-4" />
              <div className="space-y-2.5">
                {/* Рядок з помилкою (пульсує при наведенні) */}
                <div className="flex items-center gap-3 bg-white/80 p-2 rounded-lg shadow-sm border border-amber-100 group-hover:translate-x-1 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-red-400 group-hover:animate-pulse" />
                  <div className="w-1/2 h-1.5 bg-slate-200 rounded-full" />
                </div>
                {/* Валідний рядок */}
                <div className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-slate-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-400" />
                  <div className="w-2/3 h-1.5 bg-slate-200 rounded-full" />
                </div>
              </div>
              <AlertCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-amber-500/10 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex-1 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                Аналітика розбіжностей
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Система знайшла невідповідності у реєстрах. Виправте їх, щоб не
                переплачувати.
              </p>
            </div>
            <div className="mt-6 flex items-center text-amber-600 font-bold text-sm">
              <span>Перевірити зараз</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Картка 2: GPS/Карти */}
          <Card
            className="group flex flex-col p-5 border-none ring-1 ring-slate-200 hover:ring-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer bg-white h-full"
            onClick={() => router.push("/precise")}
          >
            {/* Міні-прев'ю: Карта та полігон */}
            <div className="h-32 w-full bg-gradient-to-br from-indigo-50/80 to-blue-50/50 rounded-xl mb-6 p-4 border border-indigo-100/50 relative overflow-hidden group-hover:border-indigo-200 transition-colors">
              {/* Сітка карти */}
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-3 gap-[1px] bg-indigo-200/30 p-[1px]">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="bg-indigo-50/80" />
                ))}
              </div>
              {/* Фігура ділянки */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12 border-[1.5px] border-indigo-500 bg-indigo-500/20 rounded-sm transform rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              {/* Пін (підстрибує при наведенні) */}
              <MapPin className="absolute top-1/3 left-1/2 w-5 h-5 text-indigo-600 -translate-x-1/2 -translate-y-1/2 drop-shadow-md group-hover:-translate-y-3 transition-transform duration-300" />
            </div>

            <div className="flex-1 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                Мої точні межі
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Завантажте GPS-дані або перегляньте знімки для підтвердження
                розміру ділянки.
              </p>
            </div>
            <div className="mt-6 flex items-center text-indigo-600 font-bold text-sm">
              <span>Відкрити карту</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>

          {/* Картка 3: Податки */}
          <Card
            className="group flex flex-col p-5 border-none ring-1 ring-slate-200 hover:ring-emerald-500/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 cursor-pointer bg-white h-full"
            onClick={() => router.push("/taxes")}
          >
            {/* Міні-прев'ю: Квитанція / Оплата */}
            <div className="h-32 w-full bg-gradient-to-br from-emerald-50/80 to-teal-50/50 rounded-xl mb-6 p-4 border border-emerald-100/50 relative overflow-hidden group-hover:border-emerald-200 transition-colors flex items-center justify-center">
              {/* Картка оплати (піднімається при наведенні) */}
              <div className="w-24 h-16 bg-white rounded-lg shadow-sm border border-emerald-100 p-2.5 relative group-hover:-translate-y-2 group-hover:rotate-3 transition-all duration-500 z-10">
                <div className="w-4 h-3 bg-emerald-100 rounded-[2px] mb-3" />
                <div className="space-y-1.5">
                  <div className="w-full h-1 bg-slate-100 rounded-full" />
                  <div className="w-2/3 h-1 bg-slate-100 rounded-full" />
                </div>
              </div>
              {/* Декоративна іконка успіху, що з'являється */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 scale-0 group-hover:scale-100 transition-transform duration-300 delay-75 z-20">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <CreditCard className="absolute -bottom-2 -left-2 w-20 h-20 text-emerald-500/10 group-hover:scale-110 transition-transform duration-500" />
            </div>

            <div className="flex-1 space-y-2">
              <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Податки та оплата
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Перегляд нарахованих квитанцій за період та оплата через
                Apple/Google Pay.
              </p>
            </div>
            <div className="mt-6 flex items-center text-emerald-600 font-bold text-sm">
              <span>Сплатити онлайн</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        </div>
      </div>

      {/* Таблиця залишається без змін (з минулого повідомлення) */}
      {/* <Card className="overflow-hidden border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Останні запити у роботі
          </h3>
          <Button
            variant="ghost"
            className="text-xs text-indigo-600 hover:bg-indigo-50"
          >
            Переглянути всі
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Об'єкт
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Розмір
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2].map((i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-inner flex-shrink-0">
                        <img
                          src={`https://picsum.photos/seed/${i * 12}/40/40`}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          alt=""
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-slate-800 truncate">
                          Зелена, {12 + i}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          Львівська область
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-lg border border-emerald-100 uppercase whitespace-nowrap">
                      Перевірено
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm text-slate-800 text-right whitespace-nowrap">
                    {600 + i * 20} м²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card> */}
    </div>
  );
};

export default DashboardView;
