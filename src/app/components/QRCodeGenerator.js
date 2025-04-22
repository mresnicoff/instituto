'use client';

import { QRCode } from 'react-qr-code'; // Cambia a importación nombrada

const QRCodeGenerator = ({ url }) => {
  if (!url) {
    return <div>No se proporcionó una URL para el QR</div>;
  }

  return (
    <div style={{ textAlign: 'center', margin: '20px' }}>
      <h3>Escanea el QR para pagar</h3>
      <QRCode
        value={url}
        size={256}
        level="H"
      />
      <p>
        O haz <a href={url}>clic aquí</a> para pagar
      </p>
    </div>
  );
};

export default QRCodeGenerator;