import * as React from 'react'
import Link from 'next/link'
import useMutateData from 'hook/useMutateData'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import CustomizedTextField from 'components/UI/customized-text-field'
import {orange} from '@mui/material/colors'
import {
  CHECK_EXISTENCE_VALUE_API_URL,
  REGISTER_SURVEY_API_URL,
} from 'library/api-url'

const ANSWER_HEIGHT = 50

const answers = {
  satisfaction: ['بسیار راضی', 'راضی', 'نظری ندارم', 'ناراضی', 'بسیار ناراضی'],
  happiness: ['عالی', 'خیلی خوب', 'خوب', 'متوسط', 'ضعیف'],
  achievement: ['بله', 'مطمئن نیستم', 'خیر'],
}
const RATE_SERIES = ['A', 'B', 'C', 'D', 'E']

let maxAnswersItems = 1

function generateQuestionAndAnswers(question, answerGroup) {
  return {
    question,
    answers: answers[answerGroup].map((answer, idx) => {
      maxAnswersItems = maxAnswersItems < idx + 1 ? idx + 1 : maxAnswersItems

      return {
        rate: RATE_SERIES[idx],
        value: answer,
      }
    }),
  }
}

const questions = [
  generateQuestionAndAnswers(
    'تا چه حد از نصب و راه اندازی محصول خود راضی هستید؟',
    'satisfaction',
  ),
  generateQuestionAndAnswers(
    'چه میزان از حضور به موقع کارشناسان ما رضایت داشته اید؟',
    'satisfaction',
  ),
  generateQuestionAndAnswers(
    'تا چه حد از کیفیت نصب و راه اندازی محصول رضایت دارید؟',
    'satisfaction',
  ),
  generateQuestionAndAnswers(
    'چه میزان از عملکرد کارشناسان ما رضایت داشته اید؟',
    'satisfaction',
  ),
  generateQuestionAndAnswers(
    'به طور کلی چه میزان از خدمات نصب شرکت رضایت دارید؟',
    'satisfaction',
  ),
  generateQuestionAndAnswers(
    'تا چه حد از ارتباط خود با شرکت راضی بودید؟',
    'happiness',
  ),
  generateQuestionAndAnswers(
    'در حالت کلی خدمات پس از فروش شرکت ... است.',
    'happiness',
  ),
  generateQuestionAndAnswers(
    'ارزش خدمات پس از فروش شرکت در مقایسه با مبلغ پرداختی ... است.',
    'happiness',
  ),
  generateQuestionAndAnswers(
    'آیا با توجه به خدمات پس از فروش، محصولات ما را به دیگران توصیه می کنید؟',
    'achievement',
  ),
]

