'use client'

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, FileCheck2, Fingerprint } from "lucide-react";
import { ICertificate } from "../lib/models/CertificateModel";

function Loader() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return null;
  
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-[#001021]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
        <span className="text-blue-200 font-medium tracking-widest uppercase text-sm">Buscando...</span>
      </div>
    </div>,
    document.body
  );
}

function SearchInterface() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [data, setData] = useState<ICertificate[]>([]);

  useEffect(() => {
    const savedSearch = localStorage.getItem('certificateSearch');
    const savedResults = localStorage.getItem('certificateResults');

    if (savedSearch) setInputValue(savedSearch);

    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setData(parsedResults);
      } catch (e) {
        // Ignora erro de parsing
      }
    }
  }, []);

  const handleSearch = async () => {
    if (!inputValue.trim()) return;
    
    setData([]);
    setIsLoading(true);
    setNoResults(false);

    try {
      const response = await fetch(`/api/get/myCertificate/${inputValue}`);
      const result: { data: ICertificate[] } = await response.json();

      if (!response.ok || result.data.length === 0) {
        setNoResults(true);
        localStorage.removeItem('certificateSearch');
        localStorage.removeItem('certificateResults');
      } else {
        setData(result.data);
        localStorage.setItem('certificateSearch', inputValue);
        localStorage.setItem('certificateResults', JSON.stringify(result.data));
      }
    } catch {
      setNoResults(true);
      localStorage.removeItem('certificateSearch');
      localStorage.removeItem('certificateResults');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-3xl mx-auto">
      {/* Barra de Pesquisa */}
      <div className="relative w-full group mb-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-blue-300 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
        <div className="relative flex items-center bg-[#00152b]/90 backdrop-blur-xl border border-white/20 rounded-2xl p-2 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="pl-4 pr-2 text-blue-300/70">
            <Fingerprint className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 bg-transparent border-none text-white text-lg sm:text-xl placeholder-blue-200/40 focus:outline-none focus:ring-0 py-4 px-2"
            placeholder="Digite o Nome, CPF ou Código..."
          />
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-bold transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]"
          >
            <Search className="w-5 h-5" />
            <span className="hidden sm:block">Buscar</span>
          </button>
        </div>
      </div>

      {isLoading && <Loader />}

      {/* Resultados */}
      <AnimatePresence mode="wait">
        {noResults && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full p-6 text-center rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-md"
          >
            <p className="text-red-200 font-medium text-lg">Nenhum certificado encontrado para "{inputValue}".</p>
          </motion.div>
        )}

        {!noResults && data.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full grid grid-cols-1 gap-4"
          >
            <div className="text-left mb-2 px-2">
              <span className="text-blue-300/80 text-sm font-semibold uppercase tracking-widest">
                {data.length} {data.length === 1 ? 'Certificado Encontrado' : 'Certificados Encontrados'}
              </span>
            </div>
            
            {data.map((certificate, i) => (
              <motion.div
                key={String(certificate._id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <Link
                  prefetch={true}
                  href={`/certificados/meuCertificado/${String(certificate._id)}`}
                  className="relative block p-6 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 hover:border-white/25 transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl shrink-0">
                        <FileCheck2 className="w-8 h-8 text-blue-300" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white font-serif leading-tight mb-2 pr-4">
                          {certificate.eventName}
                        </h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                          <div>
                            <p className="text-[10px] text-blue-300/60 uppercase tracking-wider font-bold mb-0.5">Titular</p>
                            <p className="text-blue-100 text-sm">{certificate.ownerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-blue-300/60 uppercase tracking-wider font-bold mb-0.5">Código</p>
                            <p className="text-blue-200/80 text-sm font-mono">{String(certificate._id)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 sm:ml-auto w-full sm:w-auto">
                      <div className="w-full sm:w-auto text-center px-4 py-2 bg-blue-500/20 text-blue-200 text-sm font-bold rounded-lg border border-blue-400/20 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        Visualizar
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CertificadosPage() {
  return (
    <main className="min-h-screen bg-[#001021] flex flex-col pt-24 pb-20 overflow-x-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#002B5B]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      
      {/* Centralized Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center mt-10 mb-12"
      >
        <span className="inline-block px-4 py-1 bg-white/5 border border-white/10 text-blue-200 text-xs font-bold tracking-widest uppercase rounded-full mb-6">
          Autenticidade Garantida
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-serif tracking-tight drop-shadow-md">
          Validação de Certificados
        </h1>
        <p className="text-lg md:text-xl text-blue-100/80 font-light leading-relaxed max-w-2xl mx-auto">
          Acesse rapidamente seus certificados de participação em simpósios, ligas acadêmicas e eventos apoiados pelo DADG.
        </p>
      </motion.div>

      {/* Search Interface */}
      <section className="relative z-10 flex-grow px-4 sm:px-6 w-full">
        <SearchInterface />
      </section>
    </main>
  );
}
