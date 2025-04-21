import { Suspense } from 'react';
import RegisterForm from '@/app/components/RegisterForm'; // Adjust path if needed
import { SessionProvider } from 'next-auth/react';

export const dynamic = 'force-dynamic'; // Ensure dynamic rendering

export default function RegisterPage() {
  return (
    <SessionProvider>
      <div>
        <h1>Register</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </SessionProvider>
  );
}