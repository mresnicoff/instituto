'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Radio,
  RadioGroup,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import QRCodeGenerator from './QRCodeGenerator';
import { useSearchParams } from 'next/navigation';

const ConfirmationForm = () => {
  const searchParams = useSearchParams();
  const [paymentOption, setPaymentOption] = useState('50%');
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const toast = useToast();

  // Obtener datos de la reserva desde query params
  const reservationData = {
    date: searchParams.get('date'),
    hour: searchParams.get('hour'),
    subject: searchParams.get('subject'),
    professor: searchParams.get('professor'),
    alumno: searchParams.get('alumno'),
    importe: searchParams.get('importe'),
    profesorId: searchParams.get('profesorId'),
    alumnoId: searchParams.get('alumnoId'),
  };

  // Función para crear la preferencia y la reserva
  async function fetchPreference(amount) {
    try {
      // Validar datos requeridos
      const requiredFields = ['date', 'hour', 'profesorId', 'alumnoId'];
      const missingFields = requiredFields.filter(
        (field) => !reservationData[field]
      );
      if (missingFields.length > 0) {
        throw new Error(
          `Faltan datos de la reserva: ${missingFields.join(', ')}`
        );
      }

      // Asegurarse de que hour, profesorId y alumnoId sean números válidos
      const parsedHour = parseInt(reservationData.hour);
      const parsedProfesorId = parseInt(reservationData.profesorId);
      const parsedAlumnoId = parseInt(reservationData.alumnoId);
      if (isNaN(parsedHour) || isNaN(parsedProfesorId) || isNaN(parsedAlumnoId)) {
        throw new Error('Hora, profesorId o alumnoId no son válidos');
      }

      // Llamar a /api/create-preference
      const preferenceResponse = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const preferenceData = await preferenceResponse.json();
      if (preferenceData.error) throw new Error(preferenceData.error);

      // Crear la reserva
      const createReservationResponse = await fetch('/api/create-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profesorId: parsedProfesorId,
          alumnoId: parsedAlumnoId,
          date: reservationData.date,
          hour: parsedHour,
          status: 'pendiente',
          ref: preferenceData.external_reference,
        }),
      });

      if (!createReservationResponse.ok) {
        const errorData = await createReservationResponse.json();
        throw new Error(errorData.error || 'Error al crear la reserva');
      }

      setQrUrl(preferenceData.init_point);
      setExternalReference(preferenceData.external_reference);
      setQrVisible(true);
    } catch (error) {
      toast({
        title: 'Error al generar el QR',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error:', error);
    }
  }

  // Manejar el clic en "Generar Código QR"
  const handleGenerateQR = () => {
    const amount = paymentOption === '50%' ? 2500 : 5000;
    fetchPreference(amount);
  };

  // Polling para consultar el estado del pago
  useEffect(() => {
    if (!externalReference || paymentStatus !== 'pending') return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/consultar-estado?external_reference=${externalReference}`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setPaymentStatus(data.status);
        if (data.status === 'approved') {
          toast({
            title: 'Pago aprobado',
            description: 'Tu reserva está siendo procesada.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          setQrVisible(false);
        } else if (data.status === 'rejected') {
          toast({
            title: 'Pago rechazado',
            description: 'Por favor, intenta de nuevo.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          setQrVisible(false);
        }
      } catch (error) {
        console.error('Error al consultar estado:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [externalReference, paymentStatus, toast]);

  return (
    <Box p={5}>
      <Text fontSize="xl" mb={4}>Confirma la reserva:</Text>
      <VStack spacing={4} align="start">
        <Text fontWeight="bold">Detalles de la reserva:</Text>
        <Text>Materia: {reservationData.subject || 'No disponible'}</Text>
        <Text>Profesor: {reservationData.professor || 'No disponible'}</Text>
        <Text>Alumno: {reservationData.alumno || 'No disponible'}</Text>
        <Text>Fecha: {reservationData.date || 'No disponible'}</Text>
        <Text>Hora: {reservationData.hour ? `${reservationData.hour}:00` : 'No disponible'}</Text>
        <Text>Importe total: ${reservationData.importe || 'No disponible'}</Text>
        <Text>
          Monto a pagar: ${paymentOption === '50%' ? 2500 : 5000} (
          {paymentOption})
        </Text>

        <RadioGroup onChange={setPaymentOption} value={paymentOption}>
          <VStack align="start">
            <Radio value="50%">Abonar 50% en concepto de reserva</Radio>
            <Radio value="100%">Abonar 100%</Radio>
          </VStack>
        </RadioGroup>

        <Box mt={4}>
          <Text mb={2}>Código QR para el pago:</Text>
          {paymentStatus === 'pending' && qrVisible ? (
            <QRCodeGenerator url={qrUrl} />
          ) : paymentStatus === 'approved' ? (
            <Box>
              <Text color="green.500" fontWeight="bold">
                ¡Pago aprobado! Procesando tu reserva...
              </Text>
            </Box>
          ) : paymentStatus === 'rejected' ? (
            <Box>
              <Text color="red.500" fontWeight="bold">
                Pago rechazado. Por favor, intenta de nuevo.
              </Text>
              <Button colorScheme="blue" mt={4} onClick={handleGenerateQR}>
                Generar Nuevo QR
              </Button>
            </Box>
          ) : (
            <Button colorScheme="blue" mt={4} onClick={handleGenerateQR}>
              Generar Código QR
            </Button>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default ConfirmationForm;