export default function SurveyPage() {
  const {
    mutate: mutateToCheckMobileNumber,
    data,
    isPending: isPendingToCheckMobileNumber,
    isSuccess: isCheckedMobileNumberSuccessfully,
  } = useMutateData({url: CHECK_EXISTENCE_VALUE_API_URL})
  const {
    mutate: mutateToRegisterSurvey,
    isPending: isPendingToRegisterSurvey,
    isSuccess: isRegisteredSurveySuccessfully,
  } = useMutateData({url: REGISTER_SURVEY_API_URL})
  const [name, setName] = React.useState('')
  const [mobileNumber, setMobileNumber] = React.useState('')
  const [questionNumber, setQuestionNumber] = React.useState(1)
  const [selectAnswerId, setSelectAnswerId] = React.useState(0)
  const questionAndAnswerRef = React.useRef('')
  const [survey, setSurvey] = React.useState([])

  const [status, setStatus] = React.useState('')

  const questionsCount = questions.length
  const progressBarSingleQuestionWidth = 100 / questionsCount
  const progressBarAnsweredQuestionsWidth =
    progressBarSingleQuestionWidth * questionNumber

  const isValidCustomer = status === 'valid'
  const isInvalidCustomer = status === 'invalid'
  const isRegisteredSurvey = status === 'registered'
  const hasNextQuestion = questionNumber < questionsCount

  const statusMsg = isInvalidCustomer ? 'شماره موبایل تایید نشد' : ''

  React.useEffect(() => {
    if (isCheckedMobileNumberSuccessfully) {
      if (data.exist) {
        setStatus('valid')
      } else {
        setStatus('invalid')
      }
    }
  }, [data, isCheckedMobileNumberSuccessfully])

  React.useEffect(() => {
    if (isRegisteredSurveySuccessfully) {
      if (data.message === 'successful') {
        setStatus('registered')
      }
    }
  }, [data, isRegisteredSurveySuccessfully])

  function handleOnSubmitForm(e) {
    e.preventDefault()

    mutateToCheckMobileNumber({mobileNumber})
  }

  function handleOnSelectAnswer(question, answer) {
    questionAndAnswerRef.current = {question, answer}
    setSelectAnswerId(answer.rate)
  }

  function handleOnNextQuestion(number) {
    if (hasNextQuestion) {
      setSelectAnswerId(0)
      setQuestionNumber(number)
      setSurvey(prevState => [...prevState, questionAndAnswerRef.current])
    } else {
      const surveyResult = [...survey, questionAndAnswerRef.current]
      const surveyData = {
        name,
        mobileNumber,
        surveyResult,
      }

      mutateToRegisterSurvey(surveyData)
    }
  }

  return (
    <Box>
      <Stack sx={{gap: 1, mb: 2}}>
        <Box sx={{textAlign: 'center', my: 2}}>
          <Typography variant="h4" sx={{fontWeight: 700}}>
            نظرسنجی{' '}
            <Box component="span" sx={{color: 'accent.main'}}>
              شرکت تست
            </Box>
          </Typography>
        </Box>
        <Typography variant="body2">
          به صفحه نظرسنجی ما خوش آمدید! بازخورد شما برای ما بسیار ارزشمند است
          زیرا ما در تلاش هستیم تا خدمات پشتیبانی خود را ارتقاء دهیم و نیازهای
          شما را به طور موثر برآورده کنیم.
        </Typography>
        <Typography variant="body2">
          این نظرسنجی برای جمع آوری افکار و نظرات شما در مورد خدمات پشتیبانی که
          تجربه کرده اید طراحی شده است. بازخورد صادقانه شما به ما کمک می‌کند تا
          نقاط قوت و زمینه‌هایی را که می‌توانیم برای خدمات بهتر به شما بهبود
          بخشیم را شناسایی کنیم.
        </Typography>
        <Typography variant="body2">
          از اینکه برای به اشتراک گذاشتن نظرات خود و کمک به بهبود مستمر خدمات
          پشتیبانی ما وقت گذاشتید سپاسگزاریم.
        </Typography>
      </Stack>

      <Box
        sx={{
          bgcolor: theme => theme.palette.grey[100],
          border: '2px solid',
          borderColor: 'accent.main',
          borderRadius: theme => theme.shape.borderRadius,
        }}
      >
        <Stack
          component="form"
          onSubmit={handleOnSubmitForm}
          sx={{
            p: 2,
            '.fix-height': {
              minHeight: 80,
            },
          }}
        >
          <CustomizedTextField
            id="name"
            className="fix-height"
            label="نام خانوادگی"
            placeholder="آقای/خانم رضایی"
            errorMessage="فقط حروف فارسی/انگلیسی مجاز است."
            fullWidth
            required
            autoFocus
            regex={/^[a-zA-Z\u0600-\u06FF\s]+$/}
            length="35"
            onReturnValue={setName}
          />
          <CustomizedTextField
            id="mobile-number"
            className="fix-height"
            type="number"
            label="شماره موبایل"
            placeholder="نمونه: 09387069917"
            isError={isInvalidCustomer}
            helperText={statusMsg}
            required
            regex={/^[۰0][۰-۹0-9]*$/}
            length="11"
            errorMessage="فقط اعداد مجاز است و شماره باید با صفر شروع شود"
            fullWidth
            debounceDuration={200}
            onReturnValue={setMobileNumber}
          />
          {isValidCustomer || isRegisteredSurveySuccessfully ? (
            <Typography sx={{color: 'accent.dark'}}>
              شماره موبایل تایید شد ✓
            </Typography>
          ) : (
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={isPendingToCheckMobileNumber}
            >
              تایید شماره موبایل
              {isPendingToCheckMobileNumber && (
                <CircularProgress size={15} color="inherit" sx={{ml: 1}} />
              )}
            </Button>
          )}
        </Stack>

        <Box
          sx={{
            gap: 4,
            bgcolor: 'accent.main',
            color: 'accent.contrastText',
            borderRadius: theme => theme.shape.borderRadius,
            p: 2,
            mb: -0.25,
          }}
        >
          {isRegisteredSurvey ? (
            <Stack sx={{gap: 2, p: 2}}>
              <Typography>
                با تشکر از شما برای تکمیل نظرسنجی ما! بینش شما در بهبود خدمات
                پشتیبانی ما بسیار مهم است. ما از وقت و تعهد شما برای کمک به ما
                برای افزایش تجربه شما قدردانی می کنیم.
              </Typography>
              <Typography>
                بازخورد شما بسیار ارزشمند است و ما مشتاقانه منتظر اعمال تغییرات
                مثبت بر اساس نظرات شما هستیم. از اینکه بخش ارزشمندی از سفر ما به
                سوی تعالی بودید متشکریم!
              </Typography>
              <Button variant="outlined" color="inherit">
                <Link href="/customer">بازگشت به صفحه اصلی</Link>
              </Button>
            </Stack>
          ) : isValidCustomer ? (
            <Stack
              sx={{
                gap: 2,
                border: '2px solid',
                borderColor: 'accent.contrastText',
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  overflow: 'hidden',
                  position: 'relative',
                  '::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'accent.dark',
                    borderRadius: theme => theme.shape.borderRadius,
                  },
                  '.show-question': {
                    width: '100%',
                    transform: 'translateX(0%)',
                    p: 2,
                    opacity: 1,
                    visibility: 'visible',
                  },
                  '.hide-question': {
                    width: 0,
                    height: 0,
                    transform: 'translateX(100%)',
                    opacity: 0,
                    visibility: 'hidden',
                  },
                  '.answer': {
                    border: '2px solid',
                    borderColor: 'accent.contrastText',
                    borderRadius: theme => theme.shape.borderRadius,
                    px: 2,
                    py: 1,
                    cursor: 'pointer',
                    transition: 'outline 0.15s',
                  },
                  '.select-answer': {
                    outline: '4px dashed',
                    outlineColor: orange[400],
                    outlineOffset: 4,
                  },
                }}
              >
                {questions.map(({question, answers}, idx) => (
                  <Box
                    key={question}
                    className={
                      idx === questionNumber - 1
                        ? 'show-question'
                        : 'hide-question'
                    }
                    sx={{
                      transition: 'transform 0.6s, opacity 1s',
                      '& > * + *': {mt: 2},
                    }}
                  >
                    <Typography sx={{mb: 4}}>{question}</Typography>

                    {answers.map(({rate, value}) => (
                      <Box
                        key={rate}
                        className={`answer ${
                          rate === selectAnswerId ? 'select-answer' : ''
                        }`}
                        onClick={() =>
                          handleOnSelectAnswer(question, {rate, value})
                        }
                      >
                        {value}
                      </Box>
                    ))}
                    {answers.length < maxAnswersItems && (
                      <Box
                        sx={{
                          height:
                            (maxAnswersItems - answers.length) * ANSWER_HEIGHT,
                        }}
                      ></Box>
                    )}
                  </Box>
                ))}
              </Box>

              <Grid
                container
                sx={{alignItems: 'center', justifyContent: 'space-between'}}
              >
                <Grid item>
                  <Box>
                    <Box
                      sx={{
                        display: 'inline-block',
                        width: 65,
                        height: 8,
                        border: 'thin solid',
                        borderColor: 'accent.contrastText',
                        borderRadius: theme => theme.shape.borderRadius,
                        mr: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: `${progressBarAnsweredQuestionsWidth}%`,
                          height: '100%',
                          bgcolor: 'accent.contrastText',
                          transition: 'width 0.6s',
                        }}
                      ></Box>
                    </Box>

                    <Box sx={{display: 'inline-block'}}>
                      {questionNumber} از {questionsCount}
                    </Box>
                  </Box>
                </Grid>

                <Grid item>
                  <Button
                    variant="outlined"
                    color="inherit"
                    disabled={isPendingToRegisterSurvey}
                    onClick={() => handleOnNextQuestion(questionNumber + 1)}
                  >
                    {hasNextQuestion ? 'بعدی ←' : 'ثبت نظرسنجی'}
                    {isPendingToRegisterSurvey && (
                      <CircularProgress
                        size={15}
                        color="inherit"
                        sx={{ml: 1}}
                      />
                    )}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          ) : (
            <Box sx={{p: 2}}>
              <Typography>
                قبل از شروع نظرسنجی، شماره موبایل وارد شده در لیست مشتریان
                مجموعه بررسی می‌شود و در صورت احراز و تایید شماره موبایل،
                نظرسنجی نمایش داده خواهد شد.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
