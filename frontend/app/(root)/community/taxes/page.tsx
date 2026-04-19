"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Landmark,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui";
import {
  CommunitiesService,
  CommunityTax,
  PaginatedResponse,
} from "@/lib/communities-service";

export default function CommTaxesView() {
  const [taxes, setTaxes] = useState<CommunityTax[]>([]);
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
        const taxesResponse = await CommunitiesService.getTaxes(
          slug,
          page,
          limit,
        );
        setTaxes(taxesResponse.data);
        setTotalPages(taxesResponse.pagination.pages);
        setTotal(taxesResponse.pagination.total);
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
  }, [page]);

  const totalAnnualRevenue = taxes.reduce(
    (sum, tax) => sum + tax.annualRevenue,
    0,
  );
  const totalPayers = taxes.reduce((sum, tax) => sum + tax.payerCount, 0);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-100 h-40 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-100 h-64 rounded-2xl animate-pulse"
            />
          ))}
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
      <Card className="overflow-hidden border-slate-100 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 text-white shadow-xl">
        <div className="p-8 sm:p-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-[0.24em]">
              <CreditCard className="w-4 h-4" />
              Локальні податки громади
            </div>
            <div>
              <p className="text-indigo-100/70 text-sm mb-2">
                Орієнтовне річне надходження
              </p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight">
                {new Intl.NumberFormat("uk-UA").format(totalAnnualRevenue)} грн
              </h2>
            </div>
            <p className="text-slate-300 text-base leading-relaxed">
              Тут зібрані податки, які Червоноградська ОТГ адмініструє та за
              якими ми можемо показувати кількість платників і очікувані
              надходження.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 min-w-[280px]">
            <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Податків у кабінеті</p>
              <p className="text-3xl font-black mt-2">{taxes.length}</p>
            </div>
            <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
              <p className="text-sm text-slate-300">Усього платників</p>
              <p className="text-3xl font-black mt-2">{totalPayers}</p>
            </div>
          </div>
        </div>
      </Card>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {taxes.map((tax) => (
            <Card key={tax.id} className="p-6 border-slate-100 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[11px] uppercase tracking-[0.2em] font-bold">
                    <Landmark className="w-3.5 h-3.5" />
                    {tax.type}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mt-4">
                    {tax.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    {tax.description}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-50 text-emerald-600">
                  {tax.isActive ? "Активний" : "Неактивний"}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                    Ставка
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {tax.rate}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{tax.unit}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                    Платники
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-500" />
                    {tax.payerCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">
                    Надходження
                  </p>
                  <p className="text-lg font-bold text-slate-900 mt-2">
                    {new Intl.NumberFormat("uk-UA").format(tax.annualRevenue)}{" "}
                    грн
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
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
      </div>
    </div>
  );
}
