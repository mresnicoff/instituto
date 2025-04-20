'use client';
import { useState, useEffect } from 'react';
import { useColorMode, Box, Flex, Heading, Text, Card, CardBody, CardHeader, CardFooter, Button, Select, Avatar } from '@chakra-ui/react';
import Calendar from './Calendar';

function StudentDashboard() {
  const { colorMode } = useColorMode();
  const [availabilities, setAvailabilities] = useState([]);
  const [filteredAvailabilities, setFilteredAvailabilities] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedProfessors, setSelectedProfessors] = useState([]); // Mantener el estado de los profesores seleccionados
  const [professors, setProfessors] = useState([]); // Lista de profesores

  // Para manejar el mes actual
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('es-ES', { month: 'long' });
  const currentDay = currentDate.getDate();
  const currentDayOfWeek = currentDate.getDay();

  useEffect(() => {
    let endpoint = '/api/disponibilidades';
    if (selectedSubject) {
      endpoint += `/${encodeURIComponent(selectedSubject)}`;
    }
    
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message) { // Manejar el caso de que venga un mensaje
          console.log(data.message); // O haz algo más útil con este mensaje
          setAvailabilities([]);
          setUsers([]); // Limpiar usuarios si no hay disponibilidades
          setSelectedUsers([]); // Limpiar selección
        } else {
          setAvailabilities(data);
          const uniqueUsers = data.reduce((acc, curr) => {
            if (curr.user && !acc.some(user => user.id === curr.user.id)) {
              acc.push(curr.user);
            }
            return acc;
          }, []);
          setUsers(uniqueUsers.map(user => ({ ...user, selected: true })));
          setSelectedUsers(uniqueUsers.map(user => user.id));
        }
      })
      .catch(error => {
        console.error('Error fetching or parsing disponibilidades:', error);
      });
  }, [selectedSubject]);

  useEffect(() => {
    fetch('/api/instmateria') 
      .then(response => response.json())
      .then(data => {
        setSubjects(data.map(materia => ({
          value: materia.nombre, 
          label: materia.nombre
        })));
      })
      .catch(error => console.error('Error fetching subjects:', error));
  }, []);

  useEffect(() => {
    // Filtrar disponibilidades basadas en los profesores seleccionados
    const filtered = availabilities.filter(av => selectedProfessors.includes(av.profesor));
    setFilteredAvailabilities(filtered);
  }, [selectedSubject, availabilities, selectedProfessors]);

  const toggleProfessor = (name) => {
    setSelectedProfessors(prev => {
      const newSelection = prev.includes(name) 
        ? prev.filter(p => p !== name) 
        : [...prev, name];
      return newSelection;
    });

    setProfessors(prev => 
      prev.map(prof => 
        prof.name === name ? { ...prof, selected: !prof.selected } : prof
      )
    );
  };

  return (
    <Box bg={colorMode === 'light' ? 'gray.50' : 'gray.800'} minH="100vh" p={4}>
      <Heading mb={4} as="h2" size="lg">Reserva una clase de:</Heading>
      
      <Select 
        placeholder="¿Quieres una clase de qué materia?"
        onChange={(e) => setSelectedSubject(e.target.value)}
        mb={4}
        width="fit-content" 
        size="md"
      >
        {subjects.map((subject, index) => (
          <option key={index} value={subject.value}>{subject.label}</option>
        ))}
      </Select>

      <Flex>
        <Box flex="1" mr={4}>
          <Text fontSize="lg" fontWeight="bold" mb={2}>Selecciona un profesor (optativo)</Text>
          {professors.map(professor => (
            <Card 
              key={professor.name} 
              mb={2} 
              onClick={() => toggleProfessor(professor.name)}
              bg={professor.selected ? 'blue.100' : 'white'}
            >
              <CardBody>
                <Flex align="center">
                  <Avatar name={professor.name} size="sm" mr={2} />
                  <Text>{professor.name}</Text>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Box>

        <Box flex="1">
          <Text fontSize="lg" fontWeight="bold" mb={2}>Selecciona la fecha para tu clase</Text>
          <Calendar availabilities={filteredAvailabilities} />
        </Box>
      </Flex>
    </Box>
  );
}

export default StudentDashboard;