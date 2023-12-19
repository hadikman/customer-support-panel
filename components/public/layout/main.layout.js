import Box from '@mui/material/Box'

export default function PublicMainLayout({isAdminHeader, children}) {
  return (
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
  )
}
