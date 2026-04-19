import Link from "next/link";
import { Building2, LucideIcon } from "lucide-react";

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SidebarProps {
  type: "community" | "owner";
  navItems: SidebarItem[];
  activeTab: string;
  onTabChange?: (id: string) => void;
}

const Sidebar = ({ type, navItems, activeTab }: SidebarProps) => (
  <aside className="hidden md:flex flex-col w-20 lg:w-64 bg-white border-r border-slate-100 h-screen sticky top-0 shrink-0 overflow-y-auto transition-all duration-300 group">
    <div className="p-6 mb-4 flex items-center justify-center lg:justify-start gap-3">
      <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
        <Building2 className="text-white w-6 h-6" />
      </div>
      <span className="hidden lg:block text-2xl font-black tracking-tighter text-slate-800 uppercase">
        LAND/A/HAND
      </span>
    </div>
    <nav className="flex-1 px-3 space-y-1">
      {navItems.map((item) => (
        <Link
          key={item.id}
          href={item.id}
          className={`w-full flex items-center justify-center lg:justify-start gap-4 p-4 rounded-xl transition-all duration-200 ${
            activeTab === item.id
              ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 rounded-l-none"
              : "text-slate-400 hover:bg-slate-50 hover:text-indigo-600"
          }`}
        >
          <item.icon className="w-6 h-6 shrink-0" />
          <span className="hidden lg:block font-bold text-sm tracking-tight">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
