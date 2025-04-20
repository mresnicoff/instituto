import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
    },
  });
  const paymentData = await response.json();

  return NextResponse.json({ status: paymentData.status });
}