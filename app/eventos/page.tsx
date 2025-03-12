// app/eventos/page.tsx
import React from 'react';

interface Event {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
}

interface CalendarData {
  items: Event[];
}

async function getEvents(): Promise<CalendarData> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_API_KEY;
  const timeMin = new Date().toISOString();

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId as string
    )}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`
  );

  if (!res.ok) {
    throw new Error('Erro ao buscar eventos');
  }
  return res.json();
}

export default async function EventsPage() {
  const data = await getEvents();

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Próximos Eventos</h1>
      <div className="max-w-4xl mx-auto grid gap-6 sm:grid-cols-2">
        {data.items.map((event) => (
          <div key={event.id} className="p-6 bg-white rounded-lg shadow-lg transition transform hover:scale-105">
            <h2 className="text-xl font-semibold mb-2">{event.summary}</h2>
            <p className="text-gray-600 mb-1">
              <span className="font-bold">Início:</span>{" "}
              {event.start.dateTime
                ? new Date(event.start.dateTime).toLocaleString()
                : event.start.date}
            </p>
            {event.end && (
              <p className="text-gray-600">
                <span className="font-bold">Fim:</span>{" "}
                {event.end.dateTime
                  ? new Date(event.end.dateTime).toLocaleString()
                  : event.end.date}
              </p>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
