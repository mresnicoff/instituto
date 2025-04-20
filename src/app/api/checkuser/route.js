import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request) {
  const { email } = await request.json();
  const user = await prisma.instusuario.findUnique({
    where: { email },
  });

  return NextResponse.json({ exists: !!user,user:user });
}

export async function PUT(request) {
  const { email, nombre, avatar, rol, password, materias } = await request.json();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el usuario
    const newUser = await prisma.instusuario.create({
      data: {
        email,
        nombre,
        avatar,
        rol,
        passhasheada: hashedPassword,
      },
    });

    if (newUser) {
      // Si se creó el usuario, ahora creamos las relaciones con las materias
      if (materias && materias.length > 0) {
        await prisma.instusuarioInstmateria.createMany({
          data: materias.map(materiaId => ({
            instusuarioId: newUser.id,
            instmateriaId: materiaId
          })),
          skipDuplicates: true, // Esto evita errores si ya existe la relación
        });
      }

      return NextResponse.json({ success: true, message: 'Usuario y materias asociadas guardadas correctamente' });
    } else {
      return NextResponse.json({ success: false, message: 'Error al guardar el usuario' });
    }
  } catch (error) {
    console.error("Error al guardar la información del usuario:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Error al guardar datos", 
      details: error.message 
    });
  }
}