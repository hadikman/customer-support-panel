import * as React from 'react'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import Link from 'next/link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableFooter from '@mui/material/TableFooter'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Icon from 'components/UI/icon'
import StyledHeadCell from 'components/panel/UI/styled-head-cell'
import StyledCell from 'components/panel/UI/styled-cell'
import Notification from 'components/UI/notification'
import icons from 'library/icons-name'
import {
  GET_ALL_FORMS_API_URL,
  DELETE_REQUEST_API_URL,
  UPDATE_REQUEST_API_URL,
} from 'library/api-url'

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'

const DISPLAY_ROWS = 8
const ROW_HEIGHT = 60.8
const {
  progress,
  completion,
  erase,
  chevronLeft,
  chevronRight,
  firstPage,
  lastPage,
} = icons

export default function DashCPPage() {
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['all-forms'],
    url: GET_ALL_FORMS_API_URL,
    refetchInterval: 300000,
  })
  const {
    mutate: mutateToDeleteRequest,
    isPending: isPendingDeletion,
    isSuccess: isDeletedSuccessfully,
  } = useMutateData({
    url: DELETE_REQUEST_API_URL,
    queryKey: ['all-forms'],
  })
  const {mutate: mutateToUpdateRequest, isSuccess: isUpdatedSuccessfully} =
    useMutateData({
      url: UPDATE_REQUEST_API_URL,
      queryKey: ['all-forms'],
    })

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DISPLAY_ROWS)
  const [status, setStatus] = React.useState('')
  let emptyRowsInLastPage

  const isPendingRequestDeletion = status === 'pending'
  const isDeletedRequest = status === 'deleted'
  const isOpenNotification = isDeletedRequest || isPendingRequestDeletion
  const isSuccessfulNotification = isOpenNotification

  const statusMsg = isPendingRequestDeletion
    ? 'در حال حذف درخواست پشتیبانی'
    : isDeletedRequest
    ? 'درخواست پشتیبانی با موفقیت حذف شد'
    : ''

  if (isSuccess) {
    emptyRowsInLastPage =
      page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0
  }

  React.useEffect(() => {
    if (isPendingDeletion) {
      setStatus('pending')
    }

    if (isDeletedSuccessfully) {
      setStatus('deleted')
    }
  }, [isPendingDeletion, isDeletedSuccessfully, isUpdatedSuccessfully])

  function handleOnDeleteRequest(id) {
    mutateToDeleteRequest({requestId: id})
  }

  function handleOnClickCell(id) {
    mutateToUpdateRequest({requestId: id, seen: true})
  }

  function handleOnChangePage(event, newPage) {
    setPage(newPage)
  }

  function handleOnChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Box sx={{p: 2}}>
      <TableContainer component={Paper} sx={{width: '100%'}}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledHeadCell>ردیف</StyledHeadCell>
              <StyledHeadCell>نام</StyledHeadCell>
              <StyledHeadCell>تاریخ ثبت</StyledHeadCell>
              <StyledHeadCell>وضعیت</StyledHeadCell>
            </TableRow>
          </TableHead>

          {isLoading ? (
            <TableBody>
              <TableRow sx={{height: ROW_HEIGHT * rowsPerPage}}>
                <TableCell colSpan={4} sx={{fontSize: 20, textAlign: 'center'}}>
                  در حال بارگزاری جدول...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : isSuccess ? (
            <>
              <TableBody>
                {(rowsPerPage > 0
                  ? data.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage,
                    )
                  : data
                ).map(({_id, name, registerDate, serviceState, seen}, idx) => (
                  <TableRow
                    key={_id}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: theme => theme.palette.action.hover,
                      },
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                      '.link': {
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                      },
                    }}
                  >
                    <StyledCell align="center">
                      {DISPLAY_ROWS * page + idx + 1}
                    </StyledCell>
                    <StyledCell
                      sx={{px: 0, cursor: 'pointer', position: 'relative'}}
                      onClick={() => handleOnClickCell(_id)}
                    >
                      {!seen && (
                        <Box
                          component="span"
                          sx={{
                            position: 'absolute',
                            top: -6,
                            left: -6,
                            width: 6,
                            height: 6,
                            border: '6px solid transparent',
                            borderBottomColor: 'error.main',
                            transform: 'rotate(45deg)',
                          }}
                        ></Box>
                      )}
                      <Link
                        href={`/dash-cp/request?q=${_id}`}
                        className="link"
                      ></Link>
                      {name}
                    </StyledCell>
                    <StyledCell align="center">
                      {registerDate.split('-')[1].slice(6)}
                    </StyledCell>
                    <StyledCell>
                      <Grid
                        container
                        sx={{
                          alignItems: 'center',
                          justifyContent: 'space-evenly',
                          gap: 0.5,
                        }}
                      >
                        {serviceState === 'در حال رسیدگی' ? (
                          <Icon name={progress} color="warning" size="small" />
                        ) : serviceState === 'انجام شده' ? (
                          <Icon
                            name={completion}
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Icon name={progress} color="grey-4" size="small" />
                        )}
                        <IconButton
                          size="small"
                          onClick={() => handleOnDeleteRequest(_id)}
                        >
                          <Icon name={erase} color="error" size="small" />
                        </IconButton>
                      </Grid>
                    </StyledCell>
                  </TableRow>
                ))}
                {emptyRowsInLastPage > 0 && (
                  <TableRow sx={{height: ROW_HEIGHT * emptyRowsInLastPage}}>
                    <StyledCell colSpan={4} />
                  </TableRow>
                )}
              </TableBody>

              <TableFooter
                sx={{
                  px: 1,
                  '.toolbar': {
                    flexDirection: 'row-reverse',
                  },
                  '.selectLabel': {
                    order: -1,
                    ml: 2,
                  },
                  '.input': {
                    order: -2,
                    mr: 1,
                  },
                  '.displayedRows': {
                    ml: 1,
                    mr: 1,
                  },
                }}
              >
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      DISPLAY_ROWS,
                      DISPLAY_ROWS + 5,
                      DISPLAY_ROWS + 5 + 5,
                    ]}
                    colSpan={4}
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="تعداد"
                    labelDisplayedRows={({from, to, count}) =>
                      `${from}-${to} از ${count}`
                    }
                    page={page}
                    onPageChange={handleOnChangePage}
                    onRowsPerPageChange={handleOnChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    classes={{
                      toolbar: 'toolbar',
                      selectLabel: 'selectLabel',
                      input: 'input',
                      displayedRows: 'displayedRows',
                    }}
                  />
                </TableRow>
              </TableFooter>
            </>
          ) : (
            <Typography variant="h3">عدم اتصال به سرور</Typography>
          )}
        </Table>
      </TableContainer>

      <Notification
        open={isOpenNotification}
        onClose={setStatus}
        message={statusMsg}
        isInfo={isPendingRequestDeletion}
        isSuccess={isSuccessfulNotification}
      />
    </Box>
  )
}

