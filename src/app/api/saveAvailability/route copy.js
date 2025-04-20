import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

export async function POST(request) {
  const session = request.headers.get('authorization');

  if (!session) {
    return NextResponse.json({ success: false, message: 'No se proporcionó información de sesión' }, { status: 401 });
  }

  const accessToken = session.split(' ')[1]; // Quita 'Bearer' del token

  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener información del usuario');
    }

    const userData = await response.json();
    const userEmail = userData.email;

    // Aquí tendrías el email del usuario. Continúa con tu lógica de base de datos usando userEmail
    const user = await prisma.instusuario.findUnique({
      where: {
        email: userEmail
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
    }

    const { availability } = await request.json();
    const updatedAvailability = availability.map(entry => ({
      ...entry,
      userId: user.id // Usamos el id del usuario encontrado en la base de datos
    }));

    console.log(prisma.Instdisponibilidades); // Esto debería mostrar los métodos disponibles para el modelo

    await prisma.Instdisponibilidades.createMany({
      data: updatedAvailability,
    });

    return NextResponse.json({ success: true, message: 'Disponibilidad guardada con éxito' });
  } catch (error) {
    console.error('Error al obtener el email del usuario:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'Error al obtener el email del usuario', error: error.message }, { status: 401 });
  }
}