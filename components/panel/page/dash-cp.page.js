import * as React from 'react'
import {Calendar, utils} from '@hassanmojab/react-modern-calendar-datepicker'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
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
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ButtonGroup from '@mui/material/ButtonGroup'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Icon from 'components/UI/icon'
import DUMMY_DATA from 'library/dummy-data'
import icons from 'library/icons-name'
import {customVerticalScrollbar} from 'utility/scrollbar-group'

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'

const DISPLAY_ROWS = 8
const aliasNames = {
  id: 'شماره',
  name: 'نام خانوادگی',
  address: 'آدرس',
  mobileNumber: 'شماره موبایل',
  phoneNumber: 'شماره ثابت',
  services: 'خدمات',
  description: 'توضیحات',
  descOfServicesPerformed: 'سرویس‌های انجام شده',
  dateOfService: 'تاریخ بازدید',
  serviceState: 'وضعیت رسیدگی',
}
const {
  progress,
  completion,
  erase,
  chevronLeft,
  chevronRight,
  firstPage,
  lastPage,
} = icons
const todayData = utils('fa').getToday()

export default function DashCPPage() {
  const [openModal, setOpenModal] = React.useState(false)
  const [requestData, setRequestData] = React.useState([])
  const [serviceState, setServiceState] = React.useState('')
  const [examinationDesc, setExaminationDesc] = React.useState('')
  const [selectedExaminationDate, setSelectedExaminationDate] =
    React.useState('')
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(DISPLAY_ROWS)

  const isShowSingleRequest = requestData.length !== 0
  const isServiceInProgress = serviceState === 'در حال رسیدگی'
  const isCompletedService = serviceState === 'انجام شده'
  const isEmptyService = !isServiceInProgress && !isCompletedService
  const isEmptyExaminationDesc = examinationDesc === ''
  const isEmptySelectedExaminationDate = selectedExaminationDate === ''
  const isEmptyExaminationForm =
    isEmptyExaminationDesc && isEmptySelectedExaminationDate && isEmptyService

  const emptyRowsInLastPage =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DUMMY_DATA.length) : 0

  function handleOnDeleteRequest(id) {
    // TODO send a POST request to the API - /deleteRequest {requestID: id}
  }

  function handleOnOpenModal(id) {
    let newStructuredRequestData = []

    const foundObj = DUMMY_DATA.find(request => request.id === id)
    for (let [key, value] of Object.entries(foundObj)) {
      const aliasName = aliasNames[key]
      const isAliasName = aliasName
      const isValue = Boolean(value)

      if (isAliasName) {
        newStructuredRequestData.push({
          title: aliasName,
          content: isValue ? value : '—',
        })
      }
    }

    setOpenModal(true)
    setRequestData(newStructuredRequestData)

    // TODO send a POST request to the API - /seenRequest {requestID: id, seen: true}
  }

  function handleOnCloseModal() {
    setOpenModal(false)
    setSelectedExaminationDate('')
    setExaminationDesc('')
  }

  function handleOnServiceState(state) {
    setServiceState(prevState => (state === prevState ? '' : state))
  }

  function handleOnChangeDescription(e) {
    setExaminationDesc(e.target.value)
  }

  function handleOnClickGoToToday() {
    setSelectedExaminationDate(todayData)
  }

  function handleOnChangePage(event, newPage) {
    setPage(newPage)
  }

  function handleOnChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  function handleOnSubmitExaminationForm(e) {
    e.preventDefault()
    const {day, month, year} = selectedExaminationDate

    const formData = {
      id: requestData[0].content,
      descOfServicesPerformed: examinationDesc,
      dateOfService: `${year}/${month}/${day}`,
      serviceState,
    }

    // TODO send a POST req to the API - /registerExaminationRequest formData
  }

  return (
    <Box sx={{p: 2}}>
      <TableContainer component={Paper} sx={{width: '100%'}}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledHeadCell>ردیف</StyledHeadCell>
              <StyledHeadCell>نام</StyledHeadCell>
              <StyledHeadCell>وضعیت</StyledHeadCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? DUMMY_DATA.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage,
                )
              : DUMMY_DATA
            ).map(({id, name, serviceState, seen}, idx) => (
              <TableRow
                key={id}
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme => theme.palette.action.hover,
                  },
                  '&:last-child td, &:last-child th': {border: 0},
                }}
              >
                <TableCell>{DISPLAY_ROWS * page + idx + 1}</TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  onClick={() => handleOnOpenModal(id)}
                  sx={{cursor: 'pointer', position: 'relative'}}
                >
                  {seen && (
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        width: 8,
                        height: 8,
                        border: '8px solid transparent',
                        borderBottomColor: 'error.main',
                        transform: 'rotate(45deg)',
                      }}
                    ></Box>
                  )}
                  {name}
                </TableCell>
                <TableCell>
                  <Grid container sx={{alignItems: 'center', gap: 1}}>
                    {serviceState === 'در حال رسیدگی' ? (
                      <Icon name={progress} color="warning" size="small" />
                    ) : serviceState === 'انجام شده' ? (
                      <Icon name={completion} color="success" size="small" />
                    ) : (
                      <Icon name={progress} color="grey-4" size="small" />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleOnDeleteRequest(id)}
                    >
                      <Icon name={erase} color="error" size="small" />
                    </IconButton>
                  </Grid>
                </TableCell>
              </TableRow>
            ))}
            {emptyRowsInLastPage > 0 && (
              <TableRow style={{height: 60.8 * emptyRowsInLastPage}}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter sx={{px: 1}}>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  DISPLAY_ROWS,
                  DISPLAY_ROWS + 5,
                  DISPLAY_ROWS + 5 + 5,
                ]}
                colSpan={3}
                count={DUMMY_DATA.length}
                rowsPerPage={rowsPerPage}
                labelRowsPerPage="تعداد"
                labelDisplayedRows={({from, to, count}) =>
                  `${from}-${to} از ${count}`
                }
                page={page}
                onPageChange={handleOnChangePage}
                onRowsPerPageChange={handleOnChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
                sx={{
                  '& .MuiTablePagination-toolbar': {
                    flexDirection: 'row-reverse',
                  },
                  '& .MuiTablePagination-selectLabel': {
                    order: -1,
                    ml: 2,
                  },
                  '& .MuiTablePagination-input': {
                    order: -2,
                    mr: 1,
                  },
                  '& .MuiTablePagination-displayedRows': {
                    ml: 1,
                    mr: 1,
                  },
                }}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {isShowSingleRequest && (
        <Modal open={openModal} onClose={handleOnCloseModal} sx={{p: 2}}>
          <Fade in={openModal}>
            <Box
              sx={{
                backgroundColor: theme => theme.palette.common.white,
                color: theme => theme.palette.common.black,
                borderRadius: theme => theme.shape.borderRadius,
                p: 2,
              }}
            >
              <Box
                sx={{
                  maxHeight: '84vh',
                  p: 1,
                  overflowY: 'auto',
                  ...customVerticalScrollbar,
                }}
              >
                <TableContainer component={Paper} sx={{width: '100%', mb: 2}}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledHeadCell>عنوان</StyledHeadCell>
                        <StyledHeadCell>شرح</StyledHeadCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requestData.map(({title, content}, idx) => {
                        const isArrayContent = Array.isArray(content)

                        return (
                          <TableRow
                            key={idx}
                            sx={{
                              '&:nth-of-type(odd)': {
                                backgroundColor: theme =>
                                  theme.palette.action.hover,
                              },
                              '&:last-child td, &:last-child th': {border: 0},
                            }}
                          >
                            <TableCell>{title}</TableCell>
                            {isArrayContent ? (
                              <TableCell>
                                <Stack
                                  sx={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    gap: 1,
                                  }}
                                >
                                  {content.map(val => (
                                    <Chip
                                      key={val}
                                      label={val}
                                      color="primary"
                                    />
                                  ))}
                                </Stack>
                              </TableCell>
                            ) : (
                              <TableCell>{content}</TableCell>
                            )}
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Divider
                  sx={{borderWidth: 1.5, borderStyle: 'dotted', mb: 2}}
                />

                <Stack
                  component="form"
                  sx={{gap: 2}}
                  onSubmit={handleOnSubmitExaminationForm}
                >
                  <Typography>ثبت وضعیت رسیدگی</Typography>
                  <ButtonGroup>
                    <Button
                      variant={isServiceInProgress ? 'contained' : 'outlined'}
                      color="warning"
                      onClick={() => handleOnServiceState('در حال رسیدگی')}
                    >
                      در حال رسیدگی
                    </Button>
                    <Button
                      variant={isCompletedService ? 'contained' : 'outlined'}
                      color="success"
                      onClick={() => handleOnServiceState('انجام شده')}
                    >
                      انجام شده
                    </Button>
                  </ButtonGroup>

                  <TextField
                    id="examination-description"
                    label="شرح بازدید"
                    value={examinationDesc}
                    multiline
                    rows={6}
                    fullWidth
                    onChange={handleOnChangeDescription}
                  />
                  <Typography>ثبت تاریخ بازدید</Typography>
                  <Box
                    sx={{
                      mx: 'auto',
                      '.calendar-size': {
                        fontSize: 9,
                      },
                      '.today': {
                        border: '1.5px solid',
                        borderColor: 'success.light',
                      },
                    }}
                  >
                    <Calendar
                      calendarClassName="calendar-size"
                      calendarTodayClassName="today"
                      value={selectedExaminationDate}
                      onChange={setSelectedExaminationDate}
                      shouldHighlightWeekends
                      locale="fa"
                      renderFooter={() => (
                        <Box
                          sx={{
                            bgcolor: theme => theme.palette.warning.light,
                            borderBottomRightRadius: 4,
                            borderBottomLeftRadius: 4,
                            p: 1,
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={handleOnClickGoToToday}
                          >
                            امروز
                          </Button>
                        </Box>
                      )}
                    />
                  </Box>

                  <Stack sx={{flexDirection: 'row', gap: 2}}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isEmptyExaminationForm}
                      sx={{flexGrow: 1}}
                    >
                      ثبت بازدید
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleOnCloseModal}
                    >
                      بستن
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          </Fade>
        </Modal>
      )}
    </Box>
  )
}

function StyledHeadCell({children, ...props}) {
  return (
    <TableCell
      sx={{
        backgroundColor: theme => theme.palette.common.black,
        color: theme => theme.palette.common.white,
      }}
      {...props}
    >
      {children}
    </TableCell>
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
