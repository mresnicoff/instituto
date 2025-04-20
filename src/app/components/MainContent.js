'use client';
import { Box, Heading, Text, Image, SimpleGrid, List, ListItem, useColorMode } from '@chakra-ui/react';

export default function MainContent() {
  const { colorMode } = useColorMode();

  // Definir colores basados en el modo de color
  const bgColor = colorMode === 'light' ? 'gray.50' : 'gray.800';
  const textColor = colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900';
  const borderColor = colorMode === 'light' ? 'gray.200' : 'whiteAlpha.300';

  return (
    <Box as="main" p={8} bg={bgColor} color={textColor}>
      {/* Sección de Bienvenida */}
      <Box textAlign="center" mb={8}>
        <Heading as="h2" size="xl" mb={4}>
          Bienvenido al Instituto de Apoyo Escolar
        </Heading>
        <Text fontSize="lg">
          Ofrecemos clases presenciales, virtuales, individuales y grupales para ayudarte a alcanzar tus metas educativas.
        </Text>
      </Box>

      {/* Sección de Tipos de Clases */}
      <SimpleGrid columns={[1, null, 2]} spacing={8} mb={8}>
        {[
          { src: "/images/classroom.jpg", alt: "Clase presencial", text: "Clases Presenciales" },
          { src: "/images/online.jpg", alt: "Clase virtual", text: "Clases Virtuales" },
          { src: "/images/one-on-one.jpg", alt: "Clase individual", text: "Clases Individuales" },
          { src: "/images/group.jpg", alt: "Clase grupal", text: "Clases Grupales" }
        ].map((item, index) => (
          <Box key={index} textAlign="center" borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden">
            <Image src={item.src} alt={item.alt} />
            <Text mt={2}>{item.text}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Sección de Cursos de Ingreso */}
      <Box>
        <Heading as="h3" size="lg" mb={4}>
          Cursos de Ingreso
        </Heading>
        <List spacing={3}>
          <ListItem>ORT</ListItem>
          <ListItem>Colegio Nacional de Buenos Aires</ListItem>
          <ListItem>Carlos Pellegrini</ListItem>
          {/* Agregar más según sea necesario */}
        </List>
      </Box>
    </Box>
  );
}