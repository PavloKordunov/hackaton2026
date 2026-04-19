"use client";

import { useMemo, useState } from "react";
import { Filter, MapPinned, Search } from "lucide-react";
import { Card } from "@/components/ui";
import { communityPlots, communityProfile } from "@/lib/community-demo";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-600",
  leased: "bg-blue-50 text-blue-600",
  pending: "bg-amber-50 text-amber-600",
};

const statusLabels: Record<string, string> = {
  active: "активна",
  leased: "в оренді",
  pending: "очікує",
};

export default function CommunityPlotsPage() {
  const [search, setSearch] = useState("");
  const [settlement, setSettlement] = useState("all");

  const filteredPlots = useMemo(() => {
    return communityPlots.filter((plot) => {
      const matchesSettlement =
        settlement === "all" || plot.settlementName === settlement;
      const haystack = [
        plot.cadastralNumber,
        plot.ownerName,
        plot.location,
        plot.settlementName,
      ]
        .join(" ")
        .toLowerCase();

      return matchesSettlement && haystack.includes(search.toLowerCase());
    });
  }, [search, settlement]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Список земельних ділянок громади
          </h1>
          <p className="text-slate-500 mt-2 max-w-3xl">
            Тут можна фільтрувати ділянки, які належать до Червоноградської ОТГ,
            з урахуванням населених пунктів, що входять до громади.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold">
          <MapPinned className="w-4 h-4" />
          {filteredPlots.length} ділянок у вибірці
        </div>
      </div>

      <Card className="p-5 border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-4">
          <label className="relative block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук по кадастровому номеру, власнику або локації"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="relative block">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={settlement}
              onChange={(e) => setSettlement(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
            >
              <option value="all">Усі населені пункти</option>
              {communityProfile.settlements.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.8fr] gap-6">
        <Card className="overflow-hidden border-slate-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Кадастр
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Населений пункт
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Власник
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Площа
                  </th>
                  <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-slate-400">
                    Статус
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlots.map((plot) => (
                  <tr key={plot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">{plot.cadastralNumber}</p>
                      <p className="text-xs text-slate-400 mt-1">{plot.location}</p>
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {plot.settlementName}
                    </td>
                    <td className="px-6 py-5 text-sm text-slate-600">
                      {plot.ownerName}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900">
                      {plot.areaHa} га
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusStyles[plot.status]}`}
                      >
                        {statusLabels[plot.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">
            Населені пункти громади
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Ці села, міста та селища входять до Червоноградської ОТГ і
            використовуються для фільтрації ділянок.
          </p>
          <div className="mt-6 space-y-3">
            {communityProfile.settlements.map((item) => {
              const count = communityPlots.filter(
                (plot) => plot.settlementName === item,
              ).length;

              return (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item}</p>
                    <p className="text-xs text-slate-400 mt-1">У складі громади</p>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
