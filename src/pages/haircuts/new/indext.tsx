import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "@/components/sidebar";
import { Flex, Heading, useMediaQuery, Input, Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FiChevronLeft } from 'react-icons/fi'
import { canSRRAuth } from "@/utils/canSSRAuth";
import { setupApiClient } from "@/services/api";
import { useRouter  } from "next/router";

interface NewHaircutProps {
    subscription: boolean;
    count: number;
}

export default function NewHaircut({ subscription, count } : NewHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)");
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const router = useRouter();

    async function handleRegister() {
        if(!name || !price) return;

        try {
            const apiClient = setupApiClient();
            await apiClient.post('/haircut', {
                name,
                price: Number(price)
            });

            router.push('/haircuts');
        }
        catch(err) {
            console.log(err);
            alert("Erro ao cadastrar.");
        }
    } 

    return (
        <>
            <Head>
                <title>BarberPRO - Novo modelo de corte</title>
            </Head>
            <Sidebar>
                <Flex sx={{
                    direction: "column", 
                    alignItems: "flex-start", 
                    justifyContent: "flex-start"
                    }}
                > 
                    <Flex direction={isMobile ? "column" : "row"} w="100%" alignItems={isMobile ? "flex-start" : "center"} mb={isMobile ? 4 : 0}>
                        <Link href="/haircuts">
                            <Button p={4} display="flex" alignItems="center" justifyContent="center" mr={4}>
                                <FiChevronLeft size={24} color="#fff"/>
                                Voltar
                            </Button>
                        </Link>
                        <Heading 
                            sx={{
                                color: "orange.900", 
                                mt: 4, 
                                mb: 4, 
                                mr: 4, 
                            }} 
                            fontSize={isMobile ? "28px" : "3xl"}
                        >
                            Modelos de corte
                        </Heading>
                    </Flex>

                    <Flex maxW="700px" bg="barber.400" w="100%" alignItems="center" justify="center" pt={8} pb={8} direction="column">
                        <Heading fontSize={isMobile ? "22px" : "3xl"} mb={4}>Cadastrar modelo</Heading>

                        <Input placeholder="Nome do corte" size="lg" type="text" w="85%" bg="gray.900" mb={3} value={name} onChange={(e) => setName(e.target.value)} />
                        
                        <Input placeholder="Valor do corte" size="lg" type="text" w="85%" bg="gray.900" mb={4} value={price} onChange={(e) => setPrice(e.target.value)} />

                        <Button w="85%" size="lg" color="gray.900" mb={6} bg="button.cta" _hover={{ bg: "#ffb13e" }} disabled={!subscription && count >=3} onClick={handleRegister}>
                            Cadastrar
                        </Button>
                    
                        {!subscription && count >= 3 && (
                            <Flex direction="row" align="center" justifyContent="center">
                                <Text>Você atingiu seu limite de corte</Text>
                                
                                <Link href="/planos">
                                    <Text fontWeight="bold" color="#31fb6a" cursor="pointer" ml={1}>
                                        Seja premium
                                    </Text>
                                </Link>
                            </Flex>
                        )}
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {
    try {
        const apiClient = setupApiClient(ctx);
        const response = await apiClient.get('/haircut/check');
        const count = await apiClient.get('/haircut/count');

        return {
            props: {
                subscription: response.data?.subscriptions?.status === 'active' ? true : false,
                count: count.data
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