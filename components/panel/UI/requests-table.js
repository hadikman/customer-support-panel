import * as React from 'react'
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
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import {visuallyHidden} from '@mui/utils'
import Icon from 'components/UI/icon'
import StyledHeadCell from 'components/panel/UI/styled-head-cell'
import StyledCell from 'components/panel/UI/styled-cell'
import Notification from 'components/UI/notification'
import icons from 'library/icons-name'
import {DELETE_REQUEST_API_URL, UPDATE_REQUEST_API_URL} from 'library/api-url'

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

const headCells = [
  {
    id: '_id',
    disablePadding: false,
    label: 'ردیف',
  },
  {
    id: 'name',
    disablePadding: true,
    label: 'نام',
  },
  {
    id: 'registerDate',
    disablePadding: false,
    label: 'تاریخ ثبت',
  },
  {
    id: 'serviceState',
    disablePadding: false,
    label: 'وضعیت',
  },
]

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

export default function ReqeustsTable({data, isLoading, isSuccess}) {
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
  const [order, setOrder] = React.useState('asc')
  const [orderBy, setOrderBy] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(DISPLAY_ROWS)
  const [status, setStatus] = React.useState('')
  let emptyRowsInPage

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
    const dataLength = data.length
    data = data.map((d, idx) => ({...d, id: idx + 1}))

    emptyRowsInPage =
      page > 0
        ? Math.max(0, (page + 1) * rowsPerPage - dataLength)
        : DISPLAY_ROWS - dataLength
  }
  React.useEffect(() => {
    if (isPendingDeletion) {
      setStatus('pending')
    }

    if (isDeletedSuccessfully) {
      setStatus('deleted')
    }
  }, [isPendingDeletion, isDeletedSuccessfully, isUpdatedSuccessfully])

  function handleOnRequestSort(event, property) {
    const isAsc = orderBy === property && order === 'asc'

    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const visibleRows = React.useMemo(
    () =>
      stableSort(data || [], getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [data, order, orderBy, page, rowsPerPage],
  )

  function handleOnDeleteRequest(id, name) {
    const isConfirmed = confirm(`آیا مایل به حذف درخواست ${name} هستید؟`)

    if (isConfirmed) {
      mutateToDeleteRequest({requestId: id})
    }
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
    <>
      <TableContainer component={Paper} sx={{width: '100%'}}>
        <Table>
          <SortableTableHead
            order={order}
            orderBy={orderBy}
            isLoading={isLoading}
            onRequestSort={handleOnRequestSort}
          />
          {isLoading ? (
            <TableBody>
              <TableRow sx={{height: ROW_HEIGHT * rowsPerPage}}>
                <TableCell colSpan={4} sx={{fontSize: 20, textAlign: 'center'}}>
                  در حال بارگذاری جدول...
                </TableCell>
              </TableRow>
            </TableBody>
          ) : isSuccess ? (
            <>
              <TableBody>
                {visibleRows.map(
                  ({_id, id, name, registerDate, serviceState, seen}) => (
                    <TableRow
                      key={id}
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
                      <StyledCell align="left">{id}</StyledCell>
                      <StyledCell
                        sx={{px: 0, cursor: 'pointer', position: 'relative'}}
                        onClick={() => handleOnClickCell(_id)}
                      >
                        {!seen && (
                          <Box
                            component="span"
                            sx={{
                              position: 'absolute',
                              top: -5,
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
                      <StyledCell align="left">
                        {new Date(registerDate).toLocaleDateString('fa-IR', {
                          year: '2-digit',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </StyledCell>
                      <StyledCell>
                        <Grid
                          container
                          sx={{
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: 0.5,
                          }}
                        >
                          {serviceState === 'در حال رسیدگی' ? (
                            <Icon
                              name={progress}
                              color="warning"
                              size="small"
                            />
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
                            onClick={() => handleOnDeleteRequest(_id, name)}
                          >
                            <Icon name={erase} color="error" size="small" />
                          </IconButton>
                        </Grid>
                      </StyledCell>
                    </TableRow>
                  ),
                )}
                {emptyRowsInPage > 0 && (
                  <TableRow sx={{height: ROW_HEIGHT * emptyRowsInPage}}>
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
            <TableBody>
              <TableRow sx={{height: ROW_HEIGHT * rowsPerPage}}>
                <TableCell colSpan={4} sx={{fontSize: 20, textAlign: 'center'}}>
                  عدم اتصال به سرور
                </TableCell>
              </TableRow>
            </TableBody>
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
    </>
  )
}

function SortableTableHead({order, orderBy, onRequestSort, isLoading}) {
  function handleOnCreateSort(property) {
    return event => onRequestSort(event, property)
  }

  return (
    <TableHead
      sx={{
        '.sort-root-style': {
          color: theme => theme.palette.common.white,
          ':hover': {
            color: theme => theme.palette.grey[500],
          },
        },
        '& .active.active': {
          color: theme => theme.palette.common.white,
        },
        '.direction-icon': {
          fill: theme => theme.palette.common.white,
        },
      }}
    >
      <TableRow
        sx={{
          bgcolor: theme => theme.palette.grey[400],
          borderBottom: isLoading ? '6px solid' : '3px solid',
          borderColor: isLoading ? 'warning.light' : 'success.light',
          transition: 'border 0.5s',
        }}
      >
        {headCells.map(({id, disablePadding, label}) => (
          <StyledHeadCell
            key={id}
            align="left"
            padding={disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === id ? order : false}
            sx={{
              ...(id === 'name' && {minWidth: 140}),
              py: 1,
              ...(!disablePadding && {px: 1}),
            }}
          >
            <TableSortLabel
              classes={{
                root: 'sort-root-style',
                active: 'active',
                iconDirectionAsc: 'direction-icon',
                iconDirectionDesc: 'direction-icon',
              }}
              active={orderBy === id}
              direction={orderBy === id ? order : 'asc'}
              onClick={handleOnCreateSort(id)}
            >
              {label}
              {orderBy === id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledHeadCell>
        ))}
      </TableRow>
    </TableHead>
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
