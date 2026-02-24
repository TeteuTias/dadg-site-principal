'use client';

import { ISubscriptionEvents } from '@/app/src/lib/auth0/subscriptionEvents/subscriptionEvents';
import React, { useState } from 'react';
import { ObjectId } from 'bson';
import { useUser } from '@auth0/nextjs-auth0/client';
// 2. Dados de Teste (Mocks) já serializados para o Client Component
const currentUserId = new ObjectId();

const mockEvents: ISubscriptionEvents[] = [
    {
        _id: new ObjectId(),
        title: " string;",
        description: " string;",
        eventDate: new Date(),
        location: " string;",
        type: 'Prática',
        status: 'open',
        registeredUsers: [new ObjectId()], // Lista de IDs dos usuários inscritos
        maxParticipants: 10, // Opcional: limite de vagas
        registeredUsersCounter: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
    }
]
// 3. Componente Principal
export default function EventDashboard() {
    const [activeTab, setActiveTab] = useState<'open' | 'registered' | 'closed'>('open');

    // Lógica de filtragem com os novos campos
    const filteredEvents = mockEvents.filter((event) => {
        const isRegistered = event.registeredUsers.includes(new ObjectId(currentUserId));

        if (activeTab === 'open') return event.status === 'open' && !isRegistered;
        if (activeTab === 'registered') return isRegistered;
        if (activeTab === 'closed') return event.status === 'closed';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Cabeçalho */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Portal de Eventos</h1>
                    <p className="text-gray-600 mt-2">Explore novos eventos ou acompanhe suas inscrições.</p>
                </div>

                {/* Navegação por Abas */}
                <div className="flex space-x-1 bg-gray-200 p-1 rounded-lg mb-8 max-w-md">
                    <button
                        onClick={() => setActiveTab('open')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'open' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Inscrições Abertas
                    </button>
                    <button
                        onClick={() => setActiveTab('registered')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'registered' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Meus Eventos
                    </button>
                    <button
                        onClick={() => setActiveTab('closed')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'closed' ? 'bg-white text-blue-700 shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-300'
                            }`}
                    >
                        Encerrados
                    </button>
                </div>

                {/* Grid de Eventos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => {
                            const isRegistered = event.registeredUsers.includes(new ObjectId(currentUserId))
                            const isFull = event.registeredUsersCounter >= event.maxParticipants;

                            // Converte a string ISO de volta para um formato legível
                            const formattedDate = new Date(event.eventDate).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            });

                            return (
                                <div key={String(event._id)} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-6 flex-grow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-2">
                                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${event.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {event.status === 'open' ? 'Aberto' : 'Encerrado'}
                                                </span>
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                    {event.type}
                                                </span>
                                            </div>
                                            {isRegistered && (
                                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                                    Inscrito
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>

                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <span className="mr-2">📅</span> {formattedDate}
                                            </div>
                                            <div className="flex items-center">
                                                <span className="mr-2">📍</span> {event.location}
                                            </div>
                                            <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                                                <span className="mr-2">👥</span>
                                                <span className={`font-medium ${isFull ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {event.registeredUsersCounter} / {event.maxParticipants} vagas preenchidas
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rodapé de Ações */}
                                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                                        {event.status === 'open' && !isRegistered && !isFull && (
                                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                                Fazer Inscrição
                                            </button>
                                        )}
                                        {event.status === 'open' && !isRegistered && isFull && (
                                            <button disabled className="w-full bg-red-50 text-red-500 border border-red-200 cursor-not-allowed font-medium py-2 px-4 rounded-lg">
                                                Vagas Esgotadas
                                            </button>
                                        )}
                                        {isRegistered && event.status === 'open' && (
                                            <button className="w-full bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors">
                                                Ver Meu Ingresso
                                            </button>
                                        )}
                                        {event.status === 'closed' && (
                                            <button disabled className="w-full bg-gray-200 text-gray-500 cursor-not-allowed font-medium py-2 px-4 rounded-lg">
                                                Evento Finalizado
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200 border-dashed">
                            <span className="text-4xl mb-3">📭</span>
                            <p>Nenhum evento encontrado para esta categoria.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}