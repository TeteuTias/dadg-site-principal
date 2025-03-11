// app/eventos/page.tsx
export default async function EventosPage() {
    // Dados fornecidos:
    const calendarId =
      "72ee8fd925b7763088ba56507e290d87a06ec96dc659835a3868278afb572b3e@group.calendar.google.com";
    const apiKey = "AIzaSyAwx5ro7On2LL7NKdJlSVR93P72Ids67gw";
  
    // Busca eventos a partir do momento atual
    const timeMin = new Date().toISOString();
  
    // Constrói a URL da API com os parâmetros desejados:
    const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime`;
  
    // A opção revalidate: 60 faz com que a página seja revalidada a cada 60 segundos
    const res = await fetch(apiUrl, { next: { revalidate: 60 } });
    const data = await res.json();
    const events = data.items || [];
  
    return (
      <main className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Próximos Eventos</h1>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event: any) => (
                <div key={event.id} className="bg-white rounded shadow p-6">
                  <h2 className="text-xl font-semibold mb-2">{event.summary}</h2>
                  <p className="text-gray-600 mb-2">
                    <strong>Início:</strong>{" "}
                    {event.start.dateTime
                      ? new Date(event.start.dateTime).toLocaleString("pt-BR")
                      : event.start.date}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Fim:</strong>{" "}
                    {event.end.dateTime
                      ? new Date(event.end.dateTime).toLocaleString("pt-BR")
                      : event.end.date}
                  </p>
                  {event.description && (
                    <p className="text-gray-700 mb-2">{event.description}</p>
                  )}
                  <a
                    href={event.htmlLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-blue-500 hover:underline"
                  >
                    Ver no Google Calendar
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-700">
              Nenhum evento encontrado.
            </p>
          )}
        </div>
      </main>
    );
  }
  