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
// 4. PÁGINA PRINCIPAL
// ==========================================
export default function EventDashboard() {
    const [events, setEvents] = useState<IEventCertificate[]>([]);
    const [participations, setParticipations] = useState<IEventParticipantWithEventPopulate[]>([]);
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
                const data2 = await fetch(`/api/v1/events/closedForRegistration/2026-05`)
                if (!data2.ok) {
                    alert('Erro ao carregar eventos. Usando dados mockados.');
                    return;
                }
                const json2: { data: IEventCertificate[] } = await data2.json();
                setEvents(json2.data);
                // ==== ---- ====
                // ==== ---- ====
                const data3 = await fetch(`/api/v1/events/openForRegistration/2026-05`)
                if (!data3.ok) {
                    alert('Erro ao carregar eventos. Usando dados mockados.');
                    return;
                }
                const json3: { data: IEventCertificate[] } = await data3.json();
                setEvents((prev) => [...prev, ...json3.data]);
            }
            FETCH()
        }
    }, [isLoading])

    const isParticipating = (eventId: string) => participations.some((p) => `${p.eventId._id}` === `${eventId}`);
    const canRegister = (event: IEventCertificate) => {
        const { status, registrationEndDate } = event.statusDetails;

        if (status !== 'PUBLISHED_OPEN') {
            return false;
        }

        if (!registrationEndDate) {
            return false;
        }

        return new Date(registrationEndDate).getTime() >= Date.now();
    };



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
                    </section>


                </div>

                {/* COLUNA 2: MEU CRONOGRAMA */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <h2 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">⏱️ Minha Agenda</h2>
                        <div>
                            {participations.length === 0 ? (
                                <p className="text-sm text-slate-500">Você ainda não se inscreveu em nenhum evento. Explore os eventos disponíveis e participe!</p>
                            )
                                :
                                <>
                                    {
                                        participations.map((participation) => {
                                            const registrationClosed = !canRegister(participation.eventId);

                                            return (
                                                <div key={participation._id.toString()} className="border border-slate-200 rounded-lg p-4 mb-4">
                                                    <h3 className="text-md font-semibold text-slate-800">{participation.eventId.eventName}</h3>
                                                    <p className="text-sm text-slate-500">{participation.eventId.eventDescription}</p>
                                                    <p className="text-xs text-slate-400 mt-2">Possível se desinscrever até: {participation.eventId.statusDetails.registrationEndDate ? new Date(participation.eventId.statusDetails.registrationEndDate).toLocaleDateString() : 'sem data informada'}</p>
                                                    {registrationClosed ? (
                                                        <p className="mt-3 text-sm font-medium text-red-600">
                                                            Este evento está fechado para inscrição porque o status não permite inscrição, não há data de encerramento cadastrada ou o prazo de inscrição já expirou.
                                                        </p>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                fetch(`/api/v1/events/${participation.eventId._id}/registration`, { method: 'DELETE' }).then(() => { })
                                                            }}
                                                            className="mt-3 px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            Desinscrever-se
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            }
                        </div>
                    </section>
                </div>

                {/* COLUNA 3: EVENTOS PERDIDOS */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">🔒 Histórico Fechado</h2>
                            <p className="text-xs text-slate-500 mt-1">Eventos que já encerraram as inscrições.</p>
                        </div>
                    </section>
                </div>

                {/* COLUNA 4: EVENTOS DISPONÍVEIS PARA INSCRIÇÃO */}
                <div className="lg:col-span-1">
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-full">
                        <div className="mb-6 border-b border-slate-100 pb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">� Eventos Disponíveis</h2>
                            <p className="text-xs text-slate-500 mt-1">Eventos que ainda estão abertos para inscrição.</p>
                        </div>
                        <div>
                            {events.filter((e) => e.statusDetails.status === 'PUBLISHED_OPEN').length === 0 ? (
                                <p className="text-sm text-slate-500">Nenhum evento disponível para inscrição no momento.</p>
                            )
                                :
                                <>
                                    {
                                        events.filter((e) => e.statusDetails.status === 'PUBLISHED_OPEN').map((event) => (
                                            <div key={event._id.toString()} className="border border-slate-200 rounded-lg p-4 mb-4">
                                                <h3 className="text-md font-semibold text-slate-800">{event.eventName}</h3>
                                                <p className="text-sm text-slate-500">{event.eventDescription}</p>
                                                <p className="text-xs text-slate-400 mt-2">Inscrições abertas até: {new Date(event.statusDetails.registrationEndDate!).toLocaleDateString()}</p>
                                                <p className="text-xs text-slate-400 mt-1">{event.registrationCount} / {event.maxParticipants} inscritos</p>
                                                {canRegister(event) ? (
                                                    <button
                                                        onClick={() => {
                                                            // /api/v1/events/[id]/registration/router.ts
                                                            fetch(`/api/v1/events/${event._id}/registration`, { method: 'POST' }).then(() => { })
                                                        }
                                                        }
                                                        disabled={isParticipating(event._id.toString())}
                                                        className={`mt-3 px-4 py-2 rounded-md text-sm font-medium ${isParticipating(event._id.toString()) ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                                    >
                                                        {isParticipating(event._id.toString()) ? 'Inscrito' : 'Inscrever-se'}
                                                    </button>
                                                ) : (
                                                    <p className="mt-3 text-sm font-medium text-red-600">
                                                        Este evento está fechado para inscrição porque o status não permite inscrição, não há data de encerramento cadastrada ou o prazo de inscrição já expirou.
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    }
                                </>
                            }
                        </div>

                    </section>
                </div>

            </div>
        </main>
    );
}