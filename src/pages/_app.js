import Head from 'next/head'
import React from 'react'
import { CacheProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context'
import { useNProgress } from 'src/hooks/use-nprogress'
import { createTheme } from 'src/theme'
import { createEmotionCache } from 'src/utils/create-emotion-cache'
import 'simplebar-react/dist/simplebar.min.css'
import { LicenseInfo } from '@mui/x-license-pro'

LicenseInfo.setLicenseKey(
  '90a02713efeb5fb14bf15061394c966eTz00Mzg4MixFPTE2ODQzNjI5MzIwNTksUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI',
)

const clientSideEmotionCache = createEmotionCache()

const SplashScreen = () => null

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  useNProgress()

  const getLayout = Component.getLayout ?? ((page) => page)

  const theme = createTheme()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Devias Kit</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthConsumer>
              {(auth) => (auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />))}
            </AuthConsumer>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  )
}

export default App
