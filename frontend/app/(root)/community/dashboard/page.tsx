"use client";

import {
  ArrowRight,
  Building2,
  CreditCard,
  Landmark,
  Map as MapIcon,
  MapPin,
} from "lucide-react";
import { Button, Card } from "@/components/ui";
import Link from "next/link";
import {
  CommunitiesService,
  CommunityDashboard,
  CommunityPlot,
  CommunityTax,
} from "@/lib/communities-service";
import { useEffect, useState } from "react";

export default function CommDashboardView() {
  const [dashboard, setDashboard] = useState<CommunityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const slug = "chervonohrad";
        // Тепер ми робимо ТІЛЬКИ ОДИН запит! Всі підрахунки вже зроблені на бекенді.
        const dashboardData = await CommunitiesService.getDashboard(slug);
        setDashboard(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Помилка завантаження");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* Секція 1: Головний банер та Надходження */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
          <Card className="p-8 border-none bg-slate-100/80 animate-pulse min-h-[300px] flex flex-col justify-between">
            <div className="w-32 h-6 bg-slate-200 rounded-full" />
            <div className="space-y-4 my-8">
              <div className="w-3/4 h-10 bg-slate-200 rounded-lg" />
              <div className="w-1/2 h-4 bg-slate-200 rounded" />
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="w-36 h-10 bg-slate-200 rounded-2xl" />
              <div className="w-36 h-10 bg-slate-200 rounded-2xl" />
              <div className="w-36 h-10 bg-slate-200 rounded-2xl" />
            </div>
          </Card>

          <Card className="p-6 border-slate-100 shadow-sm flex flex-col justify-between min-h-[300px]">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="space-y-2">
                <div className="w-24 h-3 bg-slate-100 rounded animate-pulse" />
                <div className="w-40 h-8 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-3 mt-6">
              <div className="w-full h-3 bg-slate-100 rounded animate-pulse" />
              <div className="w-4/5 h-3 bg-slate-100 rounded animate-pulse" />
              <div className="w-2/3 h-3 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="w-32 h-4 bg-slate-200 rounded animate-pulse mt-auto" />
          </Card>
        </section>

        {/* Секція 2: 4 маленькі картки метрик */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card
              key={i}
              className="p-6 border-slate-100 shadow-sm h-[160px] flex flex-col justify-between"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="w-16 h-8 bg-slate-200 rounded animate-pulse" />
                <div className="w-24 h-3 bg-slate-100 rounded animate-pulse" />
                <div className="w-32 h-2 bg-slate-100/50 rounded animate-pulse" />
              </div>
            </Card>
          ))}
        </div>

        {/* Секція 3: Списки (Населені пункти та Ділянки) */}
        <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6">
          <Card className="overflow-hidden border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="space-y-2">
                <div className="w-48 h-5 bg-slate-200 rounded animate-pulse" />
                <div className="w-64 h-3 bg-slate-100 rounded animate-pulse hidden sm:block" />
              </div>
              <div className="w-20 h-6 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 p-4 bg-slate-50/70 space-y-2"
                >
                  <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-slate-100 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </Card>

          {/* Навіть якщо цей блок у вас закоментований, скелет для нього створить гарний баланс під час завантаження */}
          <Card className="overflow-hidden border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <div className="w-48 h-5 bg-slate-200 rounded animate-pulse" />
              <div className="w-20 h-4 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="divide-y divide-slate-100">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="p-5 flex justify-between items-start">
                  <div className="space-y-3 w-full">
                    <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="w-48 h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="w-24 h-3 bg-slate-100 rounded animate-pulse" />
                  </div>
                  <div className="w-16 h-6 bg-slate-100 rounded-full animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    );
  }

  if (error || !dashboard) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
        <p className="font-bold">Помилка при завантаженні даних</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  const { totalAnnualRevenue, metrics, settlements } = dashboard;

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6">
        <Card className="p-8 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white border-none shadow-2xl shadow-indigo-950/20 overflow-hidden relative">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_60%)]" />
          <div className="relative z-10 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] uppercase tracking-[0.24em] font-bold">
              <Building2 className="w-4 h-4" />
              Аккаунт громади
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight max-w-3xl">
                {dashboard.name}
              </h1>
              <p className="text-indigo-100/80 text-base mt-3 max-w-2xl">
                Кабінет для моніторингу земельних ділянок, локальних податків і
                населених пунктів громади.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                Центр громади:{" "}
                <span className="font-bold">{dashboard.center}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                Район: <span className="font-bold">{dashboard.district}</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10">
                Область: <span className="font-bold">{dashboard.region}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400 font-bold">
                Надходження
              </p>
              <h2 className="text-2xl font-black text-slate-900">
                {new Intl.NumberFormat("uk-UA").format(totalAnnualRevenue)} грн
              </h2>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Орієнтовне річне надходження від локальних податків і зборів...
          </p>
          <Link
            href="/community/taxes"
            className="mt-6 inline-flex items-center text-sm font-bold text-indigo-600"
          >
            Перейти до податків <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Card>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item, index) => (
          <Card
            key={index}
            className="p-6 border-slate-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 rounded-xl text-indigo-600 bg-indigo-50">
                {item.label === "Ділянки" ? (
                  <MapIcon className="w-5 h-5" />
                ) : item.label === "Податки" ? (
                  <CreditCard className="w-5 h-5" />
                ) : item.label === "Платники" ? (
                  <Landmark className="w-5 h-5" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl font-bold text-slate-900">
                {item.value}
              </h3>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                {item.label}
              </p>
              <p className="text-sm text-slate-400 pt-1">{item.helperText}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr] gap-6"> */}
      <Card className="overflow-hidden border-slate-100 shadow-sm">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Населені пункти громади
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Склад громади для подальшої фільтрації ділянок.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-xs text-indigo-600 hover:bg-indigo-50"
          >
            {dashboard.settlements.length} одиниць
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
          {settlements.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-slate-100 p-4 bg-slate-50/70"
            >
              <p className="font-bold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500 mt-1">
                Ділянок у реєстрі: {item.plotCount}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* <Card className="overflow-hidden border-slate-100 shadow-sm">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">
              Останні ділянки громади
            </h3>
            <Link
              href="/community/plots"
              className="text-sm font-bold text-indigo-600"
            >
              Всі ділянки
            </Link>
          </div>
          {/* <div className="divide-y divide-slate-100">
            {plots.slice(0, 4).map((plot) => (
              <div key={plot.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900">
                      {plot.cadastralNumber}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {plot.settlementName}, {plot.location}
                    </p>
                    <p className="text-sm text-slate-400 mt-2">
                      {plot.ownerName}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-50 text-indigo-600">
                    {plot.areaHa} га
                  </span>
                </div>
              </div>
            ))}
          </div> 
        </Card> */}
      {/* </section> */}
    </div>
  );
}
