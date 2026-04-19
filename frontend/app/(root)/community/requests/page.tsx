"use client";

import { useMemo, useState } from "react";
import {
  Search,
  FolderCheck,
  Clock3,
  User,
  MapPin,
  CheckCircle2,
  Filter,
} from "lucide-react";
import { Card } from "@/components/ui";

interface OwnerApplication {
  id: string;
  ownerName: string;
  cadastralNumber: string;
  settlement: string;
  requestType: string;
  submittedAt: string;
  status: "new" | "review" | "approved" | "declined";
  comment: string;
}

const mockedApplications: OwnerApplication[] = [
  {
    id: "app-1",
    ownerName: "Олексій Коваль",
    cadastralNumber: "4620487300:02:001:0034",
    settlement: "Червоноград",
    requestType: "Внесення змін до меж ділянки",
    submittedAt: "2026-04-10",
    status: "new",
    comment: "Прошу оновити площу ділянки після уточнення меж.",
  },
  {
    id: "app-2",
    ownerName: "Марія Шевченко",
    cadastralNumber: "4620487300:02:001:0078",
    settlement: "Міське",
    requestType: "Нотаріальна виправка власника",
    submittedAt: "2026-04-12",
    status: "review",
    comment: "Змінити власника на Івана Шевченка згідно договору.",
  },
  {
    id: "app-3",
    ownerName: "Іван Орлов",
    cadastralNumber: "4620487300:02:001:0123",
    settlement: "Село Верхнє",
    requestType: "Дозволи для будівництва",
    submittedAt: "2026-04-14",
    status: "approved",
    comment: "Потрібно підтвердити право на будівництво на 0.5 га.",
  },
  {
    id: "app-4",
    ownerName: "Наталія Григоренко",
    cadastralNumber: "4620487300:02:001:0177",
    settlement: "Село Нижнє",
    requestType: "Виправлення помилки в номері",
    submittedAt: "2026-04-15",
    status: "declined",
    comment: "Уточніть кадастровий номер та подайте повторно.",
  },
];

const statusLabels: Record<OwnerApplication["status"], string> = {
  new: "Нова",
  review: "На розгляді",
  approved: "Погоджена",
  declined: "Відхилена",
};

const statusStyles: Record<OwnerApplication["status"], string> = {
  new: "bg-slate-100 text-slate-700",
  review: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
};

export default function CommunityRequestsPage() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApplications = useMemo(() => {
    return mockedApplications.filter((application) => {
      const matchesQuery = [
        application.ownerName,
        application.cadastralNumber,
        application.settlement,
        application.requestType,
        application.comment,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Заявки власників земельних ділянок
          </h1>
          <p className="text-slate-500 mt-2 max-w-3xl">
            Моковані заяви від власників, які хочуть змінити дані про ділянку
            або подати звернення.
          </p>
        </div>
        <div className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <FolderCheck className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm text-slate-500 leading-none mb-1">
              Заявок у базі
            </p>
            <p className="text-lg font-bold text-slate-900 leading-none">
              {mockedApplications.length}
            </p>
          </div>
        </div>
      </div>

      {/* ВИПРАВЛЕНО: Блок фільтрів тепер ідеально вирівняний по висоті */}
      <Card className="p-5 border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Пошук по власнику, ділянці або типу заявки"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Filter className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="all">Усі статуси</option>
              <option value="new">Нова</option>
              <option value="review">На розгляді</option>
              <option value="approved">Погоджена</option>
              <option value="declined">Відхилена</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-[0.1em] border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold">Власник</th>
                <th className="px-6 py-4 font-bold">Кадастровий номер</th>
                <th className="px-6 py-4 font-bold">Населений пункт</th>
                <th className="px-6 py-4 font-bold">Тип заявки</th>
                <th className="px-6 py-4 font-bold whitespace-nowrap">Дата</th>
                <th className="px-6 py-4 font-bold">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {filteredApplications.map((application) => (
                <tr
                  key={application.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* ВИПРАВЛЕНО: flex тепер всередині div, а не на td */}
                  <td className="px-6 py-4 align-middle">
                    <div className="font-semibold text-slate-900 flex items-center gap-2 whitespace-nowrap">
                      <User className="w-4 h-4 text-indigo-500 shrink-0" />
                      {application.ownerName}
                    </div>
                  </td>
                  <td className="px-6 py-4 align-middle font-medium text-slate-900 whitespace-nowrap">
                    {application.cadastralNumber}
                  </td>
                  <td className="px-6 py-4 align-middle text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      {application.settlement}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 align-middle text-slate-600 max-w-[250px] truncate"
                    title={application.requestType}
                  >
                    {application.requestType}
                  </td>
                  <td className="px-6 py-4 align-middle text-slate-500 whitespace-nowrap">
                    {application.submittedAt}
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span
                      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap ${statusStyles[application.status]}`}
                    >
                      <Clock3 className="w-3.5 h-3.5" />
                      {statusLabels[application.status]}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredApplications.length === 0 && (
                <tr>
                  <td
                    className="px-6 py-12 text-center text-sm text-slate-500"
                    colSpan={6}
                  >
                    <FolderCheck className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    Нічого не знайдено за вашим запитом.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
