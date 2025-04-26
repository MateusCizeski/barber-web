import { useState } from "react";
import Head from "next/head";
import { Flex, Text, Heading, Button, Link as ChakraLink, useMediaQuery } from "@chakra-ui/react";
import { canSRRAuth } from "@/utils/canSSRAuth";
import { Sidebar } from "@/components/sidebar";
import Link from 'next/link';
import { IoMdPerson } from 'react-icons/io';
import { setupApiClient } from "@/services/api";

export interface ScheduleProps {
    id: string;
    customer: string;
    haircut: {
        id: string;
        name: string;
        price: string | number;
        user_id: string;
    }
}

interface DashboardProps {
    schedule: ScheduleProps[];
}

export default function Dashboard({ schedule }: DashboardProps) {
    const [isMobile] = useMediaQuery(['(max-width: 500px)']);
    const [list, setList] = useState(schedule);

    return (
        <>
            <Head>
                <title>BarberPRO - Minha barbearia</title>
            </Head>

            <Sidebar>
                <Flex direction={'column'} align={'flex-start'} justify={'flex-start'}>
                    <Flex w={'100%'} direction={'row'} align={'center'} justify={'flex-start'}>

                        <Heading fontSize={'3xl'} mt={4} mb={4} mr={4}>
                            Agenda
                        </Heading>

                        <Link href='/new'>
                            <Button> Registrar </Button>
                        </Link>
                    </Flex>

                    {list.map(item => (
                    <ChakraLink key={item?.id} w={'100%'} m={0} p={0} mt={1} bg={'transparent'} style={{ textDecoration: 'none' }}>
                        <Flex 
                            w={'100%'} 
                            direction={isMobile ? 'column' : 'row'} 
                            p={4} 
                            rounded={4} 
                            mb={4} 
                            bg={'barber.400'} 
                            justifyContent={'space-between'} 
                            align={isMobile ? 'flex-start' : 'center'}
                        >
                            <Flex direction={'row'} mb={isMobile ? 2 : 0} align={'center'} justify={'center'}>
                                <IoMdPerson size={28} color="#f1f1f1"/>
                                <Text fontWeight={'bold'} ml={4}>{item?.customer}</Text>
                            </Flex>

                            <Text fontWeight={'bold'} mb={isMobile ? 2 : 0}>{item?.haircut?.name}</Text>
                            <Text fontWeight={'bold'} mb={isMobile ? 2 : 0}>{item?.haircut?.price}</Text>

                        </Flex>
                    </ChakraLink>
                    ))}
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {
    try{
        const apiClient = setupApiClient(ctx);
        const response = await apiClient.get('/schedule');

        return {
            props: {
                schedule: response.data
            }
        }
    }
    catch(err) {
        console.log(err);

        return {
            props: {
                schedule: []
            }
        }
    }
});