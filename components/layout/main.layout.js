import * as React from 'react'
import Grid from '@mui/material/Grid'
import VAZIRMATN_FONT from 'utility/share-font'

export default function MainLayout({children}) {
  const [mountAppToLoadLocalFont, setMountAppToLoadLocalFont] =
    React.useState(false)

  React.useEffect(() => {
    setMountAppToLoadLocalFont(true)
  }, [])

  if (!mountAppToLoadLocalFont) {
    return null
  }

  return (
    <Grid component="main" className={VAZIRMATN_FONT.className}>
      {children}
    </Grid>
  )
}
