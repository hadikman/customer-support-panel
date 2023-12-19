import Link from 'next/link'
import Box from '@mui/material/Box'

export default function AdminHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: theme => theme.palette.info.dark,
        color: theme => theme.palette.info.contrastText,
        py: 0.25,
        px: 2,
        zIndex: theme => theme.zIndex.appBar,
      }}
    >
      <Box component={Link} href="/dash-cp">
        داشبورد
      </Box>
    </Box>
  )
}
