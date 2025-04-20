// app/api/deleteAvailability/route.js
import { NextResponse } from 'next/server';
import { prisma } from '../../../db';

export async function POST(req) {
  const { id } = await req.json();
  try {
    await prisma.instdisponibilidades.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Disponibilidad eliminada' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}