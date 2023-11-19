import { AuthGuard } from 'src/guards/auth-guard'
import React from 'react'

export const withAuthGuard = (Component) => {
  const WithAuthGuard = (props) => (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  )

  // Set the display name for easier debugging
  WithAuthGuard.displayName = `withAuthGuard(${Component.displayName || Component.name || 'Component'})`

  return WithAuthGuard
}
