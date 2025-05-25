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
import './ScheduleClient.css';

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

  const fetchEvents = async (month: Date) => {
    setLoading(true);
    try {
      const startMonth = startOfMonth(month).toISOString();
      const endMonth = endOfMonth(month).toISOString();
      console.log('Buscando eventos:', { startMonth, endMonth });
      
      const res = await fetch(
        `/api/get/eventsByDate?start=${startMonth}&end=${endMonth}`
      );
      if (!res.ok) {
        throw new Error('Erro ao buscar eventos');
      }
      const data = await res.json();
      console.log('Eventos recebidos:', data);
      setEvents(data.items || []);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(currentMonth);
  }, [currentMonth]);

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
            className={`calendar-day ${
              !isSameMonth(day, monthStart) ? 'other-month' : ''
            } ${isSameDay(day, selectedDate) ? 'selected' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
          >
            {format(day, 'd')}
            {hasEvent && <span className="event-indicator"></span>}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="calendar-grid">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

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
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="calendar-nav-button"
        >
          Anterior
        </button>
        <h2 className="calendar-title">
          {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="calendar-nav-button"
        >
          Próximo
        </button>
      </div>

      <div className="calendar-weekdays">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {renderCells()}

      <div className="events-list">
        <h3 className="events-title">
          Eventos em {format(selectedDate, 'dd/MM/yyyy')}
        </h3>
        {loading ? (
          <p className="loading-message">Carregando eventos...</p>
        ) : eventsForSelectedDate.length > 0 ? (
          eventsForSelectedDate.map((event) => (
            <div key={event.id} className="event-card">
              <h4 className="event-name">{event.summary}</h4>
              <p className="event-time">
                <span className="font-bold">Início:</span>{' '}
                {event.start.dateTime
                  ? new Date(event.start.dateTime).toLocaleString()
                  : event.start.date}
              </p>
              {event.end && (
                <p className="event-time">
                  <span className="font-bold">Fim:</span>{' '}
                  {event.end.dateTime
                    ? new Date(event.end.dateTime).toLocaleString()
                    : event.end.date}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-events-message">Nenhum evento para este dia.</p>
        )}
      </div>
    </div>
  );
}
