import * as React from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import useQueryData from 'hook/useQueryData'
import useMutateData from 'hook/useMutateData'
import {Calendar, utils} from '@hassanmojab/react-modern-calendar-datepicker'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import StyledHeadCell from 'components/panel/UI/styled-head-cell'
import {GET_FORM_API_URL, UPDATE_REQUEST_API_URL} from 'library/api-url'

import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css'

const aliasNames = {
  position: 'شماره',
  name: 'نام خانوادگی',
  address: 'آدرس',
  mobileNumber: 'شماره موبایل',
  phoneNumber: 'شماره ثابت',
  services: 'خدمات',
  description: 'توضیحات',
  descOfServicesPerformed: 'شرح بازدید',
  dateOfService: 'تاریخ بازدید',
  serviceState: 'وضعیت رسیدگی',
  registerDate: 'تاریخ ثبت',
}
const todayData = utils('fa').getToday()

export default function Request() {
  const router = useRouter()
  const {q} = router.query
  const isQuery = q !== undefined
  const {
    data: requestData,
    isLoading,
    isSuccess,
  } = useQueryData({
    enabled: isQuery,
    queryKey: ['request-form', q],
    url: GET_FORM_API_URL,
    body: {requestId: q},
  })
  const {
    mutate: mutateToUpdateRequest,
    isPending,
    isSuccess: isUpdatedSuccessfully,
  } = useMutateData({
    url: UPDATE_REQUEST_API_URL,
    queryKey: ['request-form', q],
  })
  const [formattedRequestData, setFormattedRequestData] = React.useState([])
  const [status, setStatus] = React.useState('')
  const [serviceState, setServiceState] = React.useState('')
  const [examinationDesc, setExaminationDesc] = React.useState('')
  const [selectedExaminationDate, setSelectedExaminationDate] =
    React.useState('')

  const isReadyData = formattedRequestData.length > 0
  const isServiceInProgress = serviceState === 'در حال رسیدگی'
  const isCompletedService = serviceState === 'انجام شده'
  const isEmptyService = !isServiceInProgress && !isCompletedService
  const isEmptyExaminationDesc = examinationDesc === ''
  const isEmptySelectedExaminationDate = selectedExaminationDate === ''
  const isEmptyExaminationForm =
    isEmptyExaminationDesc && isEmptySelectedExaminationDate && isEmptyService
  const isSendingUpdateRequest = status === 'sending'
  const isUpdatedRequest = status === 'updated'
  const isDisabledRegistrationButton =
    isEmptyExaminationForm || isSendingUpdateRequest || isUpdatedRequest
  const statusMsg = isSendingUpdateRequest
    ? 'در حال ارسال'
    : isUpdatedRequest
    ? 'بروزرسانی انجام شد'
    : ''

  React.useEffect(() => {
    if (isSuccess) {
      let newFormat = []

      for (let [key, value] of Object.entries(requestData)) {
        const aliasName = aliasNames[key]
        const isMobileNumber = key === 'mobileNumber'
        const isAliasName = aliasName
        const isValue = Boolean(value)

        if (isAliasName) {
          newFormat.push({
            title: aliasName,
            content: isMobileNumber ? `0${value}` : isValue ? value : '—',
          })
        }
      }

      setFormattedRequestData(newFormat)
    }

    if (isPending) {
      setStatus('sending')
    }

    if (isUpdatedSuccessfully) {
      setStatus('updated')
    }
  }, [isSuccess, isPending, isUpdatedSuccessfully, requestData])

  React.useEffect(() => {
    let timeout

    if (isUpdatedRequest) {
      timeout = setTimeout(() => {
        setStatus('')
      }, 2500)
    }

    return () => clearTimeout(timeout)
  }, [isUpdatedRequest])

  function handleOnServiceState(state) {
    setServiceState(prevState => (state === prevState ? '' : state))
  }

  function handleOnChangeDescription(e) {
    setExaminationDesc(e.target.value)
  }

  function handleOnClickGoToToday() {
    setSelectedExaminationDate(todayData)
  }

  function handleOnSubmitExaminationForm(e) {
    e.preventDefault()

    const formData = {
      requestId: requestData._id,
      serviceState: serviceState ? serviceState : requestData.serviceState,
      descOfServicesPerformed: examinationDesc
        ? examinationDesc.trim()
        : requestData.examinationDesc,
      dateOfService: selectedExaminationDate
        ? `${selectedExaminationDate.year}/${selectedExaminationDate.month}/${selectedExaminationDate.day}`
        : requestData.dateOfService,
    }

    mutateToUpdateRequest(formData)
  }

  return (
    <>
      <Head>
        <title>{isSuccess && requestData.name}</title>
      </Head>

      <Box
        sx={{
          backgroundColor: theme => theme.palette.common.white,
          color: theme => theme.palette.common.black,
          p: 2,
        }}
      >
        {isLoading ? (
          <Typography variant="body2">در حال بارگزاری...</Typography>
        ) : isSuccess && isReadyData ? (
          <Box>
            <TableContainer component={Paper} sx={{width: '100%', mb: 2}}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledHeadCell>عنوان</StyledHeadCell>
                    <StyledHeadCell>شرح</StyledHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formattedRequestData.map(({title, content}) => {
                    const isArrayContent = Array.isArray(content)

                    return (
                      <TableRow
                        key={title}
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
                                <Chip key={val} label={val} color="primary" />
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

            <Divider sx={{borderWidth: 1.5, borderStyle: 'dotted', mb: 2}} />

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
                  disabled={
                    isEmptyExaminationForm || isDisabledRegistrationButton
                  }
                  sx={{flexGrow: 1}}
                >
                  {statusMsg === 'در حال ارسال' ? (
                    <>
                      {statusMsg} <CircularProgress size={15} sx={{mx: 1}} />
                    </>
                  ) : statusMsg ? (
                    statusMsg
                  ) : (
                    'ثبت بازدید'
                  )}
                </Button>
                <Button variant="contained" color="error">
                  <Link href="/dash-cp">صفحه قبل</Link>
                </Button>
              </Stack>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body1" color="red">
            نمایش درخواست...
          </Typography>
        )}
      </Box>
    </>
  )
}
