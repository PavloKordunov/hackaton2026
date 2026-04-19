"use client";

import { useEffect, useState } from "react";
import { Building2, Mail, MapPinned, Phone } from "lucide-react";
import { Card } from "@/components/ui";
import {
  CommunitiesService,
  CommunityProfile,
} from "@/lib/communities-service";

export default function CommunityProfilePage() {
  const [profile, setProfile] = useState<CommunityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const slug = "chervonohrad";
        const profileData = await CommunitiesService.getProfile(slug);
        setProfile(profileData);
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
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-100 h-40 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6">
          <div className="bg-slate-100 h-48 rounded-2xl animate-pulse" />
          <div className="bg-slate-100 h-48 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-800">
        <p className="font-bold">Помилка при завантаженні даних</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Профіль громади
        </h1>
        <p className="text-slate-500 mt-2 max-w-3xl">
          Окремий тип акаунта для ОТГ з базовими полями, контактами та списком
          населених пунктів, які входять до громади.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6">
        <Card className="p-8 border-slate-100 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                {profile.name}
              </h2>
              <p className="text-slate-500 mt-2">
                {profile.region}, {profile.district}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <MapPinned className="w-5 h-5 text-indigo-600" />
              Центр громади: {profile.center}
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-5 h-5 text-indigo-600" />
              {profile.accountEmail}
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-5 h-5 text-indigo-600" />
              {profile.contactPhone}
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900">
            Населені пункти в складі ОТГ
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Цей список можна використовувати і в профілі громади, і для
            фільтрації земельних ділянок по належності до ОТГ.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.settlements.map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 font-medium text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
