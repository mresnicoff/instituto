import { prisma } from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const materias = await prisma.instmateria.findMany({
      select: {
        nombre: true
      }
    });

    if (!materias) {
      return NextResponse.json({ error: 'No se encontraron materias' }, { status: 404 });
    }
    return NextResponse.json(materias, { status: 200 });
  } catch (error) {
    console.error('Error al obtener materias:', error);
    return NextResponse.json({ 
      error: 'Error al obtener datos', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}