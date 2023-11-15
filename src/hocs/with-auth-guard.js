import { AuthGuard } from 'src/guards/auth-guard'
import React from 'react'

export const withAuthGuard = (Component) => (props) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
)
