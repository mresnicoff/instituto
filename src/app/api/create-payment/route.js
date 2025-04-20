import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextResponse } from 'next/server';

// Configura el cliente de Mercado Pago
const mpConfig = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Crea una instancia de Payment con la configuración
const payment = new Payment(mpConfig);

export async function POST(request) {
  try {
    const { amount, description } = await request.json();

    const paymentData = {
      transaction_amount: Number(amount),
      description: description || 'Reserva de clase',
      payment_method_id: 'qrcode', // Para QR dinámico (puede variar según el país)
      payer: {
        email: 'test_user@example.com', // Usa un email de prueba o del cliente
      },
      notification_url: 'https://68bb-130-41-100-190.ngrok-free.app/api/webhook',
    };

    const result = await payment.create({ body: paymentData });

    return NextResponse.json({
      qrCode: result.body.point_of_interaction?.transaction_data?.qr_code || null,
      paymentId: result.body.id,
    });
  } catch (error) {
    console.error('Error al crear el pago:', error);
    return NextResponse.json(
      { error: 'Error al crear el pago', details: error.message },
      { status: 500 }
    );
  }
}