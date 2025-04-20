'use client';
import LoginForm from "@/app/components/LoginForm";
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  if (session) {
    return <p>Access Denied</p>
  }
  return (
    <div>
      <LoginForm/>
    </div>
  );
}