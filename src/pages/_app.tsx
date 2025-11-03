import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/provider/Theme'
import { DeviceProvider } from '@/provider/Device'
import { QueryProvider } from '@/provider/Query'
import { I18nProvider } from '@/provider/I18n'

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
