"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Filter,
  MapPinned,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import { CommunitiesService, CommunityPlot } from "@/lib/communities-service";

const mockedSettlements = [
  "м. Червоноград",
  "м. Соснівка",
  "смт Гірник",
  "с. Сілець",
  "с. Острів",
  "с. Добрячин",
  "с. Волсвин",
  "с. Городище",
];

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
  const [plots, setPlots] = useState<CommunityPlot[]>([]);
  const [settlements, setSettlements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const slug = "chervonohrad";
        const actualSettlement = settlement !== "all" ? settlement : undefined;

        // Створюємо масив промісів
        const promises: Promise<any>[] = [
          CommunitiesService.getPlots(slug, actualSettlement, page, limit),
        ];

        // Якщо це перше завантаження, додаємо паралельний запит для списку сіл
        const isFirstLoad =
          page === 1 && settlement === "all" && settlements.length === 0;
        if (isFirstLoad) {
          // Збільшив ліміт, щоб витягнути більше сіл для дропдауну
          promises.push(CommunitiesService.getPlots(slug, undefined, 1, 5));
        }

        // Виконуємо всі запити ОДНОЧАСНО
        const results = await Promise.all(promises);

        const plotsResponse = results[0];
        setPlots(plotsResponse.data);
        setTotalPages(plotsResponse.pagination.pages);
        setTotal(plotsResponse.pagination.total);

        // Якщо був другий запит, обробляємо його
        if (isFirstLoad && results[1]) {
          const initialResponse = results[1];
          const uniqueSettlements = Array.from(
            new Set(
              initialResponse.data.map((plot: any) => plot.settlementName),
            ),
          ).sort() as string[];
          setSettlements(uniqueSettlements);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Сталася помилка при завантаженні даних",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, settlement]); // settlements.length прибрано з залежностей свідомо

  const filteredPlots = useMemo(() => {
    return plots.filter((plot) => {
      const haystack = [
        plot.cadastralNumber,
        plot.ownerName,
        plot.location,
        plot.settlementName,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(search.toLowerCase());
    });
  }, [search, plots]);

  const handleSettlementChange = (value: string) => {
    setSettlement(value);
    setPage(1); // Reset to first page when changing settlement
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Скелет хедера */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 w-full max-w-3xl">
            <div className="h-9 w-3/4 md:w-96 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-4 w-full md:w-[600px] bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-48 bg-indigo-50/50 rounded-full animate-pulse" />
        </div>

        {/* Скелет фільтрів */}
        <Card className="p-5 border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-4">
            <div className="h-12 bg-slate-100/80 rounded-2xl animate-pulse" />
            <div className="h-12 bg-slate-100/80 rounded-2xl animate-pulse" />
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_0.8fr] gap-6">
          {/* Скелет таблиці */}
          <Card className="overflow-hidden border-slate-100 shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <div className="flex justify-between">
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 rounded animate-pulse hidden md:block" />
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Генеруємо 5 фейкових рядків */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="px-6 py-5 flex items-center justify-between"
                >
                  <div className="space-y-2 w-1/4">
                    <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse hidden md:block" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                  <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </Card>

          {/* Скелет бокової панелі (населені пункти) */}
          <Card className="p-6 border-slate-100 shadow-sm">
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-full bg-slate-100 rounded animate-pulse mb-6" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center rounded-2xl bg-slate-50 px-4 py-4"
                >
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
        <p className="font-bold">Помилка при завантаженні даних</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

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
              onChange={(e) => handleSettlementChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 appearance-none"
            >
              <option value="all">Усі населені пункти</option>
              {settlements.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_0.8fr] gap-6">
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
                  <tr
                    key={plot.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900">
                        {plot.cadastralNumber}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {plot.location}
                      </p>
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

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="text-sm text-slate-600">
              Сторінка {page} з {totalPages} • Всього: {total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-100 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">
            Населені пункти громади
          </h2>
          <p className="text-sm text-slate-500 mt-2 ">
            Ці села, міста та селища входять до Червоноградської ОТГ і
            використовуються для фільтрації ділянок.
          </p>
          <div className="mt-6 space-y-3">
            {mockedSettlements.map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-slate-900">{item}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    У складі громади
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
