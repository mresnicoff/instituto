"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Text, 
  Grid,
  Checkbox
} from '@chakra-ui/react';

const SubjectsSelector = ({ session, setSelectedMaterias }) => {
  const [materias, setMaterias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const loadMaterias = async () => {
      const res = await fetch('/api/materias');
      const data = await res.json();
      setMaterias(data);
    };
    loadMaterias();
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      if (session?.user?.email) {
        const res = await fetch('/api/checkuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session.user.email }),
        });
        const { exists, user } = await res.json();
        if (exists && user.rol === "Profesor") {
          router.push('/disponibilidades');
        }
      }
    };
    checkUser();
  }, [session, router]);

  return (
    <Box>
      <Text fontWeight="bold" mb={2}>¿Qué materias puedes dar?</Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={2}>
        {materias.map(materia => (
          <Checkbox 
            key={materia.id} 
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedMaterias(prev => [...prev, materia.id]);
              } else {
                setSelectedMaterias(prev => prev.filter(id => id !== materia.id));
              }
            }}
          >
            {materia.nombre}
          </Checkbox>
        ))}
      </Grid>
    </Box>
  );
};

export default SubjectsSelector;