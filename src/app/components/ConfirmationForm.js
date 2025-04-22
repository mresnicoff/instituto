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

export const dynamic = 'force-dynamic';



const ConfirmationForm = () => {
  const searchParams = useSearchParams();
  const [paymentOption, setPaymentOption] = useState('50%');
  const [qrVisible, setQrVisible] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [externalReference, setExternalReference] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const toast = useToast();

  const reservationData = {
    date: searchParams?.get('date') || 'No disponible',
    hour: searchParams?.get('hour') || 'No disponible',
    subject: searchParams?.get('subject') || 'No disponible',
    professor: searchParams?.get('professor') || 'No disponible',
    alumno: searchParams?.get('alumno') || 'No disponible',
    importe: searchParams?.get('importe') || 'No disponible',
    profesorId: searchParams?.get('profesorId') || 'No disponible',
    alumnoId: searchParams?.get('alumnoId') || 'No disponible',
  };

  async function fetchPreference(amount) {
    try {

      const preferenceResponse = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const preferenceData = await preferenceResponse.json();

      if (preferenceData.error) throw new Error(preferenceData.error);

      setQrUrl(preferenceData.init_point);
      setExternalReference(preferenceData.external_reference);
      setQrVisible(true);
    } catch (error) {
      console.error('Error al generar el QR:', error);
      toast({
        title: 'Error al generar el QR',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }

  const handleGenerateQR = () => {
    const amount = paymentOption === '50%' ? 2500 : 5000;

    fetchPreference(amount);
  };

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
        <Text>Materia: {reservationData.subject}</Text>
        <Text>Profesor: {reservationData.professor}</Text>
        <Text>Alumno: {reservationData.alumno}</Text>
        <Text>Fecha: {reservationData.date}</Text>
        <Text>Hora: {reservationData.hour ? `${reservationData.hour}:00` : 'No disponible'}</Text>
        <Text>Importe total: ${reservationData.importe}</Text>
        <Text>
          Monto a pagar: ${paymentOption === '50%' ? 2500 : 5000} ({paymentOption})
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