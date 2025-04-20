import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { 
  Box, 
  Checkbox, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

const AvailabilityForm = () => {
  const [availability, setAvailability] = useState({});
  const [dates, setDates] = useState([]);
   // Colores que varían según el modo (claro/oscuro)
   const bgColor = useColorModeValue('white', 'gray.800');
   const borderColor = useColorModeValue('gray.200', 'gray.500');
   const textColor = useColorModeValue('black', 'white');
   const headerBgColor = useColorModeValue('gray.300', 'gray.700');
   const evenRowBgColor = useColorModeValue('gray.50', 'gray.900');
   const oddRowBgColor = useColorModeValue('white', 'gray.800');
   const weekendBgColor = useColorModeValue('red.50', 'red.900');
   const hourSelectorBgColor = useColorModeValue('gray.300', 'gray.700');
  const { data: session } = useSession();
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Encuentra el primer domingo después de hoy
    let currentDate = new Date(tomorrow);
    while (currentDate.getDay() !== 0) { // 0 es domingo
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Suma 7 días al primer domingo encontrado para llegar al domingo de la semana siguiente
    const lastDay = new Date(currentDate);
    lastDay.setDate(currentDate.getDate() + 7);

    const days = Array.from({ length: (lastDay - tomorrow) / (1000 * 60 * 60 * 24) + 1 }, (_, i) => {
      const date = new Date(tomorrow);
      date.setDate(tomorrow.getDate() + i);
      return {
        date,
        dayName: date.toLocaleDateString('es-ES', { weekday: 'long' }),
        dayNumber: date.getDate()
      };
    });
    setDates(days);

    // Inicializa la disponibilidad para cada hora en cada día
    let initialAvailability = {};
    for (let day of days) {
      for (let hour = 7; hour <= 23; hour++) {
        initialAvailability[`${day.date.toISOString().split('T')[0]}-${hour}`] = false;
      }
    }
    setAvailability(initialAvailability);
  }, []);

  useEffect(() => {
    if (session?.accessToken) {
      const fetchEvents = async () => {
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}`, {
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setEvents(data.items || []);
        } else {
          console.error('Error al obtener eventos:', response.statusText);
        }
      };

      fetchEvents();
    }
  }, [session]);

    // Función para verificar si un horario está ocupado por un evento
    const isTimeSlotOccupied = (date, hour) => {
        const eventDate = new Date(date);
        eventDate.setHours(hour, 0, 0, 0); // Ajusta al inicio de la hora dada
        
        return events.some(event => {
          const start = new Date(event.start.dateTime || event.start.date);
          const end = new Date(event.end.dateTime || event.end.date);
          return eventDate >= start && eventDate < end;
        });
      };

  const toggleAllHours = (hour) => {
    setAvailability(prev => {
      const updated = { ...prev };
      dates.forEach(day => {
        const key = `${day.date.toISOString().split('T')[0]}-${hour}`;
        updated[key] = !prev[key];
      });
      return updated;
    });
  };

  const toggleDay = (day) => {
    setAvailability(prev => {
      const updated = { ...prev };
      for (let hour = 7; hour <= 23; hour++) {
        const key = `${day.date.toISOString().split('T')[0]}-${hour}`;
        updated[key] = !prev[key];
      }
      return updated;
    });
  };

  const toggleHour = (day, hour) => {
    const key = `${day.date.toISOString().split('T')[0]}-${hour}`;
    setAvailability(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Box maxWidth="90%" mx="auto" bg={bgColor} color={textColor} p={4} borderWidth="1px" borderColor={borderColor}>
      <Text mb={4} fontWeight="bold">Indicá tu disponibilidad horaria desde mañana hasta el domingo de la otra semana:</Text>
      <Table variant="simple" size="sm">
        <Thead bg={headerBgColor}>
          <Tr>
            <Th textAlign="center"></Th>
            {dates.map((day, index) => (
              <Th 
                key={index} 
                textAlign="center" 
                bg={day.date.getDay() === 0 || day.date.getDay() === 6 ? weekendBgColor : headerBgColor}
              >
                <Box display="flex" flexDirection="column" alignItems="center">
                {occupied ? 
                    <span style={{ color: 'red' }}>X</span> :    
                  <Checkbox 
                    isChecked={Array.from({ length: 17 }, (_, hour) => hour + 7).every(h => availability[`${day.date.toISOString().split('T')[0]}-${h}`])}
                    onChange={() => toggleDay(day)}
                  />}
                  {day.dayName} {day.dayNumber}
                </Box>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {Array.from({ length: 17 }, (_, hour) => hour + 7).map(hour => (
            <Tr key={hour} bg={(hour % 2 === 0) ? evenRowBgColor : oddRowBgColor}>
<Td textAlign="left" bg={hourSelectorBgColor} padding="0.5rem">
  <Box display="flex" justifyContent="space-between" alignItems="center">
    <Text>{hour}:00</Text>
    <Checkbox 
      isChecked={dates.every(day => availability[`${day.date.toISOString().split('T')[0]}-${hour}`])}
      onChange={() => toggleAllHours(hour)}
      colorScheme="blue"
    />
  </Box>
</Td>
              {dates.map((day, index) => (
                <Td 
                  key={index} 
                  textAlign="center" 
                  bg={(day.date.getDay() === 0 || day.date.getDay() === 6) ? weekendBgColor : (hour % 2 === 0) ? evenRowBgColor : oddRowBgColor}
                >
                  <Checkbox 
                    isChecked={availability[`${day.date.toISOString().split('T')[0]}-${hour}`]}
                    onChange={() => toggleHour(day, hour)}
                  />
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AvailabilityForm;