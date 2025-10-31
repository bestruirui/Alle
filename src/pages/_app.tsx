import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/provider/Theme'
import { DeviceProvider } from '@/provider/Device'
import { QueryProvider } from '@/provider/Query'
import { ThemeSynchronizer } from '@/components/ThemeSynchronizer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Head>
          <title>Alle</title>
        </Head>
        <DeviceProvider>
          <ThemeSynchronizer />
          <Component {...pageProps} />
        </DeviceProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
