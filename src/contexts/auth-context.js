import { createContext, useContext, useEffect, useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import React from 'react'

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
}

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload

    return {
      ...state,
      ...// if payload (user) is provided, then is authenticated
      (user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    }
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload

    return {
      ...state,
      isAuthenticated: true,
      user,
    }
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    }
  },
}

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state)

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined })

export const AuthProvider = (props) => {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, initialState)
  const initialized = useRef(false)

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return
    }

    initialized.current = true

    let isAuthenticated = false

    try {
      // isAuthenticated = window.sessionStorage.getItem('authenticated') === 'true'
      isAuthenticated = localStorage.getItem("authenticated") === 'true'
    } catch (err) {
      console.error(err)
    }

    if (isAuthenticated) {
      const user = {
        id: '5e86809283e28b96d2d38537',
        avatar: '/assets/avatars/avatar-anika-visser.png',
        name: 'Anika Visser',
        email: 'anika.visser@devias.io',
      }

      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user,
      })
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE,
      })
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  const skip = () => {
    try {
      localStorage.setItem("authenticated", "true");
      // window.sessionStorage.setItem('authenticated', 'true')
    } catch (err) {
      console.error(err)
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io',
    }

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    })
  }

  const signIn = async (email, password) => {
    // if (email !== 'demo@devias.io' || password !== 'Password123!') {
    // eslint-disable-next-line no-undef
    console.log(process.env.LOGIN_USER)
    // eslint-disable-next-line no-undef
    if (window.location.hostname == 'nimit-demo.vercel.app') {
      if (email !== 'demo@gmail.com' || password !== 'Passwd123') {
        throw new Error('Please check your email and password')
      }
    } else {
      if (email !== 'nimit@007.com' || password !== 'Nimit@007') {
        throw new Error('Please check your email and password')
      }
    }

    try {
      localStorage.setItem("authenticated", "true");
      // window.sessionStorage.setItem('authenticated', 'true')
    } catch (err) {
      console.error(err)
    }

    const user = {
      id: '5e86809283e28b96d2d38537',
      avatar: '/assets/avatars/avatar-anika-visser.png',
      name: 'Anika Visser',
      email: 'anika.visser@devias.io',
    }

    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented')
  }

  const signOut = () => {
    localStorage.clear()
    dispatch({
      type: HANDLERS.SIGN_OUT,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node,
}

export const AuthConsumer = AuthContext.Consumer

export const useAuthContext = () => useContext(AuthContext)
