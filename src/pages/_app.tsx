import Head from 'next/head'

import { DeviceProvider } from '@/provider/Device'
import { I18nProvider } from '@/provider/I18n'
import { QueryProvider } from '@/provider/Query'
import { ThemeProvider } from '@/provider/Theme'

import type { AppProps } from 'next/app'

import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DeviceProvider>
          <I18nProvider>
            <Head>
              <title>Alle</title>
            </Head>
            <Component {...pageProps} />
          </I18nProvider>
        </DeviceProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
