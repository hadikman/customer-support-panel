import * as React from 'react'
import {useRouter} from 'next/router'
import AdminHeader from 'components/public/layout/admin.header'
import PanelMainLayout from 'components/panel/layout/main.layout'
import PublicMainLayout from 'components/public/layout/main.layout'
import PanelAuthentication from 'components/panel/auth/auth'
import Box from '@mui/material/Box'
import VAZIRMATN_FONT from 'utility/share-font'

export default function MainLayout({children}) {
  const {route} = useRouter()
  const [mountAppToAccessWindow, setMountAppToAccessWindow] =
    React.useState(false)

  const isPanel = route.startsWith('/dash-cp')
  const isAuth =
    mountAppToAccessWindow &&
    localStorage.getItem('customer-support-panel-token')
  const isAdminHeader = !isPanel && isAuth
  const isPublic = route.startsWith('/customer')
  const isPrint = route.startsWith('/dash-cp/print')

  React.useEffect(() => {
    setMountAppToAccessWindow(true)
  }, [])

  if (!mountAppToAccessWindow) {
    return null
  }

  return (
    <Box
      component="section"
      className={VAZIRMATN_FONT.className}
      sx={{
        width: isPrint ? 'var(--print-width)' : 'var(--mobile-width)',
        maxWidth: 'var(--max-width)',
        minHeight: '100svh',
        ...(isAdminHeader && {
          display: 'grid',
          gridTemplateRows: 'max-content 1fr',
          alignItems: 'center',
        }),
        bgcolor: theme => theme.palette.background.default,
        mx: 'auto',
      }}
    >
      {isAdminHeader && <AdminHeader />}

      {isPanel ? (
        <PanelAuthentication>
          <PanelMainLayout>{children}</PanelMainLayout>
        </PanelAuthentication>
      ) : isPublic ? (
        <PublicMainLayout isAdminHeader={isAdminHeader}>
          {children}
        </PublicMainLayout>
      ) : (
        <Box
          component="main"
          sx={{
            ...(!isAdminHeader && {
              minHeight: '100svh',
              display: 'grid',
              alignContent: 'center',
            }),
            p: 2,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  )
}
