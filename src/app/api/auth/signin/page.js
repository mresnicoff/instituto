// En src/app/auth/signin/page.js
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div>
      <h1>Inicia sesión</h1>
      <button onClick={() => signIn()}>Iniciar sesión con Google</button>
    </div>
  );
}