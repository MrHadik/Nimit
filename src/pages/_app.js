import PropTypes from 'prop-types'
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
import { SnackbarProvider } from 'notistack'

const clientSideEmotionCache = createEmotionCache()

const SplashScreen = () => null

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  useNProgress()

  const getLayout = Component.getLayout ?? ((page) => page)

  const theme = createTheme()

  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={1000}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Nimit</title>
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
    </SnackbarProvider>
  )
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object,
}

App.getLayout = PropTypes.func // This is for Component.getLayout

export default App
