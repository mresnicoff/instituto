'use client';
import { useColorMode, Box, Flex, Text, Link } from '@chakra-ui/react';
import TimeSlotModal from './TimeSlotModal';
import { useState } from 'react';
function Calendar({ subject, diasEnBlanco, availabilities, onNewReservation }) {
  const { colorMode } = useColorMode();
  const today = new Date();
  const daysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDayAvailabilities, setSelectedDayAvailabilities] = useState([]);
  const handleOpenModal = (day, hasAvailability) => {
    if (hasAvailability) {
      const dayAvail = availabilities.filter(av => av.date === day);
      console.log(dayAvail)
      setSelectedDayAvailabilities(dayAvail);
      setIsModalOpen(true);
    }
  };
  let day = today.getDay();
  if (day === 0) diasEnBlanco = 6;
  else diasEnBlanco = day - 1;

  const firstMonday = new Date(today);
  firstMonday.setDate(today.getDate() - diasEnBlanco);

  const generateWeek = (startDate) => {
    let week = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      const isPast = currentDay < today;
      const formattedDate = currentDay.toISOString().split('T')[0]; // Formateamos la fecha como 'YYYY-MM-DD'
      const hasAvailability = availabilities.some(av => av.date === formattedDate);
      
      week.push({
        date: currentDay.getDate(),
        dateStr: formattedDate,
        isPast: isPast,
        isBlank: i < diasEnBlanco && startDate === firstMonday,
        hasAvailability: hasAvailability
      });
    }
    return week;
  };

  const weeks = [
    generateWeek(firstMonday),
    generateWeek(new Date(firstMonday.getTime() + (7 * 24 * 60 * 60 * 1000))), 
    generateWeek(new Date(firstMonday.getTime() + (14 * 24 * 60 * 60 * 1000))), 
    generateWeek(new Date(firstMonday.getTime() + (21 * 24 * 60 * 60 * 1000))) 
  ];

  return (
    <Box 
      bg={colorMode === 'light' ? 'white' : 'gray.800'} 
      color={colorMode === 'light' ? 'gray.700' : 'white'} 
      borderWidth="1px" 
      borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'} 
      borderRadius="md" 
      p={4}
    >
      <Flex justifyContent="center" mb={2}>
        {daysOfWeek.map((day, index) => (
          <Text key={index} fontWeight="bold" textAlign="center" w="14.28%">{day}</Text>
        ))}
      </Flex>
      {weeks.map((week, weekIndex) => (
        <Flex key={weekIndex} justifyContent="center" mb={weekIndex < 3 ? 2 : 0}>
          {week.map(({ date, isPast, isBlank, hasAvailability, dateStr }, dayIndex) => (
            <Text 
              key={dayIndex} 
              textAlign="center" 
              w="14.28%" 
            >
              {isBlank ? '' : 
                (isPast ? '' : 
                  (hasAvailability ? 
                    <Link onClick={(e) => {
                      e.preventDefault(); // Prevent default link behavior
                      handleOpenModal(dateStr, hasAvailability);
                    }} color={colorMode === 'light' ? 'blue.500' : 'blue.300'}>{date}</Link> 
                    : date)
                )
              }
            </Text>
          ))}
                <TimeSlotModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        dayAvailabilities={selectedDayAvailabilities}
        onNewReservation={onNewReservation}
        subject={subject}
      />

        </Flex>
      ))}
    </Box>
  );
}

export default Calendar;