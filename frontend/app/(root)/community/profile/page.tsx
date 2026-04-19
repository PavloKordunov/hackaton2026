import { Building2, Mail, MapPinned, Phone } from "lucide-react";
import { Card } from "@/components/ui";
import { communityProfile } from "@/lib/community-demo";

export default function CommunityProfilePage() {
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
                {communityProfile.name}
              </h2>
              <p className="text-slate-500 mt-2">
                {communityProfile.region}, {communityProfile.district}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <MapPinned className="w-5 h-5 text-indigo-600" />
              Центр громади: {communityProfile.center}
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Mail className="w-5 h-5 text-indigo-600" />
              {communityProfile.accountEmail}
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Phone className="w-5 h-5 text-indigo-600" />
              {communityProfile.contactPhone}
            </div>
          </div>
        </Card>

        <Card className="p-8 border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900">
            Населені пункти в складі ОТГ
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            Цей список можна використовувати і в профілі громади, і для фільтрації
            земельних ділянок по належності до ОТГ.
          </p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {communityProfile.settlements.map((item) => (
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
