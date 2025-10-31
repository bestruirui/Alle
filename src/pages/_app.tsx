import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/provider/Theme'
import { DeviceProvider } from '@/provider/Device'
import { QueryProvider } from '@/provider/Query'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Alle</title>
      </Head>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DeviceProvider>
            <Component {...pageProps} />
          </DeviceProvider>
        </ThemeProvider>
      </QueryProvider>
    </>
  )
}
