'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, signIn } from "next-auth/react";
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  Link, 
  useToast,
  useColorModeValue
} from '@chakra-ui/react';
import axios from 'axios';
import GoogleLogin from './GoogleLogin';


const LoginForm = () => {
 const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
   const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("grey.800", "gray.200");
  const btnColor = useColorModeValue("blue.500", "brand.900");
  const borderColor = useColorModeValue('brand.800', 'brand.800');
  const linkColor = useColorModeValue("purple.500", "purple.300");


  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value.trim() === '') newErrors.email = 'El correo electrónico no puede quedar vacío';
        else delete newErrors.email;
        break;
      case 'password':
        if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
        else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({ ...prevState, [name]: value }));
    validateField(name, value);
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!user.email || errors.email || !user.password || errors.password) {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }
  
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
      });
  
      if (result.error) {
        toast({
          title: "Error",
          description: result.error || "Credenciales incorrectas.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Éxito",
          description: "Inicio de sesión exitoso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        const session = await getSession();
    
        if (session && session.user.rol === "Profesor") {
          router.push('/disponibilidades');
        } else {
          router.push('/students');}
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al intentar iniciar sesión.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <>
    <Box 
      bg={bgColor} 
      p={8} 
      borderRadius="lg" 
      boxShadow="lg" 
      maxW="md" 
      mx="auto" 
      my={10}
    ><form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch" >
        <FormControl id="email" isRequired isInvalid={!!showError('email')}>
          <FormLabel color={textColor}>Correo Electrónico</FormLabel>
          <Input 
            type="email" 
            name="email" 
            value={user.email} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Correo electrónico" 
          />
          {showError('email') && <Text color="red.500" fontSize="sm">{errors.email}</Text>}
        </FormControl>

        <FormControl id="password" isRequired isInvalid={!!showError('password')}>
          <FormLabel color={textColor}>Contraseña</FormLabel>
          <Input 
            type="password" 
            name="password" 
            value={user.password} 
            onChange={handleChange} 
            onBlur={handleBlur}
            placeholder="Contraseña"
          />
          {showError('password') && <Text color="red.500" fontSize="sm">{errors.password}</Text>}
        </FormControl>

        <Button 
          colorScheme="purple" 
          bg={btnColor} 
          type="submit" 
          isLoading={isLoading}
          loadingText="Iniciando sesión..."
        >
          Iniciar sesión
        </Button>

        <Text align="center" fontSize="sm" color={textColor}>
          <Link href="/forgot-password" color={linkColor}>
            ¿Olvidó su contraseña?
          </Link>
        </Text>
        <Text align="center" fontSize="sm" color={textColor}>
        <Link href="/registrarse" color={linkColor}>
  No tiene cuenta, regístrese
</Link>
        </Text>
      </VStack>
      </form>
    </Box>
    <GoogleLogin/>
    </>
  );
};

export default LoginForm;