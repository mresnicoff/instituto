// api/materias/route.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Consulta todas las materias desde la base de datos
    const materias = await prisma.instmateria.findMany({
      select: {
        id: true,
        nombre: true,
      },
    });
    return new Response(JSON.stringify(materias), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al obtener materias:', error);
    return new Response(
      JSON.stringify({ error: 'Hubo un error al obtener las materias' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}