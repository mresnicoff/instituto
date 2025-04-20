import ngrok from 'ngrok';

(async function() {
  await ngrok.authtoken('2tUP5QXieCqsaUvAKefhEfgXPDL_4TLq3wvaZ6DWvpExv6afv'); // Reemplaza 'TU_AUTHTOKEN' con tu token de autenticación
  const url = await ngrok.connect(3000); // Cambia 3000 por el puerto en el que tu aplicación está corriendo
  console.log(`ngrok URL: ${url}`);
})();
