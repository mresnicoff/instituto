// GoogleCalendarEvents.js
'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from "next-auth/react";

const GoogleCalendarEvents = () => {
  const { data: session } = useSession();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Hola",session)
    if (session?.accessToken) {
      fetchEvents(session.accessToken);
  
    }
  }, [session]);

  const fetchEvents = async (accessToken) => {
    console.log("entró al fetch")
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setEvents(data.items || []);
    } else {
      console.error('Error al obtener eventos:', response.statusText);
    }
  };

  return (
    <div>
      <h2>Eventos de Google Calendar</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.summary} - {new Date(event.start.dateTime).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendarEvents;