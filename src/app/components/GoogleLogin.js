'use client';
import React from 'react';
import { signIn } from "next-auth/react";
import { 
  Button, 
  VStack, 
  Text,
  useToast,
  useColorModeValue
} from '@chakra-ui/react';

export default function GoogleLogin ()  {
  const toast = useToast();
  const borderColor = useColorModeValue('brand.800', 'brand.800');
  const textColor = useColorModeValue("grey.800", "gray.200");

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/roleform' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al intentar iniciar sesión con Google.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack mt={4} spacing={2}>
      <Text align="center" fontSize="sm" color={textColor}>
        O ingresar con el usuario de Google
      </Text>
      <Button 
        variant="outline"
        colorScheme="purple"
        borderColor={borderColor}
        onClick={handleGoogleLogin}
      >
        Iniciar sesión con Google
      </Button>
    </VStack>
  );
};

