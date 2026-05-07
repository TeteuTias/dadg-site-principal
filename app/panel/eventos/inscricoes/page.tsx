'use client';

import { useEffect, useState } from 'react';
import { ObjectId } from 'bson';
import { IEventParticipantWithEventPopulate } from '@/app/lib/models/EventParticipant';
import { IEventCertificate } from '@/app/lib/models/EventCertificateModel';
import { useUser } from "@auth0/nextjs-auth0"
// ==========================================
// 2. MOCKS
// ==========================================
const CURRENT_USER_ID = new ObjectId();
const CURRENT_USER_NAME = 'João Desenvolvedor';
// ==========================================
// 3. COMPONENTES DE UI
// ==========================================

const InteractiveCalendar = ({
    events,
    participations,
    onDayClick
}: {
    events: IEventCertificate[],
    participations: IEventParticipantWithEventPopulate[],
    onDayClick: (date: string, eventsOnDay: IEventCertificate[]) => void
}) => {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // Abril 2026
    const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));

    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    const blanks = Array(firstDayOfWeek).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handleDateClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDateStr(dateStr);
        const eventsOnDay = events.filter(e => e.createdAt === dateStr);
        onDayClick(dateStr, eventsOnDay);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header do Calendário - Mais limpo */}
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                <button onClick={prevMonth} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">&larr; Anterior</button>
                <h3 className="font-bold text-slate-800 text-lg">{monthNames[month]} {year}</h3>
                <button onClick={nextMonth} className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Próximo &rarr;</button>
            </div>

            {/* Grid de Dias */}
            <div className="p-5">
                <div className="grid grid-cols-7 gap-1 mb-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                </div>
                <div className="grid grid-cols-7 gap-y-3 gap-x-1 justify-items-center">
                    {blanks.map((_, i) => <div key={`blank-${i}`} className="w-10 h-10"></div>)}

                    {days.map(day => {
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isSelected = selectedDateStr === dateStr;
                        const eventsToday = events.filter(e => e.createdAt === dateStr);

                        const amIParticipating = eventsToday.some(e => participations.some(p => p.eventId._id === e._id));
                        let dotColor = null;
                        if (eventsToday.length > 0) {
                            dotColor = amIParticipating ? 'bg-emerald-500' : 'bg-blue-500';
                        }

                        return (
                            <button
                                key={day}
                                onClick={() => handleDateClick(day)}
                                className={`relative w-10 h-10 rounded-full flex flex-col items-center justify-center text-sm font-medium transition-all
                                    ${isSelected
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-700 hover:bg-slate-100'
                                    }
                                `}
                            >
                                {day}
                                {dotColor && (
                                    <div className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : dotColor}`}></div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Legenda */}
                <div className="mt-6 flex gap-4 text-xs justify-center text-slate-500 border-t border-slate-100 pt-4">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Inscrito</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Há Eventos</span>
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. PÁGINA PRINCIPAL
// ==========================================
export default function EventDashboard() {
    const [events, setEvents] = useState<IEventCertificate[]>([]);
    const [participations, setParticipations] = useState<IEventParticipantWithEventPopulate[]>([]);
    const [selectedDayEvents, setSelectedDayEvents] = useState<{ date: string, list: IEventCertificate[] } | null>(null);
    const { user, isLoading } = useUser()

    useEffect(() => {
        if (!isLoading && user) {
            console.log('Usuário autenticado:', user);
            const FETCH = async () => {
                const data = await fetch(`/api/v1/events/user/${user.sub.replace("auth0|", "")}/`)
                if (!data.ok) {
                    alert('Erro ao carregar eventos do usuário. Usando dados mockados.');
                    return;
                }
                const json: { data: IEventParticipantWithEventPopulate[] } = await data.json();
                setParticipations(json.data);
                // ==== ---- ====
                // ==== ---- ====
                const data2 = await fetch(`/api/v1/events/closedForRegistration/2026-03`)
                if (!data2.ok) {
                    alert('Erro ao carregar eventos. Usando dados mockados.');
                    return;
                }
                const json2: { data: IEventCertificate[] } = await data2.json();
                setEvents(json2.data);
            }
            FETCH()
        }
    }, [isLoading])

    const isParticipating = (eventId: string) => participations.some((p) => `${p.eventId._id}` === `${eventId}`);
    const handleRegister = (event: IEventCertificate) => {
        if (!event.isOpen) return alert('Inscrições encerradas!');
        const newPart: IEventParticipantWithEventPopulate = { _id: new ObjectId(), eventId: event, owner: CURRENT_USER_ID, ownerName: CURRENT_USER_NAME };
        setParticipations([...participations, newPart]);
    };

    const handleUnregister = (participationId: string, event: IEventCertificate) => {
        if (!event.isOpen) return alert('Evento já fechado! Não é possível cancelar.');
        if (event.isPaid) return alert('Atenção: Contate o Diretório Acadêmico para cancelar evento pago.');
        setParticipations(participations.filter((p) => `${p._id}` !== `${participationId}`));
    };

    const handleDayClick = (date: string, eventsOnDay: IEventCertificate[]) => {
        setSelectedDayEvents({ date, list: eventsOnDay });
    };

    const mySchedule = [...participations].sort((a, b) => new Date(a.eventId.createdAt).getTime() - new Date(b.eventId.createdAt).getTime());
    const missedEvents = events.filter(e => !e.isOpen && !isParticipating(`${e._id}`));

    return (
        <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
            {/* Cabecalho Principal */}
            <header className="mb-8 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Meu Painel de Eventos</h1>
                <p className="text-slate-500">Gerencie sua agenda, descubra novos eventos e acompanhe seu histórico.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* COLUNA 1: CALENDÁRIO & DETALHES */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    <section>
                        <h2 className="text-lg font-bold mb-3 text-slate-800 flex items-center gap-2">📅 Explorar</h2>
                        <InteractiveCalendar events={events} participations={participations} onDayClick={handleDayClick} />
                    </section>

                    {selectedDayEvents && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3 flex items-center justify-between">
                                <span>Eventos do dia</span>
                                <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                    {selectedDayEvents.date.split('-').reverse().join('/')}
                                </span>
                            </h3>

                            {selectedDayEvents.list.length === 0 ? (
                                <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-sm text-slate-500">Nenhum evento programado.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDayEvents.list.map(evt => {
                                        const inscrito = isParticipating(`${evt._id}`);
                                        return (
                                            <div key={`${evt._id}`} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm hover:border-blue-300 transition-colors">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-slate-800 pr-2">{evt.eventName}</span>
                                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold whitespace-nowrap ${evt.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                                        {evt.isOpen ? 'Vagas Abertas' : 'Encerrado'}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-xs mb-4 line-clamp-2">{evt.eventDescription}</p>

                                                {!inscrito ? (
                                                    <button
                                                        onClick={() => handleRegister(evt)}
                                                        disabled={!evt.isOpen}
                                                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${evt.isOpen ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                                    >
                                                        {evt.isOpen ? 'Garantir Vaga' : 'Inscrições Encerradas'}
                                                    </button>
                                                ) : (
                                                    <div className="w-full text-center py-2.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200">
                                                        ✓ Inscrito
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* COLUNA 2: MEU CRONOGRAMA */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">⏱️ Minha Agenda</h2>

                        {mySchedule.length === 0 ? (
                            <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-200">
                                <p className="text-slate-500 text-sm">Sua agenda está livre.</p>
                            </div>
                        ) : (
                            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                                {mySchedule.map(part => (
                                    <div key={`${part._id}`} className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1.5 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-white"></div>

                                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                            <h4 className="font-bold text-slate-800 text-sm mb-1">{part.eventId.eventName}</h4>
                                            <p className="text-blue-600 text-xs font-semibold mb-4">{part.eventId.createdAt.split('-').reverse().join('/')}</p>

                                            <button
                                                onClick={() => handleUnregister(`${part._id}`, part.eventId)}
                                                className="w-full text-xs py-2 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors font-medium"
                                            >
                                                Cancelar Inscrição
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* COLUNA 3: EVENTOS PERDIDOS */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">🔒 Histórico Fechado</h2>
                            <p className="text-xs text-slate-500 mt-1">Eventos que já encerraram as inscrições.</p>
                        </div>

                        {missedEvents.length === 0 ? (
                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                                <p className="text-emerald-700 font-medium text-sm">
                                    Tudo em dia! Você não perdeu nada.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {missedEvents.map(evt => (
                                    <div key={`${evt._id}`} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                                        <h4 className="font-semibold text-slate-600 text-sm">{evt.eventName}</h4>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-400">Data: {evt.createdAt.split('-').reverse().join('/')}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>

            </div>
        </main>
    );
}