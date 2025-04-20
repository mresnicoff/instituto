import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  const session = request.headers.get('authorization');

  if (!session) {
    return NextResponse.json({ success: false, message: 'No se proporcionó información de sesión' }, { status: 401 });
  }

  try {
    const { availability } = await request.json();

    // Ajustamos la lógica para verificar si el token es "undefined" o no existe
    const tokenParts = session.split(' ');
    const accessToken = tokenParts[1] === 'undefined' ? null : tokenParts[1];

    if (accessToken) {
      // Si hay un accessToken válido, asumimos que es de Google y buscamos el email
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Error al obtener información del usuario de Google');
      }

      const userData = await userResponse.json();
      const userEmail = userData.email;

      const user = await prisma.instusuario.findUnique({
        where: {
          email: userEmail
        }
      });

      if (!user) {
        return NextResponse.json({ success: false, message: 'Usuario no encontrado' }, { status: 404 });
      }

      // Actualizamos el userId en la disponibilidad
      const updatedAvailability = availability.map(entry => ({
        ...entry,
        userId: user.id // Usamos el id del usuario encontrado en la base de datos
      }));

      await prisma.Instdisponibilidades.createMany({
        data: updatedAvailability,
      });

      return NextResponse.json({ success: true, message: 'Disponibilidad guardada con éxito para Google' });
    } else {
      // Si el token es 'undefined' o no hay token, no modificamos el userId
      await prisma.Instdisponibilidades.createMany({
        data: availability,
      });

      return NextResponse.json({ success: true, message: 'Disponibilidad guardada con éxito sin autenticación de Google' });
    }
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message, error.stack);
    return NextResponse.json({ success: false, message: 'Error al procesar la solicitud', error: error.message }, { status: 500 });
  }
}