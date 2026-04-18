"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

// Динамічний імпорт карти з вимкненим SSR (Server-Side Rendering)
const MapComponent = dynamic(() => import("@/components/map/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-900 rounded-xl text-white">
      Завантаження супутникових даних...
    </div>
  ),
});

export default function DashboardPage() {
  // Мокові дані для тестування (потім ви будете тягнути їх з NestJS / PostgreSQL)
  const mockLandPlots = useMemo(
    () => [
      {
        id: "1",
        cadastralNumber: "4624884200:15:000:0956",
        owner: "Музичук Надія Олексіївна",
        coordinates: [
          [50.448218, 24.187842],
          [50.448044, 24.187801],
          [50.448044, 24.187801],
          [50.447785, 24.190827],
          [50.448072, 24.190891],
        ] as [number, number][],
      },
      {
        id: "3",
        cadastralNumber: "4624884200:19:004:0024",
        owner: "Домашевич Богдан Дмитрович",
        coordinates: [
          [50.420708, 24.18828],
          [50.419316, 24.187904],
          [50.419273, 24.188376],
          [50.420656, 24.188767],
        ] as [number, number][],
      },
      {
        id: "5",
        cadastralNumber: "4624884200:08:000:0086",
        owner: "Грицина Іван Іванович",
        coordinates: [
          [50.398199, 24.15032],
          [50.398166, 24.15073],
          [50.392571, 24.150982],
          [50.39282, 24.150549],
        ] as [number, number][],
      },

      {
        id: "2",
        cadastralNumber: "4624884200:06:000:0486",
        owner: "Смоляр Галина Миколаївна",
        coordinates: [
          [50.426283, 24.172519],
          [50.426235, 24.173002],
          [50.422247, 24.171097],
          [50.422263, 24.170602],
        ] as [number, number][],
      },
      {
        id: "4",
        cadastralNumber: "4624881300:08:000:0020",
        owner: "Іваневич Володимир Володимирович",
        coordinates: [
          [50.319224, 24.313249],
          [50.319195, 24.313369],
          [50.317793, 24.31263],
          [50.317817, 24.312503],
        ] as [number, number][],
      },
      {
        id: "6",
        cadastralNumber: "4611800000:02:008:0043",
        owner: 'ТОВ "Агро-Транс"',
        coordinates: [
          [50.397479, 24.234986],
          [50.397453, 24.235077],
          [50.397414, 24.235045],
          [50.39744, 24.234964],
        ] as [number, number][],
      },
      {
        id: "7",
        cadastralNumber: "4624884200:16:000:0195",
        owner: 'ТОВ "Агро-Транс"',
        coordinates: [
          [50.442895, 24.216017],
          [50.442895, 24.216184],
          [50.441855, 24.216005],
          [50.441847, 24.215826],
        ] as [number, number][],
      },
    ],
    [],
  );

  return (
    <div className="p-6 bg-gray-950 min-h-screen text-white font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
          Моніторинг активів ОТГ
        </h1>
        <p className="text-gray-400 mt-2">
          Виявлення розбіжностей між реєстрами
        </p>
      </header>

      {/* Контейнер карти */}
      <div className="border border-gray-800 p-1 rounded-2xl shadow-2xl bg-gray-900">
        <MapComponent plots={mockLandPlots} />
      </div>
    </div>
  );
}
