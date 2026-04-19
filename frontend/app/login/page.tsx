"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Satellite,
  MapPinned,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      if (email === "otg.chervonohrad@demo.ua" && password === "otg123") {
        router.push("/dashboard");
      } else if (email && password) {
        router.push("/dashboard");
      } else {
        setError("Будь ласка, введіть email та пароль");
        setIsLoading(false);
      }
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center"
      >
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
          <MapPinned className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-slate-900">
          Увійдіть у кабінет громади
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium flex items-center gap-2">
          <Satellite className="w-4 h-4" />
          Resilog UA — моніторинг активів ОТГ
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <Card className="py-8 px-4 sm:px-10 border-slate-200 shadow-xl shadow-slate-200/50">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-rose-50 border border-rose-100 text-rose-600 p-3 rounded-xl flex items-center gap-3 text-sm font-medium"
              >
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
                {error}
              </motion.div>
            )}

            <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4 text-sm text-indigo-700">
              Демо-акаунт ОТГ: <span className="font-bold">otg.chervonohrad@demo.ua</span>
              <br />
              Пароль: <span className="font-bold">otg123</span>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-2"
              >
                Електронна пошта
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-medium"
                  placeholder="otg.chervonohrad@demo.ua"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-600 uppercase tracking-wider ml-1 mb-2"
              >
                Пароль
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm font-medium"
                  placeholder="otg123"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-600 font-medium cursor-pointer"
                >
                  Запам&apos;ятати мене
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500">
                  Забули пароль?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full group flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Увійти в систему
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
