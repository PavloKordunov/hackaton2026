"use client";

import { useState, useRef } from "react";
import {
  Bell,
  ChevronDown,
  Search,
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface NavbarProps {
  currentTabLabel: string;
}

const CommNavbar = ({ currentTabLabel }: NavbarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Обробники Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      droppedFile &&
      (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv"))
    ) {
      setFile(droppedFile);
      setUploadStatus("idle");
    } else {
      alert("Будь ласка, завантажте лише CSV файл.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStatus("idle");
    }
  };

  // Імітація завантаження на сервер
  const handleUpload = () => {
    if (!file) return;
    setUploadStatus("uploading");

    setTimeout(() => {
      setUploadStatus("success");
      // Через 2 секунди після успіху - закриваємо модалку
      setTimeout(() => {
        setIsModalOpen(false);
        setFile(null);
        setUploadStatus("idle");
      }, 2000);
    }, 1500);
  };

  const resetModal = () => {
    setIsModalOpen(false);
    setFile(null);
    setUploadStatus("idle");
  };

  return (
    <>
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
              placeholder="Шукати по ділянках, селах або кадастровому номеру..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-8 ml-4">
          {/* Кнопка імпорту */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-indigo-100"
          >
            <Upload className="w-4 h-4" />
            Імпорт CSV
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <p className="text-xs font-bold text-slate-500">
              Громада має{" "}
              <span className="text-emerald-500">4 активні податки</span>
            </p>
            <Bell className="w-5 h-5 text-slate-300 hover:text-indigo-600 cursor-pointer transition-colors" />
          </div>
          <div className="w-px h-6 bg-slate-100 hidden sm:block" />
          <div className="flex items-center gap-2 group cursor-pointer shrink-0">
            <div className="w-9 h-9 rounded-full ring-2 ring-indigo-50 group-hover:ring-indigo-200 transition-all bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              OT
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold text-slate-700 leading-none">
                Червоноградська ОТГ
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-none">
                otg.chervonohrad@demo.ua
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </header>

      {/* Модальне вікно для завантаження CSV */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header модалки */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
                Імпорт земельних ділянок
              </h3>
              <button
                onClick={resetModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Тіло модалки */}
            <div className="p-6">
              {uploadStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-in zoom-in duration-300" />
                  <h4 className="text-xl font-bold text-slate-800">
                    Успішно завантажено!
                  </h4>
                  <p className="text-sm text-slate-500 mt-2">
                    Дані з файлу {file?.name} успішно додані до реєстру громади.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-slate-500 mb-4">
                    Завантажте CSV файл з координатами та даними про ділянки.
                    Переконайтесь, що файл містить колонки: кадастровий номер,
                    власник, площа, населений пункт.
                  </p>

                  {/* Зона Drag & Drop */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".csv"
                      className="hidden"
                    />

                    {file ? (
                      <div className="flex flex-col items-center text-center">
                        <FileSpreadsheet className="w-10 h-10 text-indigo-600 mb-2" />
                        <p className="font-bold text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <Upload
                          className={`w-10 h-10 mb-3 ${isDragging ? "text-indigo-600" : "text-slate-400"}`}
                        />
                        <p className="text-sm font-bold text-slate-700">
                          Натисніть або перетягніть файл сюди
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Формат CSV (макс. 10MB)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer модалки */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      onClick={resetModal}
                      className="px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      Скасувати
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={!file || uploadStatus === "uploading"}
                      className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-indigo-600/20"
                    >
                      {uploadStatus === "uploading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Обробка...
                        </>
                      ) : (
                        "Завантажити дані"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommNavbar;
