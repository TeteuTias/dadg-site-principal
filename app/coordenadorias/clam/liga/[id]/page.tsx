'use client'
import './style.css';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IAcademicLeague } from '@/app/lib/models/AcademicLeagues';
import { Poppins } from 'next/font/google';
import { FaHeartbeat, FaUserMd, FaStar, FaInfoCircle, FaListUl } from 'react-icons/fa';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { ObjectId } from 'bson';
import { motion } from 'framer-motion';

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700'],
  style: ['normal'],
});

export default function LamePage({ params }: { params: Promise<{ id: string }> }) {

  const [data, setData] = useState<IAcademicLeague | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params
        
        if (!id || !ObjectId.isValid(id)) {
          setError("O parâmetro 'id' não está presente ou é inválido.")
          setIsLoading(false)
          return;
        }

        const response = await fetch(`/api/get/getAcademicLeagueById/${id}`, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Liga não encontrada')
        }

        const data: { data: IAcademicLeague } = await response.json();
        setData(data.data);
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar a liga')
        setData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params])

  if (isLoading) {
    return (
      <main className="lame-main" style={poppins.style}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white font-medium">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="lame-main" style={poppins.style}>
        <div className="w-full max-w-900px px-4 py-8">
          <Link href="/coordenadorias/clam" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" />
            Voltar para CLAM
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-400/50 rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Erro ao carregar liga</h2>
            <p className="text-red-100 mb-6">{error}</p>
            <Link 
              href="/coordenadorias/clam"
              className="inline-block px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
            >
              Voltar para CLAM
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="lame-main" style={poppins.style}>
        <div className="w-full max-w-900px px-4 py-8">
          <Link href="/coordenadorias/clam" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-8">
            <ChevronLeft className="w-5 h-5" />
            Voltar para CLAM
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-500/20 border border-yellow-400/50 rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Liga não encontrada</h2>
            <p className="text-yellow-100 mb-6">Não conseguimos localizar os dados desta liga.</p>
            <Link 
              href="/coordenadorias/clam"
              className="inline-block px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-medium"
            >
              Voltar para CLAM
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="lame-main" style={poppins.style}>
      <div className="w-full max-w-900px px-4 py-8">
        {/* Botão Voltar */}
        <Link href="/coordenadorias/clam" className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mb-8">
          <ChevronLeft className="w-5 h-5" />
          Voltar para CLAM
        </Link>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lame-header"
        >
          <div className="lame-logo-circle-pro">
            <img
              src={"/leagues/" + data?.acronym.toLocaleLowerCase() + ".png"}
              alt={`Logo ${data?.name}`}
              className='rounded-full'
              width={180}
              height={180}
            />
          </div>
          <div className="lame-title-block">
            <h1 className="lame-title-gradient">{data?.name}</h1>
            <div className="lame-info-card-pro">
              <div className="lame-info-item-pro">
                <FaStar className="lame-info-icon" />
                <span className="lame-info-label-pro">Sigla</span>
                <span className="lame-info-value-pro">{data?.acronym}</span>
              </div>
              <div className="lame-info-item-pro">
                <FaHeartbeat className="lame-info-icon" />
                <span className="lame-info-label-pro">Área</span>
                <span className="lame-info-value-pro text-center">{data?.area}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Seções de Conteúdo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Orientador */}
          <section className="lame-section-card">
            <div className="lame-section-header">
              <FaUserMd className="lame-section-icon" />
              <h2 className="lame-section-title">Orientador</h2>
            </div>
            <div className="lame-section-content">{data?.advisors || "Não informado"}</div>
          </section>

          {/* Diferencial */}
          <section className="lame-section-card">
            <div className="lame-section-header">
              <FaStar className="lame-section-icon" />
              <h2 className="lame-section-title">Diferencial</h2>
            </div>
            <div className="lame-section-content">
              {data?.highlightText || "Não informado"}
            </div>
          </section>

          {/* Sobre */}
          <section className="lame-section-card">
            <div className="lame-section-header">
              <FaInfoCircle className="lame-section-icon" />
              <h2 className="lame-section-title">Sobre</h2>
            </div>
            <div className="lame-section-content">
              {data?.about || "Não informado"}
            </div>
          </section>

          {/* Exemplos de Atuação */}
          {data?.examples && data.examples.length > 0 && (
            <section className="lame-section-card">
              <div className="lame-section-header">
                <FaListUl className="lame-section-icon" />
                <h2 className="lame-section-title">Exemplos de Atuação e Projetos</h2>
              </div>
              <ul className="lame-section-list">
                {data.examples.map((value, index) => (
                  <li key={index}>
                    <span className="lame-list-bullet" />
                    {value}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Texto Geral */}
          {data?.geralText && (
            <section className="lame-section-card">
              <div className="lame-section-header">
                <FaInfoCircle className="lame-section-icon" />
                <h2 className="lame-section-title">Informações Gerais</h2>
              </div>
              <div className="lame-section-content">
                {data.geralText}
              </div>
            </section>
          )}
        </motion.div>
      </div>
    </main>
  );
}
