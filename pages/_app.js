import MuiThemeProvider from 'utility/mui-theme-provider'
import {CacheProvider} from '@emotion/react'
import createCache from '@emotion/cache'
import {prefixer} from 'stylis'
import rtlPlugin from 'stylis-plugin-rtl'
import CssBaseline from '@mui/material/CssBaseline'
import MainLayout from 'components/layout/main.layout'

import 'styles/globals.scss'

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
})

export default function App({Component, pageProps}) {
  return (
    <MuiThemeProvider>
      <CacheProvider value={cacheRtl}>
        <MainLayout>
          <CssBaseline />
          <Component {...pageProps} />
        </MainLayout>
      </CacheProvider>
    </MuiThemeProvider>
  )
}
