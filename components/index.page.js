import Head from 'next/head'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>پنل خدمات پشتیبانی</title>
        <meta name="description" content="پنل خدمات پشتیبانی" />
      </Head>

      <Box
        sx={{
          width: 'var(--mobile-width)',
          maxWidth: 'var(--max-width)',
          height: '100vh',
          display: 'grid',
          placeContent: 'center',
          mx: 'auto',
        }}
      >
        <Box
          sx={{
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'primary.main',
            borderRadius: 2,
            py: 10,
            px: 2,
          }}
        >
          <Box sx={{mb: 6}}>
            <Typography variant="h5" sx={{fontWeight: 'bold', mb: 3}}>
              پنل خدمات پشتیبانی
            </Typography>
            <Typography>
              جهت دریافت خدمات پشتیبانی کولرگازی، درخواست خود را ثبت نمایید.
            </Typography>
          </Box>

          <Button variant="contained">
            <Link href="/customer/register">ثبت درخواست</Link>
          </Button>
        </Box>
      </Box>
    </>
  )
}
