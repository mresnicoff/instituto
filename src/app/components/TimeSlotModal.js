'use client';
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@chakra-ui/react';

const TimeSlotModal = ({ subject, isOpen, onClose, dayAvailabilities, onNewReservation }) => {
  const timeSlots = Array.from({ length: 17 }, (_, i) => i + 7); // From 7 to 23
  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();

  const handleReservation = async (hour, availability) => {
    const toastId = toast({
      title: 'Generando la reserva...',
      status: 'info',
      duration: null,
      isClosable: true,
      position: 'top',
    });

    if (!availability || !session?.user?.id) {
      console.log(`Clicked on ${hour}:00, but no user is available or session not found`);
      toast.update(toastId, {
        title: 'Fallo al generar la reserva',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Borrar la disponibilidad
      const deleteResponse = await fetch('/api/deleteAvailability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: availability.id }),
      });

      if (!deleteResponse.ok) {
        throw new Error('Error al eliminar la disponibilidad');
      }

      // Verificar el usuario (alumno) para obtener alumnoId
      const checkUserResponse = await fetch('/api/checkuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!checkUserResponse.ok) {
        throw new Error('No se pudo verificar el usuario');
      }

      const { exists, user } = await checkUserResponse.json();
      if (!exists) {
        throw new Error('Usuario no encontrado en la base de datos');
      }

      const alumnoId = user.id;

      // Navegar a la página de confirmación
      const queryString = new URLSearchParams({
        date: availability.date,
        hour: hour.toString(),
        subject: encodeURIComponent(subject),
        professor: encodeURIComponent(availability.user.nombre),
        alumno: encodeURIComponent(session.user.nombre || session.user.email),
        importe: '50000',
        profesorId: availability.userId.toString(), // Pasar profesorId
        alumnoId: alumnoId.toString(), // Pasar alumnoId
      }).toString();
      router.push(`/confirmacion-reserva?${queryString}`);

      onNewReservation();
      onClose();

      toast.update(toastId, {
        title: 'Redirigiendo a confirmación de reserva',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error al manejar la reserva:', error);
      toast.update(toastId, {
        title: 'Error al procesar la reserva',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Selecciona un horario</ModalHeader>
        <ModalCloseButton />
        <ModalBody maxH="60vh" overflowY="auto">
          {timeSlots.map((hour) => {
            const availability = dayAvailabilities.find((av) => av.hour === hour);
            const isAvailable = availability !== undefined;
            return (
              <Box key={hour} mb={1}>
                <Button
                  isDisabled={!isAvailable}
                  onClick={() => handleReservation(hour, availability)}
                  colorScheme={isAvailable ? 'green' : 'gray'}
                  w="100%"
                >
                  {hour}:00
                </Button>
              </Box>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TimeSlotModal;

