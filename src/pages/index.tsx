import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <>
      <Head>
        <title>BarberPRO - Seu sistema completo</title>
      </Head>
    </>
  );
}
