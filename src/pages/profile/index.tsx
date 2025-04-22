import { useContext, useState } from "react";
import Head from "next/head";
import { Flex, Text, Heading, Box, Input, Button } from "@chakra-ui/react";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { canSRRAuth } from "@/utils/canSSRAuth";
import { AuthContext } from "@/context/AuthContext";
import { setupApiClient } from "@/services/api";

interface UserProps {
    id: string;
    name: string;
    email: string;
    endereco: string | null;
}

interface ProfileProps {
    user: UserProps;
    premium: boolean;
}

export default function Profile({ user, premium }: ProfileProps) {
    const { logoutUser } = useContext(AuthContext);

    const [name, setName] = useState<string>(user?.name || '');
    const [endereco, setEndereco] = useState<string>(user?.endereco || '');
    
    async function handleLogout() {
        await logoutUser();
    }

    async function handleUpdateUser() {
        if(!name) return;

        try {
            const apiClient = setupApiClient();
            await apiClient.put('/users', {
                name: name,
                endereco: endereco
            });

            alert("Dados alterados com sucesso.");
        }
        catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <Head>
                <title>Minha conta - BarberPRO</title>
            </Head>
            <Sidebar>
                <Flex 
                    sx={{
                        direction:"column", 
                        alignItems:"flex-start", 
                        justifyContent:"flex-start"
                    }}
                >
                    <Flex 
                        w="100%" 
                        direction="row" 
                        alignItems="center" 
                        justify="flex-start"
                    >
                        <Heading
                            sx={{
                                fontSize: "3xl", 
                                mt: 4, 
                                mb: 4, 
                                mr: 4, 
                                color: "orange.900"
                            }} 
                        >
                            Minha conta
                        </Heading>
                    </Flex>
                    <Flex 
                        pt={8} 
                        pb={8} 
                        background="barber.400" 
                        maxW="700px" 
                        w="100%" 
                        direction="column" 
                        alignItems="center" 
                        justifyContent="center"
                    >
                        <Flex 
                            direction="column" 
                            w="85%"
                        >
                            <Text 
                                sx={{
                                    mb: 2, 
                                    fontSize: "2xl", 
                                    fontWeight: "bold", 
                                    color: "white"
                                }}
                            >
                                Nome da barbearia:
                            </Text>
                            <Input
                                placeholder="Nome da sua barbearia"
                                size="lg"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    w: "100%",
                                    background: "gray.900",
                                    mb: 3
                                }}
                                />

                            <Text 
                                mb={2} 
                                fontSize="2xl" 
                                fontWeight="bold" 
                                color="white"
                            >
                                Endereço da barbearia:
                            </Text>
                            <Input 
                                w="100%" 
                                background="gray.900" 
                                placeholder="Endereço da sua barbearia" 
                                size="lg" 
                                type="text" 
                                mb={3}
                                value={endereco}
                                onChange={(e) => setEndereco(e.target.value)}
                            />

                            <Text 
                                mb={2} 
                                fontSize="2xl" 
                                fontWeight="bold" 
                                color="white"
                            >
                                Plano atual:
                            </Text>

                            <Flex 
                                direction="row" 
                                w="100%" 
                                mb={3} 
                                p={1} 
                                borderWidth={1} 
                                rounded={6} 
                                background="barber.900" 
                                alignItems="center" 
                                justifyContent="space-between"
                            >
                                <Text 
                                    p={2} 
                                    fontSize="lg" 
                                    color={premium ? "#fba931" : "#4dffb4"}
                                >
                                    Plano {premium ? "Premium" : "Grátis"}</Text>
                                <Link href="/planos">
                                    <Box 
                                        cursor="pointer" 
                                        p={1} 
                                        pl={2} 
                                        pr={2} 
                                        background="#00cd52" 
                                        rounded={4} 
                                        color="white"
                                    >
                                        Mudar plano
                                    </Box>
                                </Link>
                            </Flex>
                            <Button 
                                sx={{
                                    w: "100%",
                                    mt: 3,
                                    mb: 4,
                                    background: "button.cta",
                                    size: "lg"
                                }}
                                _hover = {{ bg: '#ffb13e' }}
                                onClick={ handleUpdateUser }
                            >
                                Salvar
                            </Button>

                            <Button
                                sx={{
                                    w: "100%",
                                    mb: 6,
                                    bg: "transparent",
                                    borderWidth: 2,
                                    borderColor: "red.500",
                                    color: "red.500",
                                    size: "lg",
                                }}
                                _hover = {{ bg: 'transparent' }}
                                onClick = {handleLogout}
                            >
                                Sair da conta
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {
    try {
        const apiClient = setupApiClient(ctx);
        const response = await apiClient.get('/me');

        const user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            endereco: response.data?.endereco
        };

        return {
            props: {
                user: user,
                premium: response.data?.subscriptions?.status === 'active' ? true : false
            }
        }
    }
    catch(err) {
        console.log(err);
        return {
            redirect: {
             destination: '/dashboard',
             permanent: false   
            }
        }
    }
})