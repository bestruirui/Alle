import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect } from 'react'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DeviceProvider } from '@/contexts/DeviceContext'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator && typeof window !== 'undefined') {
      navigator.serviceWorker
        .register('/sw-offline.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Alle</title>
      </Head>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DeviceProvider>
          <Component {...pageProps} />
        </DeviceProvider>
      </ThemeProvider>
    </>
  )
}
