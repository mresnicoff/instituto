import { NextResponse } from 'next/server';
import { prisma } from '../../../db';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(req) {
  try {
    // Obtener el cuerpo de la notificación
    const body = await req.json();
    const { action, data } = body;

    // Ignorar notificaciones que no sean payment.updated
    if (action !== 'payment.updated' || !data?.id) {
      return new NextResponse(null, { status: 200 });
    }

    // Configurar cliente de Mercado Pago
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: { timeout: 5000 },
    });
    const paymentClient = new Payment(client);

    // Obtener detalles del pago
    const payment = await paymentClient.get({ id: data.id });
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
      // Otros estados como 'pending' no actualizan la reserva
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
    console.error('Error en el webhook:', error);
    return new NextResponse(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}