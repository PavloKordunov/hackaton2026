import { History } from "lucide-react";
import { Card, Button } from "@/components/ui";

const TaxesView = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <Card className="bg-indigo-600 border-none p-8 text-white relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-125 transition-transform duration-1000" />
      <div className="relative">
        <p className="text-black font-medium mb-1 tracking-tight">
          Сума до сплати за 2024 рік
        </p>
        <h2 className="text-5xl text-black font-black tracking-tighter">
          8 740 грн
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button
            variant="success"
            className="px-8 py-3 text-lg shadow-xl shadow-emerald-500/20"
          >
            Сплатити автоматично
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Отримати квитанцію
          </Button>
        </div>
      </div>
    </Card>
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <h3 className="text-lg font-bold">Історія платежів</h3>
        <History className="w-5 h-5 text-slate-300" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                Дата
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                Сума
              </th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">
                Статус
              </th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr
                key={i}
                className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-slate-500 tracking-tight font-medium">
                  1{i}.03.2023
                </td>
                <td className="px-6 py-4 font-bold text-slate-800 tracking-tighter">
                  2 400 грн
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-500 text-[10px] font-bold rounded uppercase">
                    Виконано
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

export default TaxesView;
