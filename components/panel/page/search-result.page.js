import * as React from 'react'
import {useRouter} from 'next/router'
import useMutateData from 'hook/useMutateData'
import Box from '@mui/material/Box'
import ReqeustsTable from '../UI/requests-table'
import {QUERY_ALL_FORMS_FIELD_API_URL} from 'library/api-url'
import {Typography} from '@mui/material'

export default function SearchResultPage() {
  const {query, isReady} = useRouter()
  const {q} = query
  const {mutate, data, isPending, isSuccess} = useMutateData({
    url: QUERY_ALL_FORMS_FIELD_API_URL,
  })

  React.useEffect(() => {
    if (isReady) {
      mutate({query: q})
    }
  }, [isReady, mutate, q])

  return (
    <Box>
      <Typography sx={{mb: 2}}>
        عبارت جستجو:
        <Box component="span" sx={{ml: 1}}>
          {isPending
            ? ''
            : isSuccess && data.length !== 0
            ? q
            : 'نتیجه‌ای یافت نشد'}
        </Box>
      </Typography>
      <ReqeustsTable data={data} isLoading={isPending} isSuccess={isSuccess} />
    </Box>
  )
}
