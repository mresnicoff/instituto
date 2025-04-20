export async function saveAvailability(availability, session) {
  if (!session?.user?.email) {
    console.error('No user session available');
    return;
  }
  console.log(session);

  try {
    const availabilityData = Object.entries(availability)
      .filter(([_, value]) => value === true) // Filtramos para obtener solo los 'true'
      .map(([key, value]) => {
        const parts = key.split('-');
        const date = `${parts[0]}-${parts[1]}-${parts[2]}`; // Reconstruimos la fecha completa
        const hour = parseInt(parts[3], 10); // La hora será el cuarto elemento

        return {
          userId: session.user.id, // Asegúrate de que user.id está disponible
          date: date,
          hour: hour,
          available: value // Aquí siempre será true debido al filtro
        };
      });

    console.log(session.accessToken);

    const response = await fetch('/api/saveAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.accessToken}` // Asumiendo que session es tu objeto de sesión y accessToken es tu token
      },
      body: JSON.stringify({ availability: availabilityData }),
    });

    if (!response.ok) {
      throw new Error('Error al guardar la disponibilidad');
    }
    console.log('Disponibilidad guardada exitosamente');
  } catch (error) {
    console.error('Error al guardar la disponibilidad:', error);
  }
}
