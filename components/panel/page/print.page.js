import * as React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {useQueryClient} from '@tanstack/react-query'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import generatePersianTime from 'utility/generate-persian-time'

export default function Print() {
  const {back} = useRouter()
  const queryClient = useQueryClient()
  const queryState = queryClient.getQueryState(['print-surveys'])

  let data = []
  let isDataReady = false
  let isPrintQuery = queryState !== undefined

  if (isPrintQuery) {
    data = queryClient.getQueryData(['print-surveys'])
    isDataReady = true
  }

  return (
    <Box
      sx={{
        minHeight: '100svh',
        ...(!isDataReady && {
          display: 'grid',
          placeContent: 'center',
          textAlign: 'center',
        }),
        bgcolor: theme => theme.palette.background.paper,
        ...(isDataReady ? {p: 2} : {px: 2}),
        position: 'relative',
      }}
    >
      {isDataReady && (
        <Grid
          container
          sx={{
            position: 'sticky',
            top: 0,
            left: 0,
            justifyContent: 'center',
            gap: 1,
            bgcolor: theme => theme.palette.grey[100],
            boxShadow: theme => theme.shadows[3],
            p: 1,
            mb: 2,
            '@media print': {
              display: 'none',
            },
          }}
        >
          <Button
            variant="contained"
            size="small"
            onClick={() => window.print()}
          >
            چاپ
          </Button>
          <Button
            variant="contained"
            size="small"
            color="warning"
            onClick={back}
          >
            برگشت
          </Button>
        </Grid>
      )}

      <Box>
        {isDataReady ? (
          <Stack sx={{gap: 4}}>
            {data.map(
              ({_id, name, mobileNumber, surveyResult, registerDate}) => (
                <Box
                  key={_id}
                  sx={{p: 1, boxShadow: theme => theme.shadows[2]}}
                >
                  <Stack
                    sx={{
                      gap: 1,
                      mb: 2,
                      '& > div > *': {
                        display: 'inline-block',
                      },
                      '& > div > :first-of-type': {
                        width: 120,
                      },
                    }}
                  >
                    <Box>
                      <Typography>نام:</Typography>
                      <Typography>{name}</Typography>
                    </Box>
                    <Box>
                      <Typography>شماره موبایل:</Typography>
                      <Typography>{`0${mobileNumber}`}</Typography>
                    </Box>
                    <Box>
                      <Typography>تاریخ نظرسنجی:</Typography>
                      <Typography>
                        {generatePersianTime(registerDate)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box
                    sx={{
                      px: 2,
                      '& > *:nth-of-type(odd)': {
                        bgcolor: theme => theme.palette.grey[100],
                      },
                      '& > *:nth-of-type(even)': {
                        bgcolor: theme => theme.palette.grey[300],
                      },
                      WebkitPrintColorAdjust: 'exact !important',
                      printColorAdjust: 'exact !important',
                    }}
                  >
                    {surveyResult.map(({question, answer}) => (
                      <Grid container key={question} sx={{gap: 2, p: 1}}>
                        <Box>{question}</Box>
                        <Box sx={{fontWeight: 700}}>{answer.value}</Box>
                      </Grid>
                    ))}
                  </Box>
                </Box>
              ),
            )}
          </Stack>
        ) : (
          <Box>
            <Typography variant="h5" sx={{mb: 2}}>
              لیستی برای چاپ انتخاب نشده است.
            </Typography>
            <Typography>
              لطفاً از{' '}
              <Box
                component={Link}
                href="/dash-cp/survey"
                sx={{
                  fontWeight: 700,
                  color: 'blue',
                  borderBottom: '1px solid blue',
                }}
              >
                مشاهده نظرسنجی
              </Box>{' '}
              تاریخ مورد نظر را انتخاب نمایید و سپس دکمه &quot;چاپ&quot; را کلیک
              نمایید تا لیست موردنظر برای چاپ آماده شود.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}
