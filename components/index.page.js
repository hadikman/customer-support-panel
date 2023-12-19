import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'

export default function IndexPage() {
  return (
    <Grid container sx={{height: '95vh', alignContent: 'center'}}>
      <Stack
        sx={{
          gap: 6,
          textAlign: 'center',
          bgcolor: theme => theme.palette.grey[100],
          border: '2px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          py: 6,
          px: 2,
        }}
      >
        <Typography variant="h5" sx={{fontWeight: 'bold', mb: 3}}>
          پنل خدمات پشتیبانی
        </Typography>
        <Box>
          <Typography sx={{mb: 2}}>
            جهت دریافت خدمات پشتیبانی کولرگازی، درخواست خود را ثبت نمایید.
          </Typography>

          <Button variant="contained">
            <Link href="/customer/register">ثبت درخواست</Link>
          </Button>
        </Box>

        <Divider />

        <Box>
          <Typography sx={{mb: 2}}>
            جهت بهبود کیفیت خدمات ارائه شده، می توانید در نظرسنجی شرکت نمایید.
          </Typography>

          <Button variant="contained">
            <Link href="/customer/survey">ثبت نظرسنجی</Link>
          </Button>
        </Box>
      </Stack>
    </Grid>
  )
}
