"use client";

import React from "react";
import {
  AlertCircle,
  Building2,
  CreditCard,
  LayoutDashboard,
  MapIcon,
  MapPinned,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CommNavbar from "@/components/CommNavBar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  const navItems: any[] = [
    { id: "dashboard", label: "Головна", icon: LayoutDashboard },
    { id: "discrepancies", label: "Розбіжності", icon: AlertCircle },
    { id: "precise", label: "Мої шматки", icon: MapIcon },
    { id: "taxes", label: "Податки", icon: CreditCard },
  ];

  const CommnavItems: any[] = [
    { id: "/community/dashboard", label: "Дашборд", icon: LayoutDashboard },
    { id: "/community/map", label: "Мапа громади", icon: MapPinned },
    { id: "/community/plots", label: "Ділянки", icon: MapIcon },
    { id: "/community/taxes", label: "Податки", icon: CreditCard },
    { id: "/community/profile", label: "Профіль ОТГ", icon: Building2 },
  ];

  const isCommunitySection = pathname.startsWith("/community");

  const currentNavItems = isCommunitySection ? CommnavItems : navItems;

  // 3. Активна вкладка — це просто наш поточний URL!
  const activeTab = pathname || "/dashboard";

  // 4. Шукаємо назву (label) саме в ПОТОЧНОМУ масиві
  const currentTabLabel =
    currentNavItems.find((n) => n.id === activeTab)?.label || "Головна";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8f9fc]">
      <Sidebar
        type={isCommunitySection ? "community" : "owner"}
        navItems={currentNavItems}
        activeTab={activeTab}
        onTabChange={() => {}}
      />
      {/* <Sidebar
        type={isCommunitySection ? "community" : "owner"}
        navItems={navItems}
        activeTab={activeTab}
        onTabChange={() => {}}
      /> */}

      <main className="flex-1 min-w-0 flex flex-col h-screen">
        {isCommunitySection && <CommNavbar currentTabLabel={currentTabLabel} />}
        {!isCommunitySection && <Navbar currentTabLabel={currentTabLabel} />}

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 max-w-[1440px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <nav className="md:hidden bg-white border-t border-slate-100 flex justify-around p-3 pb-8 shrink-0">
          {isCommunitySection
            ? CommnavItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === item.id ? "text-indigo-600" : "text-slate-400"}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {item.label}
                  </span>
                </Link>
              ))
            : navItems.map((item) => (
                <Link
                  key={item.id}
                  href={`/${item.id}`}
                  className={`p-2 rounded-xl flex flex-col items-center gap-1 ${activeTab === item.id ? "text-indigo-600" : "text-slate-400"}`}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">
                    {item.label}
                  </span>
                </Link>
              ))}
        </nav>
      </main>
    </div>
  );
}
