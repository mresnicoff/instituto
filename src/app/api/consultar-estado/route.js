import { NextResponse } from 'next/server';
import { prisma } from '../../../db';

export async function GET(req) {
  try {
    // Obtener external_reference de la query string
    const { searchParams } = new URL(req.url);
    const externalReference = searchParams.get('external_reference');

    // Validar que external_reference esté presente
    if (!externalReference) {
      return NextResponse.json(
        { error: 'Falta el parámetro external_reference' },
        { status: 400 }
      );
    }

    // Buscar la reserva en instreservas usando ref
    const reservation = await prisma.instreservas.findFirst({
      where: {
        ref: externalReference,
      },
    });

    // Si no se encuentra la reserva
    if (!reservation) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Mapear el status de la base de datos al formato del frontend
    const statusMap = {
      pendiente: 'pending',
      aprobado: 'approved',
      rechazado: 'rejected',
    };

    const frontendStatus = statusMap[reservation.status] || 'pending';
console.log(externalReference,frontendStatus, reservation.status)
    return NextResponse.json({ status: frontendStatus });
  } catch (error) {
    console.error('Error al consultar el estado:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}