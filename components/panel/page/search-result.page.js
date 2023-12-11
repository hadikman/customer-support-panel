import * as React from 'react'
import {useRouter} from 'next/router'
import {useQueryClient} from '@tanstack/react-query'
import useMutateData from 'hook/useMutateData'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ReqeustsTable from 'components/panel/UI/requests-table'
import {QUERY_ALL_FORMS_FIELD_API_URL} from 'library/api-url'

export default function SearchResultPage() {
  const {query, isReady, back} = useRouter()
  const {q} = query
  const queryClient = useQueryClient()
  const {mutate, data, isPending, isSuccess} = useMutateData({
    url: QUERY_ALL_FORMS_FIELD_API_URL,
    mutationKey: ['search'],
    onSuccess: data => {
      queryClient.setQueryData(['search-result'], data)
    },
  })

  React.useEffect(() => {
    if (isReady) {
      mutate({query: q})
    }
  }, [isReady, mutate, q])

  function handleOnBack() {
    back()
  }

  return (
    <Box>
      <Grid
        container
        sx={{justifyContent: 'space-between', alignItems: 'flex-end', mb: 2}}
      >
        <Typography>
          عبارت جستجو:
          <Box component="span" sx={{ml: 1}}>
            {isPending
              ? ''
              : isSuccess && data.length !== 0
              ? q
              : 'نتیجه‌ای یافت نشد'}
          </Box>
        </Typography>

        <Button variant="contained" color="warning" onClick={handleOnBack}>
          صفحه قبل
        </Button>
      </Grid>

      <ReqeustsTable data={data} isLoading={isPending} isSuccess={isSuccess} />
    </Box>
  )
}
