import { NextResponse } from 'next/server';
import { prisma } from '../../../db';

export async function POST(req) {
  try {
    const { profesorId, alumnoId, date, hour, status, ref } = await req.json();

    // Validar datos requeridos
    if (!profesorId || !alumnoId || !date || !hour || !status || !ref) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos' },
        { status: 400 }
      );
    }

    // Validar que los IDs y hour sean números
    const parsedProfesorId = parseInt(profesorId);
    const parsedAlumnoId = parseInt(alumnoId);
    const parsedHour = parseInt(hour);
    if (
      isNaN(parsedProfesorId) ||
      isNaN(parsedAlumnoId) ||
      isNaN(parsedHour)
    ) {
      return NextResponse.json(
        { error: 'profesorId, alumnoId o hour no son válidos' },
        { status: 400 }
      );
    }

    const newReservation = await prisma.instreservas.create({
      data: {
        profesorId: parsedProfesorId,
        alumnoId: parsedAlumnoId,
        date: date,
        hour: parsedHour,
        status: status,
        ref: ref,
      },
    });

    return NextResponse.json({
      message: 'Reserva creada',
      reservation: newReservation,
    });
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}