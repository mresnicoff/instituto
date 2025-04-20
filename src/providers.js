'use client';
import { ThemeProvider } from 'next-themes';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme'; // Asegúrate de que la ruta es correcta
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ChakraProvider theme={theme}>
        <SessionProvider>
          {children}
        </SessionProvider>
      </ChakraProvider>
    </ThemeProvider>
  );
}


