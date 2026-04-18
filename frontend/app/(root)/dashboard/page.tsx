"use client";

import {
  Map as MapIcon,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useRouter } from "next/navigation";

const METRIC_DATA: any[] = [
  {
    title: "Об'єкти",
    value: "3",
    trend: "+12%",
    icon: MapIcon,
    color: "bg-orange-500",
  },
  {
    title: "Нарахований податок",
    value: "8.7к",
    trend: "Заощаджено 2к",
    icon: CreditCard,
    color: "bg-blue-500",
  },
  {
    title: "Розбіжності",
    value: "2",
    trend: "Активно",
    icon: AlertCircle,
    color: "bg-amber-500",
  },
  {
    title: "Виправлено",
    value: "14",
    trend: "Всього",
    icon: CheckCircle2,
    color: "bg-emerald-500",
  },
];

export const DashboardView = () => {
  const router = useRouter();
  return (
    <div className="space-y-8">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRIC_DATA.map((item, index) => (
          <Card
            key={index}
            className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-4 rounded-xl ${item.color} text-white shrink-0`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-slate-800 tracking-tight truncate">
                  {item.value}
                </span>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">
                  {item.trend}
                </span>
              </div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider truncate">
                {item.title}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Section Previews */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 tracking-tight mb-4">
          Швидкий доступ до розділів
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="p-6 border-l-4 border-amber-500 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => router.push("/discrepancies")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertCircle className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">
              Аналітика розбіжностей
            </h4>
            <p className="text-sm text-slate-500 leading-snug">
              Перевірте та виправте невідповідності у реєстрах для зменшення
              податків.
            </p>
          </Card>

          <Card
            className="p-6 border-l-4 border-indigo-500 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => router.push("/precise")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <MapIcon className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Мої точні шматки</h4>
            <p className="text-sm text-slate-500 leading-snug">
              Використовуйте GPS-координати для підтвердження реальних меж вашої
              ділянки.
            </p>
          </Card>

          <Card
            className="p-6 border-l-4 border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
            onClick={() => router.push("/taxes")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <CreditCard className="w-6 h-6" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </div>
            <h4 className="font-bold text-slate-800 mb-1">Податки та оплата</h4>
            <p className="text-sm text-slate-500 leading-snug">
              Переглядайте актуальні нарахування та сплачуйте податки онлайн без
              черг.
            </p>
          </Card>
        </div>
      </div>

      {/* Recent Requests Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            Останні запити у роботі
          </h3>
          <Button variant="ghost" className="text-xs">
            Переглянути всі
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Об'єкт
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Розмір
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[1, 2].map((i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://picsum.photos/seed/${i * 10}/40/40`}
                        className="w-10 h-10 rounded-lg object-cover"
                        alt=""
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate text-slate-800">
                          Зелена, {12 + i}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          Львівська область
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    Житловий будинок
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded uppercase">
                      Перевірено
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm tracking-tight text-slate-800">
                    {600 + i * 20} м²
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default DashboardView;
