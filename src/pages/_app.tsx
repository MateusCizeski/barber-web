import type { AppProps } from "next/app";
import { ChakraProvider, defineConfig, createSystem } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      
    }
  }
});

const system = createSystem(config)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <Component {...pageProps} />;
    </ChakraProvider>
  ) 
}
