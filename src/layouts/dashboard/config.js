import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon'
import UsersIcon from '@heroicons/react/24/solid/UsersIcon'
import { SvgIcon } from '@mui/material'
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop'
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import React from 'react'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'
import BusinessIcon from '@mui/icons-material/Business'

export const items = [
  {
    title: 'Overview',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Old Home',
    path: '/oldejHome',
    icon: (
      <SvgIcon fontSize="small">
        <BusinessIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Medicine',
    path: '/medicine',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarViewMonthIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Elders',
    path: '/oldej',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
  },

  {
    title: 'Print',
    path: '/print',
    icon: (
      <SvgIcon fontSize="small">
        <LocalPrintshopIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'PECT',
    path: '/pect',
    icon: (
      <SvgIcon fontSize="small">
        <CurrencyRupeeIcon />
      </SvgIcon>
    ),
  },
  {
    title: 'Calendar',
    path: '/calendar',
    icon: (
      <SvgIcon fontSize="small">
        <CalendarMonthIcon />
      </SvgIcon>
    ),
  },
]

// if (window.location.host !== 'nimit.vercel.app') {
//   export items.filter((lens) = > lens.title !== 'PECT')
// } else {
//   export items
// }
