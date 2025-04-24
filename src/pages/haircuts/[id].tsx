import Head from "next/head";
import  {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch
} from '@chakra-ui/react';
import { Sidebar } from "@/components/sidebar";
import { FiChevronLeft } from 'react-icons/fi'
import Link from "next/link";
import { canSRRAuth } from "@/utils/canSSRAuth";
import { setupApiClient } from "@/services/api";

interface HaircutProps {
    id: string;
    name: string;
    price: string | number;
    status: boolean;
    user_id: string;
}

interface SubscriptionsProps {
    id: string;
    status: string;
}

interface EditHaircutProps {
    haircut: HaircutProps;
    subscription: SubscriptionsProps;
}

export default function EditHaircut({ haircut, subscription }: EditHaircutProps) {
    const [isMobile] = useMediaQuery("(max-width: 500px)");
    return (
        <>
            <Head>
                <title>Editando modelo de corte - BarberPRO</title>
            </Head>
            <Sidebar>
                <Flex sx={{
                    direction: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start'
                }}>
                    <Flex 
                        direction = {isMobile ? "column" : "row"}
                        w='100%'
                        alignItems={isMobile ? "flex-start" : "center"}
                        justifyContent="flex-start"
                        mb={isMobile ? 4 : 0}
                    >

                        <Link href="/haircuts">
                            <Button 
                                sx={{
                                    mr: 3, 
                                    p: 4, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                }} 
                            >
                                <FiChevronLeft size={24} color="#fff"/>
                                Voltar
                            </Button>
                        </Link>

                        <Heading fontSize={isMobile ? '22px' : '3xl'} sx={{ color: "white" }} >Editar corte</Heading>
                    </Flex>

                    <Flex mt={4} maxW={'700px'} pt={8} pb={8} w={'100%'} bg={'barber.400'} direction={'column'} align={'center'} justify={'center'}>
                        <Heading fontSize={isMobile ? '22px' : '3xl'} color={"white"}>Editar corte</Heading>

                        <Flex w={'85%'} direction={"column"}>
                            <Input 
                                sx={{
                                    placeholder: "Nome do corte",
                                    bg: "gray.900",
                                    mb: 3,
                                    size: 'lg',
                                    type: "text",
                                    w: '100%'
                                }}
                            />

                            <Input 
                                sx={{
                                    placeholder: "Valor do corte",
                                    bg: "gray.900",
                                    mb: 3,
                                    size: 'lg',
                                    type: "number",
                                    w: '100%'
                                }}
                            />

                            <Stack 
                                sx={{
                                    mb: 6, 
                                    align: 'center', 
                                    direction: 'row'
                                }} 
                            >
                                <Text sx={{ fontWeight: 'bold' }} >Desativar corte</Text>

                                <Switch sx={{ size: 'lg', colorScheme: "red" }} />
                            </Stack>

                            <Button mb={6} w={'100%'} bg={'button.cta'} color={'gray.900'} _hover={{ bg: "#ffb13e" }} disabled={subscription?.status !== 'active'}>
                                Salvar
                            </Button>

                            { subscription?.status !== 'active' && (
                                <Flex direction={'row'} align={'center'} justify={'center'}>
                                    <Link href='/planos'>
                                        <Text fontWeight={'bold'} mr={1} color={'#31fb6a'} cursor={'pointer'}>Seja premium</Text>
                                    </Link>
                                    <Text>
                                        e tenha todos acessos liberados
                                    </Text>
                                </Flex>
                            )}
                        </Flex>
                    </Flex>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {
    const { id } = ctx.params;

    try {
        const apiClient = setupApiClient(ctx);
        const check = await apiClient.get('/haircut/check');
        const response = await apiClient.get('/haircut/detail', {
            params: {
                haircut_id: id
            }
        });

        return {
            props: {
                haircut: response.data,
                subscription: check.data?.subscriptions
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