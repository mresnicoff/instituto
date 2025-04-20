import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function crearPreferenciaPago() {
  try {
    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-3763154181938673-022408-08bd9d9ffc93830392c6516c2a7ba827-2285416409', // Reemplaza con tu token
      options: { timeout: 5000 }
    });

    const preferenceClient = new Preference(client);

    const preferenceData = {
      items: [
        {
          title: 'Producto de prueba',
          quantity: 1,
          unit_price: 1500.00,
          currency_id: 'ARS'
        }
      ],
      payer: {
        email: 'test_user@example.com'
      },
      back_urls: {
        success: 'https://tudominio.com/success',
        failure: 'https://tudominio.com/failure',
        pending: 'https://tudominio.com/pending'
      },
      auto_return: 'approved',
      external_reference: 'REF_12345'
    };

    const response = await preferenceClient.create({ body: preferenceData });
    console.log('URL de pago generada:', response.init_point);

    return response.init_point;
  } catch (error) {
    console.error('Error al crear la preferencia:', error);
    throw error;
  }
}
