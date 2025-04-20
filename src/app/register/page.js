'use client';
import RegisterForm from '@/app/components/RegisterForm'; // Asegúrate de ajustar la ruta de importación según tu estructura.
import { useSession } from 'next-auth/react';
export default function RegisterPage() {
  const { data: session, status } = useSession();

  return (
    <div>
     <RegisterForm/>
    </div>
  );
}