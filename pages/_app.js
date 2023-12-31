import Head from 'next/head'
import MuiThemeProvider from 'utility/mui-theme-provider'
import {CacheProvider} from '@emotion/react'
import createCache from '@emotion/cache'
import {prefixer} from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import CssBaseline from '@mui/material/CssBaseline'
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'
import MainLayout from 'components/layout/main.layout'

import 'styles/globals.scss'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})
const queryClient = new QueryClient()

export default function App({Component, pageProps}) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <MuiThemeProvider>
        <CacheProvider value={cacheRtl}>
          <QueryClientProvider client={queryClient}>
            <MainLayout>
              <CssBaseline />
              <Component {...pageProps} />
            </MainLayout>
          </QueryClientProvider>
        </CacheProvider>
      </MuiThemeProvider>
    </>
  )
}
