import Box from '@mui/material/Box'

export default function PublicMainLayout({children}) {
  return (
    <Box component="main" sx={{p: 2}}>
      {children}
    </Box>
  )
}
