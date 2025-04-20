"use client";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  Select,
  useToast
} from '@chakra-ui/react';
import SubjectsSelector from './SubjectsSelector';
import { useEffect } from 'react';
const RoleForm = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const toast = useToast();
  const [userExists, setUserExists] = useState(false);
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [selectedMaterias, setSelectedMaterias] = useState([]);

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
        if (exists) {
          setUserExists(true);
          if (user && user.rol !== "Profesor") {
            router.push('/'); // or whatever root path you consider
          }
          if (user && user.rol == "Profesor") {
            router.push('/disponibilidades'); // or whatever root path you consider
          }
        }
      }
    };
    checkUser();
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... existing logic for validation ...

    try {
      const res = await fetch('/api/checkuser', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          nombre: session.user.nombre || session.user.name,
          avatar: session.user.avatar || session.user.picture,
          rol: role,
          password: password,
          materias: selectedMaterias, // Pass the selected subjects
        }),
      });
      toast({
        title: "Éxito",
        description: "Rol, contraseña y materias guardados correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push('/disponibilidades'); // Redirect to main page after saving information
    } catch (error) {
      console.error("Error al guardar la información del usuario:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la información.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (userExists) return null; // If user already exists, don't show the form

  return (
    <Box p={8} mx="auto" my={10}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="role" maxW="300px" mx="auto">
            <FormLabel>Selecciona tu rol</FormLabel>
            <Select placeholder="Selecciona un rol" onChange={(e) => setRole(e.target.value)}>
              <option value="Alumno">Alumno</option>
              <option value="Padre">Padre</option>
              <option value="Profesor">Profesor</option>
              {/* Add more roles as needed */}
            </Select>
          </FormControl>
          <FormControl id="password" maxW="300px" mx="auto">
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" onChange={(e) => setPassword(e.target.value)} />
          </FormControl>

          {role === 'Profesor' && <SubjectsSelector session={session} setSelectedMaterias={setSelectedMaterias} />}

          <Button type="submit">Guardar</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RoleForm;