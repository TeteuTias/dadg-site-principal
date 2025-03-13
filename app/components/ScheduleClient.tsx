'use client';

import React, { useState, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

export default function ScheduleClient() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  // Busca os eventos para o mês atual via API
  const fetchEvents = async (month: Date) => {
    setLoading(true);
    try {
      const startMonth = startOfMonth(month).toISOString();
      const endMonth = endOfMonth(month).toISOString();
      const res = await fetch(
        `/api/get/eventsByDate?start=${startMonth}&end=${endMonth}`
      );
      if (!res.ok) {
        throw new Error('Erro ao buscar eventos');
      }
      const data = await res.json();
      setEvents(data.items);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Busca os eventos ao carregar o componente e quando o mês atual mudar
  useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth]);

  // Renderiza as células do calendário com o ponto verde para dias com eventos
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = addDays(startOfWeek(monthEnd, { weekStartsOn: 0 }), 6);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const hasEvent = events.some((event) => {
          let eventDate: Date;
          if (event.start.dateTime) {
            eventDate = new Date(event.start.dateTime);
          } else if (event.start.date) {
            eventDate = new Date(event.start.date);
          } else {
            return false;
          }
          return isSameDay(eventDate, day);
        });

        days.push(
          <div
            key={day.toString()}
            className={`p-2 border border-gray-200 text-center cursor-pointer ${
              !isSameMonth(day, monthStart) ? 'text-gray-400' : ''
            } ${isSameDay(day, selectedDate) ? 'bg-blue-300' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
            {hasEvent && (
              <span className="block w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></span>
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  // Filtra os eventos para o dia selecionado
  const eventsForSelectedDate = events.filter((event) => {
    let eventDate: Date;
    if (event.start.dateTime) {
      eventDate = new Date(event.start.dateTime);
    } else if (event.start.date) {
      eventDate = new Date(event.start.date);
    } else {
      return false;
    }
    return isSameDay(eventDate, selectedDate);
  });

  return (
    <div className="max-w-4xl mx-auto bg-white shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Anterior
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 bg-blue-500 text-white rounded"
        >
          Próximo
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="font-bold text-center">
            {day}
          </div>
        ))}
      </div>

      {renderCells()}

      <div className="mt-6">
        <h3 className="text-2xl font-semibold mb-2">
          Eventos em {format(selectedDate, 'dd/MM/yyyy')}
        </h3>
        {loading ? (
          <p>Carregando eventos...</p>
        ) : eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => (
            <div
              key={event.id}
              className="p-4 mb-2 bg-gray-50 border border-gray-200 rounded"
            >
              <h4 className="text-lg font-bold">{event.summary}</h4>
              <p className="text-gray-600">
                <span className="font-bold">Início:</span>{' '}
                {event.start.dateTime
                  ? new Date(event.start.dateTime).toLocaleString()
                  : event.start.date}
              </p>
              {event.end && (
                <p className="text-gray-600">
                  <span className="font-bold">Fim:</span>{' '}
                  {event.end.dateTime
                    ? new Date(event.end.dateTime).toLocaleString()
                    : event.end.date}
                </p>
              )}
            </div>
          ))
        ) : (
          <p>Nenhum evento para este dia.</p>
        )}
      </div>
    </div>
  );
}
