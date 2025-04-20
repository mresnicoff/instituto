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
  const [selectedUsers, setSelectedUsers] = useState([]); // Maintain the state of selected users
  const [users, setUsers] = useState([]); // List of users with their availabilities
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  // For handling the current month
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('es-ES', { month: 'long' });
  const currentDay = currentDate.getDate();
  const currentDayOfWeek = currentDate.getDay();
  const handleNewReservation = () => {
    setRefreshTrigger(!refreshTrigger); // Alterna el valor para forzar la re-lectura
  };
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
        if (Array.isArray(data)) {
          setAvailabilities(data);
          const uniqueUsers = data.reduce((acc, curr) => {
            if (curr.user && !acc.some(user => user.id === curr.user.id)) {
              acc.push(curr.user);
            }
            return acc;
          }, []);

          setUsers(uniqueUsers.map(user => ({ ...user, selected: true })));
          setSelectedUsers(uniqueUsers.map(user => user.id));
        } else {
          console.log('No array response:', data);
          setAvailabilities([]);
          setUsers([]);
          setSelectedUsers([]);
        }
      })
      .catch(error => {
        console.error('Error fetching or parsing disponibilidades:', error);
      });
  }, [selectedSubject, refreshTrigger]);

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
    const filtered = availabilities.filter(av => selectedUsers.includes(av.user.id));
    setFilteredAvailabilities(filtered);
  }, [selectedSubject, availabilities, selectedUsers]);

  const toggleUser = (id) => {
    setSelectedUsers(prev => {
      const newSelection = prev.includes(id) 
        ? prev.filter(p => p !== id) 
        : [...prev, id];
      return newSelection;
    });

    setUsers(prev => 
      prev.map(user => 
        user.id === id ? { ...user, selected: !user.selected } : user
      )
    );
  };

  // Helper function to determine background color based on selection
  const getCardColor = (isSelected) => {
    return isSelected ? (colorMode === 'light' ? 'green.100' : 'green.700') : (colorMode === 'light' ? 'white' : 'gray.700');
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
          <Text fontSize="lg" fontWeight="bold" mb={2}>Filtra los profesores preseleccionados (optativo)</Text>
          {users.map(user => (
            <Card 
              key={user.id} 
              mb={2} 
              onClick={() => toggleUser(user.id)}
              bg={getCardColor(user.selected)}
              _hover={{
                bg: colorMode === 'dark' ? 'gray.600' : 'gray.100'
              }}
            >
              <CardBody>
                <Flex align="center">
                  <Avatar src={user.avatar} name={user.nombre} size="sm" mr={2} 
                          bg={colorMode === 'dark' ? 'gray.800' : 'gray.200'}
                          color={colorMode === 'dark' ? 'white' : 'black'}
                  />
                  <Text color={colorMode === 'dark' ? 'white' : 'black'}>{user.nombre}</Text>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Box>

        <Box flex="1">
          <Text fontSize="lg" fontWeight="bold" mb={2}>Selecciona la fecha para tu clase</Text>
          <Calendar   subject={selectedSubject}    onNewReservation={handleNewReservation} availabilities={filteredAvailabilities} />
        </Box>
      </Flex>
    </Box>
  );
}

export default StudentDashboard;