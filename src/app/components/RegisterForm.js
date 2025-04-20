'use client'
import React, { useState } from 'react';
import { useTheme } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Text, 
  useToast,
  useColorModeValue,
  Select, // Usamos Select en lugar de Switch e Input para rol
  Image 
} from '@chakra-ui/react';
import axios from 'axios';
import ImageUploading from 'react-images-uploading';

const RegisterForm = () => {
  const theme = useTheme();
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    avatar: '',
    password: '',
    repeatPassword: '',
    nombre: '',
    rol: '' // Cambiado de linkautor a rol
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const toast = useToast();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("grey.800", "gray.200");
  const btnColor = useColorModeValue("blue.500", "brand.900");
  const borderColor = useColorModeValue('brand.800', 'brand.800');

  const [images, setImages] = useState([]);

  const onChange = (imageList, addUpdatedIndex) => {
    setImages(imageList);
    if(imageList.length > 0) {
      setUser(prevState => ({ ...prevState, avatar: imageList[0].data_url }));
    } else {
      setUser(prevState => ({ ...prevState, avatar: '' }));
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    
    switch (name) {
      case 'email':
        if (value.trim() === '') newErrors.email = 'El correo electrónico no puede quedar vacío';
        else if (!/\S+@\S+\.\S+/.test(value)) newErrors.email = 'El correo electrónico no es válido';
        else delete newErrors.email;
        break;
      case 'avatar':
        if (!value || value.length === 0) {
          newErrors.avatar = 'El avatar no puede quedar vacío';
        } else delete newErrors.avatar;
        break;
      case 'password':
        if (value.trim() === '') newErrors.password = 'La contraseña no puede quedar vacía';
        else if (value.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        else delete newErrors.password;
        break;
      case 'repeatPassword':
        if (value.trim() === '') newErrors.repeatPassword = 'Repetir contraseña no puede quedar vacío';
        else if (value !== user.password) newErrors.repeatPassword = 'Las contraseñas no coinciden';
        else delete newErrors.repeatPassword;
        break;
      case 'nombre':
        if (value.trim() === '') newErrors.nombre = 'El nombre no puede quedar vacío';
        else delete newErrors.nombre;
        break;
      case 'rol':
        if (value.trim() === '') newErrors.rol = 'El rol no puede quedar vacío';
        else delete newErrors.rol;
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
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

    let formIsValid = true;
    Object.keys(user).forEach((field) => {
      validateField(field, user[field]);
      if (errors[field]) formIsValid = false;
    });

    if (!formIsValid) {
      toast({
        title: "Error",
        description: "Por favor, corrige los errores en el formulario.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    try {
      const formData = new FormData();
      if (images.length > 0) {
        formData.append('file', images[0].file);
        formData.append('upload_preset', uploadPreset);
             const cloudinaryResponse = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData);
        
        const avatarUrl = cloudinaryResponse.data.secure_url;
        console.log(avatarUrl)
        setUser(prevUser => ({ ...prevUser, avatar: avatarUrl }));

        const response = await axios.post('api/nuevousuario/', {
          email: user.email,
          avatar: avatarUrl,
          password: user.password,
          nombre: user.nombre,
          rol: user.rol
        });

        if (response.data.success) {
          toast({
            title: "Éxito",
            description: "Registro exitoso. Redirigiendo al login",
            status: "success",
            duration: 1000,
            isClosable: true,
          });
          router.push('/loguearse');
        } else {
          toast({
            title: "Error",
            description: response.data.message || "No se pudo registrar el usuario.",
            status: "error",
            duration: 1000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error('Error subiendo la imagen a Cloudinary:', error);
      toast({
        title: "Error",
        description: "Error al subir la imagen. Inténtalo de nuevo.",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showError = (field) => touched[field] && errors[field];

  return (
    <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg" maxW="md" mx="auto" my={10}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="nombre" isRequired isInvalid={!!showError('nombre')}>
            <FormLabel color={textColor}>Nombre</FormLabel>
            <Input 
              type="text" 
              name="nombre" 
              value={user.nombre} 
              onChange={handleChange} 
              onBlur={handleBlur}
              placeholder="Nombre completo" 
            />
            {showError('nombre') && <Text color="red.500" fontSize="sm">{errors.nombre}</Text>}
          </FormControl>
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
          <FormControl id="avatar" isRequired isInvalid={!!showError('avatar')}>
            <FormLabel color={textColor}>Imagen de Avatar</FormLabel>
            <ImageUploading
              value={images}
              onChange={onChange}
              maxNumber={1}
              dataURLKey="data_url"
            >
              {({
                imageList,
                onImageUpload,
                onImageRemoveAll,
                onImageUpdate,
                onImageRemove,
                isDragging,
                dragProps,
              }) => (
                <div className="upload__image-wrapper">
                  <Button 
                    bg={btnColor}
                    color="white"
                    borderColor={borderColor}
                    _hover={{
                      bg: useColorModeValue('blue.300', 'purple.300'),
                      borderColor: useColorModeValue('brand.700', 'brand.900'),
                    }}
                    onClick={onImageUpload}
                    {...dragProps}
                  >
                    {imageList.length === 0 ? 'Subir Imagen' : 'Cambiar Imagen'}
                  </Button>
                  {imageList.map((image, index) => (
                    <div key={index} className="image-item">
                      <Image src={image['data_url']} alt="" width="100" />
                      <Button onClick={() => onImageRemove(index)}>Eliminar</Button>
                    </div>
                  ))}
                </div>
              )}
            </ImageUploading>
            {showError('avatar') && <Text color="red.500" fontSize="sm">{errors.avatar}</Text>}
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
          <FormControl id="repeatPassword" isRequired isInvalid={!!showError('repeatPassword')}>
            <FormLabel color={textColor}>Repetir Contraseña</FormLabel>
            <Input 
              type="password" 
              name="repeatPassword" 
              value={user.repeatPassword} 
              onChange={handleChange} 
              onBlur={handleBlur}
              placeholder="Repetir contraseña"
            />
            {showError('repeatPassword') && <Text color="red.500" fontSize="sm">{errors.repeatPassword}</Text>}
          </FormControl>
          <FormControl id="rol" isRequired isInvalid={!!showError('rol')}>
            <FormLabel color={textColor}>Rol</FormLabel>
            <Select 
              name="rol" 
              value={user.rol} 
              onChange={handleChange} 
              onBlur={handleBlur}
            >
              <option value="">Selecciona un rol</option>
              <option value="Alumno">Alumno</option>
              <option value="Padre">Padre</option>
              <option value="Profesor">Profesor</option>
            </Select>
            {showError('rol') && <Text color="red.500" fontSize="sm">{errors.rol}</Text>}
          </FormControl>
          <Button 
            bg={btnColor}
            color="white"
            borderColor={borderColor}
            _hover={{
              bg: useColorModeValue('blue.300', 'purple.300'),
              borderColor: useColorModeValue('brand.700', 'purple.100'),
            }}
            type="submit" 
            isLoading={isLoading}
            loadingText="Registrando..."
          >
            Registrarse
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default RegisterForm;