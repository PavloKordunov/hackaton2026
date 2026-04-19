"use client";

import React from "react";
import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LucideIcon,
  MapIcon,
  MapPinned,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
    { id: "map", label: "Мапа громади", icon: MapPinned },
    { id: "plots", label: "Ділянки", icon: MapIcon },
    { id: "taxes", label: "Податки", icon: CreditCard },
    { id: "community", label: "Профіль ОТГ", icon: Building2 },
  ];

  const pathBase = pathname ? pathname.split("/")[1] : "";
  const activeTab = pathBase || "dashboard";

  const currentTabLabel =
    navItems.find((n) => n.id === activeTab)?.label || "Дашборд";

  return (
    <div className="">
      {/* <Sidebar
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={() => {}}
      />

      <main className="flex-1 min-w-0 flex flex-col h-screen">
        <Navbar currentTabLabel={currentTabLabel} />

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 max-w-[1440px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              > */}
      {children}
      {/* </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <nav className="md:hidden bg-white border-t border-slate-100 flex justify-around p-3 pb-8 shrink-0">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`/${item.id}`}
              className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === item.id ? "text-indigo-600" : "text-slate-400"}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-center">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </main> */}
    </div>
  );
}
