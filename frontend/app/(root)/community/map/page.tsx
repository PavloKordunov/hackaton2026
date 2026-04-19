"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui";
import { communityPlots, communityProfile } from "@/lib/community-demo";
import { MapPinned, ShieldAlert } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-900 rounded-xl text-white">
      Завантаження мапи громади...
    </div>
  ),
});

export default function CommunityMapPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Мапа Червоноградської громади
          </h1>
          <p className="text-slate-500 mt-2 max-w-3xl">
            Для демо карта працює на мокових координатах ділянок, бо зараз ми не
            відображаємо реальні межі громади та їхні shape-файли.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-bold">
          <ShieldAlert className="w-4 h-4" />
          Мапа замокана для хакатону
        </div>
      </div>

      <Card className="p-6 border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">
              Громада
            </p>
            <p className="text-xl font-black text-slate-900 mt-2">
              {communityProfile.name}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">
              Ділянок на мапі
            </p>
            <p className="text-xl font-black text-slate-900 mt-2">
              {communityPlots.length}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">
              Населені пункти
            </p>
            <p className="text-xl font-black text-slate-900 mt-2 flex items-center gap-2">
              <MapPinned className="w-5 h-5 text-indigo-600" />
              {communityProfile.settlements.length}
            </p>
          </div>
        </div>
      </Card>

      <div className="border border-slate-200 p-1 rounded-2xl shadow-xl bg-slate-900">
        <MapComponent
          plots={communityPlots.map((plot) => ({
            id: plot.id,
            cadastralNumber: plot.cadastralNumber,
            owner: plot.ownerName,
            coordinates: plot.coordinates,
          }))}
        />
      </div>
    </div>
  );
}
