import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { styled } from '@mui/material/styles'
import { withAuthGuard } from 'src/hocs/with-auth-guard'
import { SideNav } from './side-nav'
import { TopNav } from './top-nav'
import React from 'react'
import { alpha } from '@mui/material/styles';
import { useRouter } from 'next/navigation';

const SIDE_NAV_WIDTH = 280

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}))

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
  flexDirection: 'column',
  width: '100%',
})

export const Layout = withAuthGuard((props) => {
  const { children } = props
  const pathname = usePathname()
  const [openNav, setOpenNav] = useState(false)
  const router = useRouter();

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false)
    }
  }, [openNav])

  useEffect(() => {
    handlePathnameChange()
    if (localStorage.getItem("authenticated") !== "true") {
      router.push('/auth/login');
    }
  }, [pathname])

  return (
    <>
      <TopNav onNavOpen={() => setOpenNav(true)} />
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  )
})
