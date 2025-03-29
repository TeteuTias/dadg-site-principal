import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
        return NextResponse.json({ items: [] });
    }
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const apiKey = process.env.GOOGLE_API_KEY;

    try {
        const res = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                calendarId as string
            )}/events?key=${apiKey}&timeMin=${start}&timeMax=${end}&singleEvents=true&orderBy=startTime`
        );

        if (!res.ok) {
            throw new Error('Erro ao buscar eventos');
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ items: [] });
    }
}
