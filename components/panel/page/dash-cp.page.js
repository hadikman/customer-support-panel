import * as React from 'react'
import useQueryData from 'hook/useQueryData'
import Box from '@mui/material/Box'
import ReqeustsTable from '../UI/requests-table'
import {GET_ALL_FORMS_API_URL} from 'library/api-url'

export default function DashCPPage() {
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['all-forms'],
    url: GET_ALL_FORMS_API_URL,
    refetchInterval: 300000,
  })

  return (
    <Box>
      <ReqeustsTable data={data} isLoading={isLoading} isSuccess={isSuccess} />
    </Box>
  )
}
