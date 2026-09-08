'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
const labels: Record<string, string> = { name: 'Nome completo', cpf: 'CPF', period: 'Período', registrationNumber: 'Matrícula / RA', birthDate: 'Data de nascimento', phone: 'Telefone', contactEmail: 'E-mail de contato', privacyAccepted: 'Aceite de privacidade' };
export default function ProfileGate({ returnTo, children }: { returnTo: string; children: React.ReactNode }) {
  const [missing, setMissing] = useState<string[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch('/api/perfil/proxy', { cache: 'no-store' }).then(async response => {
      if (!response.ok) throw new Error('Não foi possível conferir seu cadastro. Atualize a página para tentar novamente.');
      const data = await response.json();
      if (!active) return;
      const profile = data.profile;
      const fields = profile?.clamMissingFields ?? Object.keys(labels).filter(key => key !== 'privacyAccepted');
      setMissing(profile?.privacyNoticeRequired ? [...new Set([...fields, 'privacyAccepted'])] : fields);
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, []);
  if (error) return <p role="alert" className="rounded-2xl bg-amber-50 p-5 text-amber-900">{error}</p>;
  if (missing === null) return <p role="status">Conferindo seu cadastro...</p>;
  if (missing.length) return <section className="glass-panel rounded-[28px] border border-amber-200 p-6"><h2 className="text-xl font-bold">Complete seu cadastro para continuar</h2><p className="my-4">Faltam: {missing.map(field => labels[field] || field).join(', ')}.</p><Link className="inline-block rounded-full bg-blue-600 px-5 py-3 font-semibold text-white" href={`/perfil?returnTo=${encodeURIComponent(returnTo)}`}>Completar cadastro</Link></section>;
  return <>{children}</>;
}
