import { NextResponse } from 'next/server';
import { prisma } from '../../../db';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req) {
  console.log('Solicitud recibida:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers),
  });

  try {
    const body = await req.json();
    console.log('Cuerpo de la notificación:', body);

    const { action, data } = body;

    // Ignorar notificaciones que no sean payment.updated
    if (action !== 'payment.updated' || !data?.id) {
      console.log('Notificación ignorada:', { action, data });
      return new NextResponse(null, { status: 200 });
    }

    // Configurar cliente de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: { timeout: 5000 },
    });
    const paymentClient = new Payment(client);

    // Obtener detalles del pago
    let payment;
    try {
      payment = await paymentClient.get({ id: data.id });
    } catch (error) {
      if (error.message.includes('not found')) {
        console.warn(`Pago no encontrado: paymentId=${data.id}`);
        return new NextResponse(null, { status: 200 });
      }
      throw error; // Re-lanzar otros errores
    }

    const { status, external_reference } = payment;

    // Validar que external_reference y status estén presentes
    if (!external_reference) {
      console.warn('Notificación sin external_reference:', payment);
      return new NextResponse(null, { status: 200 });
    }

    // Mapear el estado del pago al estado de la reserva
    const statusMap = {
      approved: 'aprobado',
      rejected: 'rechazado',
    };

    const newStatus = statusMap[status];
    if (!newStatus) {
      console.log(`Estado ignorado: ${status}`);
      return new NextResponse(null, { status: 200 });
    }

    // Buscar y actualizar la reserva
    const reservation = await prisma.instreservas.findFirst({
      where: { ref: external_reference },
    });

    if (!reservation) {
      console.warn('Reserva no encontrada para ref:', external_reference);
      return new NextResponse(null, { status: 200 });
    }

    await prisma.instreservas.update({
      where: { id: reservation.id },
      data: { status: newStatus },
    });

    console.log(`Reserva actualizada: ref=${external_reference}, status=${newStatus}`);
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error en el webhook:', {
      message: error.message,
      stack: error.stack,
    });
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}