function TablePaginationActions({count, page, rowsPerPage, onPageChange}) {
  function handleOnFirstPageButtonClick(e) {
    onPageChange(e, 0)
  }

  function handleOnBackButtonClick(e) {
    onPageChange(e, page - 1)
  }

  function handleOnNextButtonClick(e) {
    onPageChange(e, page + 1)
  }

  function handleOnLastPageButtonClick(e) {
    onPageChange(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
  }

  const isDisabledBackBtns = page === 0
  const isDisabledForwBtns = page >= Math.ceil(count / rowsPerPage) - 1

  return (
    <Box sx={{flexShrink: 0, ml: 2.5}}>
      <IconButton
        onClick={handleOnFirstPageButtonClick}
        disabled={isDisabledBackBtns}
        aria-label="first page"
      >
        <Icon
          name={firstPage}
          size="small"
          color="grey-8"
          disabled={isDisabledBackBtns}
        />
      </IconButton>
      <IconButton
        onClick={handleOnBackButtonClick}
        disabled={isDisabledBackBtns}
        aria-label="previous page"
      >
        <Icon
          name={chevronRight}
          size="small"
          color="grey-8"
          disabled={isDisabledBackBtns}
        />
      </IconButton>
      <IconButton
        onClick={handleOnNextButtonClick}
        disabled={isDisabledForwBtns}
        aria-label="next page"
      >
        <Icon
          name={chevronLeft}
          size="small"
          color="grey-8"
          disabled={isDisabledForwBtns}
        />
      </IconButton>
      <IconButton
        onClick={handleOnLastPageButtonClick}
        disabled={isDisabledForwBtns}
        aria-label="last page"
      >
        <Icon
          name={lastPage}
          size="small"
          color="grey-8"
          disabled={isDisabledForwBtns}
        />
      </IconButton>
    </Box>
  )
}
