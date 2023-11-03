import * as React from 'react'
import {useRouter} from 'next/router'
import PanelMainLayout from 'components/panel/layout/main.layout'
import PublicMainLayout from 'components/public/layout/main.layout'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import VAZIRMATN_FONT from 'utility/share-font'

export default function MainLayout({children}) {
  const {route} = useRouter()
  const [mountAppToLoadLocalFont, setMountAppToLoadLocalFont] =
    React.useState(false)

  const isPanel = route.startsWith('/dash-cp')
  const isPublic = route.startsWith('/customer')

  React.useEffect(() => {
    setMountAppToLoadLocalFont(true)
  }, [])

  if (!mountAppToLoadLocalFont) {
    return null
  }

  return (
    <Grid
      component="section"
      className={VAZIRMATN_FONT.className}
      sx={{
        width: 'var(--mobile-width)',
        maxWidth: 'var(--max-width)',
        mx: 'auto',
      }}
    >
      {isPanel ? (
        <PanelMainLayout>{children}</PanelMainLayout>
      ) : isPublic ? (
        <PublicMainLayout>{children}</PublicMainLayout>
      ) : (
        <Box sx={{px: 2}}>{children}</Box>
      )}
    </Grid>
  )
}
