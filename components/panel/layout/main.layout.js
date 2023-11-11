import Header from './header.layout'
import Box from '@mui/material/Box'

export default function PanelMainLayout({children}) {
  return (
    <>
      <Header />
      <Box component="main">{children}</Box>
    </>
  )
}
