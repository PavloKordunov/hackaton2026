import { Bell, ChevronDown, Search } from "lucide-react";

const Navbar = ({ currentTabLabel }: any) => (
  <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-20">
    <div className="flex items-center gap-6 flex-1 min-w-0">
      <h2 className="hidden lg:block text-sm font-bold text-slate-400 uppercase tracking-widest min-w-fit">
        Головна <span className="text-slate-200 mx-1">/</span>{" "}
        <span className="text-indigo-600">{currentTabLabel}</span>
      </h2>
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Шукати по реєстрах..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
        />
      </div>
    </div>

    <div className="flex items-center gap-4 lg:gap-8 ml-4">
      <div className="hidden sm:flex items-center gap-2">
        <p className="text-xs font-bold text-slate-500">
          Ви маєте <span className="text-emerald-500">21 нове сповіщення</span>
        </p>
        <Bell className="w-5 h-5 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
      </div>
      <div className="w-px h-6 bg-slate-100 hidden sm:block" />
      <div className="flex items-center gap-2 group cursor-pointer shrink-0">
        <img
          src="https://i.pravatar.cc/150?u=b"
          className="w-9 h-9 rounded-full ring-2 ring-indigo-50 group-hover:ring-indigo-200 transition-all"
          alt=""
        />
        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
      </div>
    </div>
  </header>
);

export default Navbar;
