import { getSession } from 'next-auth/react';

export async function fetchCalendarEvents() {
  const session = await getSession();
  if (!session) {
    throw new Error("No hay sesión activa");
  }

  console.log("Token de acceso:", session.accessToken); // Verificar el token

  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.error("Error de la API de Google:", errorData); // Mostrar el error de la API
    throw new Error("Error al obtener eventos del calendario");
  }

  const data = await res.json();
  return data.items;
}
