import fetch from 'node-fetch';

// Reemplaza con tu token de acceso de Mercado Pago
const ACCESS_TOKEN = 'APP_USR-3763154181938673-022408-08bd9d9ffc93830392c6516c2a7ba827-2285416409';

async function obtenerPagos() {
  try {
    const response = await fetch('https://api.mercadopago.com/v1/payments/108722292431', {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Pagos obtenidos:', data);
  } catch (error) {
    console.error('Error al obtener los pagos:', error.message);
  }
}

obtenerPagos();