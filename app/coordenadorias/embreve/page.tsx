"use client";

import React, { useEffect, useState } from "react";
import Typewriter from "@/app/components/TypeWriter";
import WaveAnimation from "@/app/components/WaveComponent";
import { useTheme } from "next-themes";
import Link from "next/link";
import { ChevronLeft, Rocket, Clock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen w-full p-8 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#001021]' : 'bg-slate-50'}`}>
      {/* Background patterns */}
      <div className={`absolute inset-0 bg-[radial-gradient(#002B5B_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none transition-opacity duration-500 ${isDark ? 'opacity-20' : 'opacity-[0.03]'}`} />
      
      {/* Floating particles/elements */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-1/4 opacity-20"
      >
        <Sparkles className={`w-12 h-12 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-1/4 opacity-20"
      >
        <Rocket className={`w-16 h-16 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
      </motion.div>

      {/* Back button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-24 left-8 z-20"
      >
        <Link href="/coordenadorias" className={`inline-flex items-center gap-2 font-bold px-4 py-2 rounded-full backdrop-blur-md border transition-all ${
          isDark 
            ? 'text-blue-300 border-white/10 hover:bg-white/10 hover:text-white' 
            : 'text-blue-600 border-blue-100 hover:bg-blue-50 hover:text-[#002B5B] shadow-sm'
        }`}>
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`mb-8 p-6 rounded-3xl ${isDark ? 'bg-blue-500/10' : 'bg-blue-50'}`}
        >
          <Clock className={`w-16 h-16 animate-pulse ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        </motion.div>

        <h1 className={`text-4xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter transition-colors duration-500 font-serif ${isDark ? 'text-white' : 'text-[#09427d]'}`}>
          <Typewriter text="EM BREVE" speed={150} />
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className={`text-lg md:text-xl font-medium max-w-md leading-relaxed ${isDark ? 'text-blue-100/60' : 'text-slate-600'}`}
        >
          Estamos preparando algo incrível para esta coordenadoria. Fique atento às novidades do DADG!
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-12"
        >
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className={`w-3 h-3 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-600'}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Wave Animation Footer */}
      <div className={`w-full absolute bottom-0 left-0 right-0 h-[35vh] overflow-hidden pointer-events-none flex items-end transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className={`w-full h-full ${isDark ? 'opacity-40 mix-blend-screen' : 'opacity-60 mix-blend-multiply'}`}>
          <WaveAnimation />
        </div>
      </div>
    </div>
  );
}
