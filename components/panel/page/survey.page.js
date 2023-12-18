import * as React from 'react'
import {useRouter} from 'next/router'
import {useQueryClient} from '@tanstack/react-query'
import useQueryData from 'hook/useQueryData'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import {GET_SURVEY_API_URL} from 'library/api-url'
import generatePersianTime from 'utility/generate-persian-time'

const RATES = {
  A: '',
  B: '',
  C: '',
  D: '',
  E: '',
}

export default function SurveyPage() {
  const {push} = useRouter()
  const queryClient = useQueryClient()
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['survey'],
    url: GET_SURVEY_API_URL,
  })
  const [selectDate, setSelectDate] = React.useState('')
  const maxCountRef = React.useRef(0)

  const formattedSurveyData = []
  let surveyDates = []
  let selectedDateSurveys = []

  if (isSuccess) {
    data.forEach(surveyData => {
      const {surveyResult, registerDate} = surveyData
      const date = generatePersianTime(registerDate)

      let foundDate = formattedSurveyData.find(item => item.date === date)

      if (!foundDate) {
        formattedSurveyData.push({date, surveys: []})
      }

      const idx = formattedSurveyData.length - 1

      surveyResult.forEach(result => {
        const {question, answer} = result
        const {rate, value} = answer

        let foundSurvey = formattedSurveyData[idx].surveys.find(
          survey => survey.question === question,
        )

        if (!foundSurvey) {
          formattedSurveyData[idx].surveys.push({
            question: question,
            answers: [],
          })

          foundSurvey = formattedSurveyData[idx].surveys.find(
            survey => survey.question === question,
          )
        }

        let foundAnswers = foundSurvey.answers.find(item => item.rate === rate)

        if (!foundAnswers) {
          foundSurvey.answers.push(
            ...Object.keys(RATES).map(rate => ({rate, value: '—', count: 0})),
          )

          foundAnswers = foundSurvey.answers.find(item => item.rate === rate)
        }

        foundAnswers.value = value
        foundAnswers.count++
      })
    })

    formattedSurveyData.forEach(surveyData => {
      surveyData.surveys.forEach(survey => {
        survey.answers.forEach(({count}) => {
          if (count > maxCountRef.current) {
            maxCountRef.current = count
          }
        })

        survey.answers = survey.answers.sort((a, b) => {
          const aRate = a.rate
          const bRate = b.rate

          if (aRate < bRate) {
            return -1
          }
          if (aRate > bRate) {
            return 1
          }

          return 0
        })
      })
    })

    surveyDates = formattedSurveyData.map(({date}) => date)
  }

  if (selectDate) {
    data.forEach(surveyData => {
      const {registerDate} = surveyData
      const date = generatePersianTime(registerDate)

      if (selectDate === date) {
        selectedDateSurveys.push(surveyData)
      }
    })
  }

  if (selectedDateSurveys.length > 0) {
    queryClient.setQueryData(['print-surveys'], selectedDateSurveys)
  }

  const maxCountRefDividedByTen = Math.floor((maxCountRef.current - 1) / 10)
  const ceilOfMaxCount = maxCountRefDividedByTen * 10 + 10 // 4 => 10, 13 => 20, 28 => 30, ...
  const fullBarLength = 100 / ceilOfMaxCount

  React.useEffect(() => {
    if (isSuccess) {
      setSelectDate(generatePersianTime(data[0].registerDate))
    }
  }, [isSuccess, data])

  function handleOnChangeDate(event, selectedDate) {
    setSelectDate(selectedDate)
  }

  function handleOnPrint() {
    push('/dash-cp/print')
  }

  return (
    <Box>
      {isLoading ? (
        'در حال بارگذاری نظرسنجی...'
      ) : isSuccess ? (
        <Box>
          <Grid
            container
            sx={{
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              mb: 4,
            }}
          >
            <Autocomplete
              options={surveyDates}
              isOptionEqualToValue={option => option}
              value={selectDate}
              onChange={handleOnChangeDate}
              sx={{width: 200}}
              renderInput={params => (
                <TextField
                  {...params}
                  label="انتخاب تاریخ"
                  variant="standard"
                />
              )}
            />

            <Button variant="contained" onClick={handleOnPrint}>
              چاپ
            </Button>
          </Grid>

          <Box>
            {formattedSurveyData.map(({date, surveys}) => (
              <Box
                key={date}
                sx={{
                  '& > *:nth-of-type(odd)': {
                    bgcolor: theme => theme.palette.grey[50],
                  },
                  '& > *:nth-of-type(even)': {
                    bgcolor: theme => theme.palette.grey[200],
                  },
                }}
              >
                {selectDate === date && (
                  <>
                    {surveys.map(({question, answers}) => (
                      <Box key={question} sx={{py: 2, px: 1}}>
                        <Typography>{question}</Typography>

                        {answers.map(({value, rate, count}) => (
                          <Grid key={rate} container sx={{gap: 1}}>
                            <Grid item sx={{width: 85}}>
                              {value}
                            </Grid>
                            <Grid item sx={{width: 12, textAlign: 'center'}}>
                              {rate}
                            </Grid>
                            <Grid
                              item
                              sx={{
                                width:
                                  maxCountRef.current < 10
                                    ? 11
                                    : maxCountRef.current >= 10
                                    ? 20
                                    : 30,
                                textAlign: 'center',
                              }}
                            >
                              {count}
                            </Grid>
                            <Grid
                              item
                              xs
                              sx={{display: 'flex', alignItems: 'center'}}
                            >
                              <Box
                                sx={{
                                  width: `${count * fullBarLength}%`,
                                  height: 10,
                                  bgcolor: 'accent.main',
                                }}
                              ></Box>
                            </Grid>
                          </Grid>
                        ))}
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
