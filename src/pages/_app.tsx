import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/provider/Theme'
import { DeviceProvider } from '@/provider/Device'
import { QueryProvider } from '@/provider/Query'
import { I18nProvider } from '@/provider/I18n'
import { MemphisBackground } from '@/components/common/MemphisBackground'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DeviceProvider>
          <I18nProvider>
            <MemphisBackground />
            <Head>
              <title>Alle - Memphis Design</title>
              <meta name="description" content="Email verification codes with Memphis art style" />
            </Head>
            <Component {...pageProps} />
          </I18nProvider>
        </DeviceProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}
