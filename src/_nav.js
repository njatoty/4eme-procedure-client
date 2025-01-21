import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilNotes,
  cilSpeedometer,
} from '@coreui/icons'
import {  CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Accueil',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: '',
    },
  },
  {
    component: CNavTitle,
    name: 'Liste',
  },
  {
    component: CNavItem,
    name: 'Données',
    to: '/base/tables',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Fichier',
    to: '/base/template',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
]

export default _nav
