import { request } from 'https';

const url = 'https://instituto-five-sigma.vercel.app/api/webhook';
const payload = {
  action: 'payment.updated',
  api_version: 'v1',
  data: { id: '108722292431' },
  date_created: '2021-11-01T02:02:02Z',
  id: '108722292431',
  live_mode: true,
  type: 'payment',
  user_id: 2285416409,
};

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = request(url, options, (res) => {
  console.log(`Código de estado: ${res.statusCode}`);
  console.log('Encabezados de la respuesta:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Cuerpo de la respuesta:', data || 'Vacío');
  });
});

req.on('error', (error) => {
  console.error('Error en la solicitud:', error.message);
});

req.write(JSON.stringify(payload));
req.end();

console.log('Enviando solicitud POST a:', url);