// src/app/auth/signin/page.js
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleCredentialsSignIn = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });
      if (result?.error) {
        setError("Credenciales inválidas");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
    }
  };

  return (
    <div>
      <h1>Inicia sesión</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleGoogleSignIn}>Iniciar sesión con Google</button>
      <form onSubmit={handleCredentialsSignIn}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jsmith@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
        </div>
        <button type="submit">Iniciar sesión con Credenciales</button>
      </form>
    </div>
  );
}