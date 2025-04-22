import { MercadoPagoConfig, Preference } from 'mercadopago';

// Función para generar un external_reference aleatorio
function generateExternalReference() {
  const randomString = Math.random().toString(36).substr(2, 8); // 8 caracteres aleatorios
  return `RES-${randomString}`; // Ejemplo: RES-x7b9p4q2
}

export async function POST(request) {
  try {
    // Obtener el amount del cuerpo de la solicitud
    const { amount } = await request.json();

    // Validar que amount sea un número válido
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Amount inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
      options: { timeout: 5000 },
    });

    const preferenceClient = new Preference(client);

    // Generar external_reference
    const externalReference = generateExternalReference();

    const preferenceData = {
      items: [
        {
          title: 'Producto de prueba',
          quantity: 1,
          unit_price: amount,
          currency_id: 'ARS',
        },
      ],
      payer: { email: 'test_user@example.com' },
      back_urls: {
        success: 'https://instituto-five-sigma.vercel.app/api/webhook',
        failure: 'https://instituto-five-sigma.vercel.app/api/webhook',
        pending: 'https://instituto-five-sigma.vercel.app/api/webhook',
      },
      auto_return: 'approved',
      external_reference: externalReference, // Usar el external_reference generado
      notification_url: 'https://instituto-five-sigma.vercel.app/api/webhook', // URL de tu webhook
    };

    const response = await preferenceClient.create({ body: preferenceData });
    return new Response(
      JSON.stringify({
        init_point: response.init_point,
        external_reference: externalReference, // Devolver al frontend
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    return new Response(JSON.stringify({ error: 'Error al crear la preferencia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}