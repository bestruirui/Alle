import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DeviceProvider } from '@/contexts/DeviceContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        retry: 1,
        staleTime: 5000,
      },
    },
  }))

  return (
    <>
      <Head>
        <title>Alle</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <DeviceProvider>
            <Component {...pageProps} />
          </DeviceProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}
