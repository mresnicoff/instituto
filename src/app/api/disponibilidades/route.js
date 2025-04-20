// app/api/disponibilidades/route.js

import { prisma } from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const { materia } = context.params || {};

  try {
    let whereClause = {};
    if (materia) {
      whereClause = {
        user: {
          instmaterias: {
            some: {
              instmateria: {
                nombre: materia
              }
            }
          }
        }
      };
    }

    const disponibilidades = await prisma.instdisponibilidades.findMany({ // Cambia esto para que coincida con tu schema
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            avatar: true,
            email: true
          }
        }
      }
    });
console.log(disponibilidades)
    return NextResponse.json(disponibilidades, { status: 200 });
  } catch (error) {
    console.error('Error al obtener disponibilidades:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}