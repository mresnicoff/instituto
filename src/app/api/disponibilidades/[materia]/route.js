import { NextResponse } from 'next/server';
import { prisma } from '../../../../db'
export async function GET(request, context) {
  const { materia } =await context.params;

  try {
    const disponibilidades = await prisma.instdisponibilidades.findMany({
      where: {
        user: {
          instmaterias: {
            some: {
              instmateria: {
                nombre: materia
              }
            }
          }
        }
      },
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

    // Si no hay disponibilidades, devuelve un array vacío o un mensaje explicativo
    if (disponibilidades.length === 0) {
      return NextResponse.json({ message: "No hay profesores disponibles para esta materia." }, { status: 200 });
    }

    return NextResponse.json(disponibilidades, { status: 200 });
  } catch (error) {
    console.error('Error al obtener disponibilidades:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}