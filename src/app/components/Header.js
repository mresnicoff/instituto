'use client';
import { useColorMode, Button, Box, Flex, Heading, Link, Image, Text } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession(); // Solo necesitamos la sesión aquí
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' }); // Redirige al usuario a la página principal después de logout
  };
  useEffect(() => {
    if (session && session.user) {
    } else {
      console.log('No user authenticated or session not available');
    }
  }, [session]); // Solo escuchamos cambios en session

  return (
    <Box as="header" bg={colorMode === 'light' ? 'blue.500' : 'blue.800'} color="white" p={4}>
      <Flex justifyContent="space-between" alignItems="center">
        {/* Logo del Instituto */}
        <Link href="/">
          <Image src="/images/logo.jpg" alt="Instituto de Apoyo Escolar Logo" boxSize="50px" mr={3} />
        </Link>
        <Heading as="h1" size="lg" fontWeight="bold">
          Instituto de Apoyo Escolar
        </Heading>
        <nav>
          <Flex as="ul" listStyleType="none" gap={4}>
            {session && session.user ? (
              <>
                <li>
                  <Link href="#" onClick={handleLogout} color="white">Salir</Link>
                </li>
                <li>
                  <Text fontWeight="bold" fontSize="lg">{`Hola ${session.user.nombre}`}</Text>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/register" color="white">Registrarse</Link>
                </li>
                <li>
                  <Link href="/loguearse" color="white">Ingresar</Link>
                </li>
              </>
            )}
            <li>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </li>
          </Flex>
        </nav>
      </Flex>
    </Box>
  );
}

