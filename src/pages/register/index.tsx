import { useState, useContext } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../../public/images/logo.svg'
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { canSRRGuest } from "@/utils/canSSRGuest";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signUp } = useContext(AuthContext);

  async function handleRegister() {
    if(name === '' && email === '' && password === '') return;

    await signUp({ name, email, password });
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Cadastre-se</title>
      </Head>
      <Flex sx={{
        background: "barber.900",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center", 
        }} 
      >
        <Flex width={640} direction='column' p={14} rounded={8}>
            <Center p={4}>
                <Image 
                    src={logoImg}
                    quality={100}
                    objectFit="fill"
                    alt="logo barberPro"
                    width={240}
                />
            </Center>

            <Input 
              background="barber.400" 
              variant="filled" 
              size="lg" 
              placeholder="Nome da barbearia" 
              type="text"
              mb={3}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              sx={{
                background: "barber.400", 
                variant: "filled",
                size: "lg", 
                placeholder: "email@email.com", 
                type: "email",
                mb: 3
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input  sx={{
              background:"barber.400", 
              variant:"filled" ,
              size:"lg",
              placeholder:"*********", 
              type:"text",
              mb:6
            }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button sx={{
              background: "button.cta",
              mb: 6,
              color: "gray.900",
              size: "lg"

            }}
              _hover={{ background: "#ffb13e" }}
              onClick={handleRegister}
            >
              Cadastrar
            </Button>

            <Center mt={2}>
              <Link href="/login">
                <Text sx= {{
                  cursor: "pointer", 
                  color: "#fff"
                }}>
                  Já possui conta? <strong>Faça o login</strong></Text>
              </Link>
            </Center>

        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps = canSRRGuest(async (ctx) => {
  return {
    props: {}
  }
});