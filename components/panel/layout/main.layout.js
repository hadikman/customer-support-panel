import {useRouter} from 'next/router'
import Header from './header.layout'
import Box from '@mui/material/Box'

export default function PanelMainLayout({children}) {
  const {route} = useRouter()
  const isPrint = route.startsWith('/dash-cp/print')

  return (
    <>
      {!isPrint && <Header />}

      <Box component="main" sx={{...(!isPrint && {p: 2})}}>
        {children}
      </Box>
    </>
  )
}
