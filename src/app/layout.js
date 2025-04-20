'use client';
import { ColorModeScript } from '@chakra-ui/react';
import './globals.css';
import Header from '@/app/components/Header.js';
import Footer from '@/app/components/Footer.js';
import { Providers } from '../providers'; // Asegúrate de que la ruta es correcta
import theme from '../theme'; // Asegúrate de que la ruta es correcta

export default function RootLayout({ children }) {
  return (
    <html lang="es"  suppressHydrationWarning>
      <head>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </head>
      <body>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
