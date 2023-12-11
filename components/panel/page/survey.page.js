import * as React from 'react'
import useQueryData from 'hook/useQueryData'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Autocomplete from '@mui/material/Autocomplete'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import {GET_SURVEY_API_URL} from 'library/api-url'

const RATES = {
  A: '',
  B: '',
  C: '',
  D: '',
  E: '',
}

export default function SurveyPage() {
  const {data, isLoading, isSuccess} = useQueryData({
    queryKey: ['survey'],
    url: GET_SURVEY_API_URL,
  })
  const [selectDate, setSelectDate] = React.useState('')
  const maxCountRef = React.useRef(0)

  const formattedSurveyData = []
  let surveyDates = []

  if (isSuccess) {
    data.forEach(surveyData => {
      const {surveyResult, registerDate} = surveyData
      const date = generatePersianDate(registerDate)

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
  const maxCountRefDividedByTen = Math.floor((maxCountRef.current - 1) / 10)
  const ceilOfMaxCount = maxCountRefDividedByTen * 10 + 10 // 4 => 10, 13 => 20, 28 => 30, ...
  const fullBarLength = 100 / ceilOfMaxCount

  React.useEffect(() => {
    if (isSuccess) {
      setSelectDate(generatePersianDate(data[0].registerDate))
    }
  }, [isSuccess, data])

  function handleOnChangeDate(event, selectedDate) {
    setSelectDate(selectedDate)
  }

  return (
    <Box>
      {isLoading ? (
        'در حال بارگذاری نظرسنجی...'
      ) : isSuccess ? (
        <Box>
          <Autocomplete
            options={surveyDates}
            isOptionEqualToValue={option => option}
            value={selectDate}
            onChange={handleOnChangeDate}
            sx={{width: 200, mb: 4}}
            renderInput={params => (
              <TextField {...params} label="انتخاب تاریخ" variant="standard" />
            )}
          />

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
                            <Grid item xs="auto" sx={{width: 85}}>
                              {value}
                            </Grid>
                            <Grid
                              item
                              xs="auto"
                              sx={{width: 12, textAlign: 'center'}}
                            >
                              {rate}
                            </Grid>
                            <Grid
                              item
                              xs="auto"
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

function generatePersianDate(date) {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
}
