import { useContext, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import logoImg from '../../../public/images/logo.svg'
import { Button, Center, Flex, Input, Text } from "@chakra-ui/react";
import Link from "next/link";
import { AuthContext } from "@/context/AuthContext";
import { canSRRGuest } from "@/utils/canSSRGuest";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useContext(AuthContext);

  async function handleLogin() {

    if(email == '' || password == '') {
      return;
    }

   await signIn({ email, password });
  }

  return (
    <>
      <Head>
        <title>BarberPRO - Faça login para acessar</title>
      </Head>
      <Flex sx={{
          background: "barber.900", 
          height: "100vh" ,
          alignItems:"center", 
          justifyContent:"center"
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
              sx={{
                background: "barber.400", 
                variant: "filled" ,
                size:"lg",
                placeholder:"email@email.com", 
                type:"email",
                mb: 3
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              background="barber.400" 
              variant="filled" 
              size="lg" 
              placeholder="*********" 
              type="text"
              mb={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              sx={{
                background: "button.cta",
                mb: 6,
                color:"gray.900",
                size:"lg"
              }}
              _hover={{ background: "#ffb13e" }}
              onClick={handleLogin}
            >
              Acessar
            </Button>

            <Center mt={2}>
              <Link href="/register">
                <Text sx={{
                  cursor: "pointer", 
                  color: "#fff"
                }} 
                >Ainda não possui conta? <strong>Cadastra-se</strong>
              </Text>
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