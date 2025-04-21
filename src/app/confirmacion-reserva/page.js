import { Suspense } from 'react';
import ConfirmationForm from '../components/ConfirmationForm';

export const dynamic = 'force-dynamic'; // Evita el prerenderizado

export default function ConfirmacionReservaPage() {
  return (
    <div>
      <h1>Confirmación de Reserva</h1>
      <Suspense fallback={<div>Cargando...</div>}>
        <ConfirmationForm />
      </Suspense>
    </div>
  );
}