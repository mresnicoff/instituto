import { NextResponse } from 'next/server';
import { prisma } from '../../../db'
    import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const hashPassword = async (plaintextPassword) => {
            return await bcrypt.hash(plaintextPassword, 10);
        };

        const body = await request.json();
        const { nombre, email, password, avatar, rol } = body; // Ajustado según tu nuevo esquema
console.log(prisma)
        // Verificar si el email ya está registrado
        const emailRegistrado = await prisma.instusuario.findUnique({
            where: { email: email }
        });

        if (emailRegistrado === null) {
            const usuarioData = {
                nombre: nombre,
                email: email,
                passhasheada: await hashPassword(password),
                avatar: avatar,
                rol: rol  // Adaptado para el nuevo campo rol
            };

            console.log(usuarioData);

            // Crear el usuario con Prisma
            await prisma.instusuario.create({
                data: usuarioData
            });

            return NextResponse.json({
                success: true,
                message: "Operación exitosa. Redirigiendo al login"
            }, { status: 201 });
        } else {
            console.log("El email ya está registrado");
            return NextResponse.json({ message: "El email ya está registrado" }, { status: 422 });
        }
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return NextResponse.json({ message: "Server no disponible" }, { status: 500 });
    }
}