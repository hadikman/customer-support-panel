import * as React from 'react'
import Link from 'next/link'
import useMutateData from 'hook/useMutateData'
import {useTheme} from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormHelperText from '@mui/material/FormHelperText'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import CustomizedTextField from 'components/UI/customized-text-field'
import {ADD_REGISTER_REQUEST_API_URL} from 'library/api-url'

export default function RegisterPage() {
  const [isRegisteredForm, setIsRegisteredForm] = React.useState(false)
  const [submittedFormData, setSubmittedFormData] = React.useState({})

  return (
    <Box>
      {isRegisteredForm ? (
        <Stack
          spacing={4}
          sx={{alignItems: 'center', textAlign: 'center', pt: 25}}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'success.main',
              outline: '2px solid',
              outlineOffset: 8,
              outlineColor: 'success.main',
              borderRadius: 1,
            }}
          >
            فرم درخواست پشتیبانی با موفقیت ثبت گردید
          </Typography>
          <Typography>
            {submittedFormData.name} عزیز، درخواست شما ثبت گردید
          </Typography>
          <Typography>
            توجه فرمایید طی یک الی دو روز آینده شماره تلفن همراه
            <b>{` 0${submittedFormData.mobileNumber}`}</b> در دسترس باشد تا در
            فرآیند رسیدگی به درخواست شما وقفه‌ای ایجاد نگردد.
          </Typography>

          <Button variant="contained">
            <Link href="/customer">بازگشت به صفحه اصلی</Link>
          </Button>
        </Stack>
      ) : (
        <SupportRequestForm
          onSubmittedForm={setIsRegisteredForm}
          onSubmittedFormData={setSubmittedFormData}
        />
      )}
    </Box>
  )
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const services = [
  'خدمات یک',
  'خدمات دو',
  'خدمات سه',
  'خدمات چهار',
  'خدمات پنج',
  'خدمات شش',
]

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

function SupportRequestForm({onSubmittedForm, onSubmittedFormData}) {
  const {
    mutate: mutateToAddRequest,
    data,
    isPending,
    isSuccess,
  } = useMutateData({
    url: ADD_REGISTER_REQUEST_API_URL,
  })
  const theme = useTheme()
  const [formInputs, setFormInputs] = React.useState({
    name: '',
    mobileNumber: '',
    phoneNumber: '',
    address: '',
    services: [],
    description: '',
  })

  React.useEffect(() => {
    if (isSuccess) {
      onSubmittedFormData(data.data)
      onSubmittedForm(true)
    }
  }, [data, isSuccess, onSubmittedForm, onSubmittedFormData])

  function handleOnChangeFormInputs(e) {
    const {name, value} = e.target
    setFormInputs(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleOnSubmitForm(e) {
    e.preventDefault()

    const formData = {
      ...formInputs,
      mobileNumber: +formInputs.mobileNumber,
      phoneNumber: +formInputs.phoneNumber,
    }

    mutateToAddRequest(formData)
  }

  return (
    <Stack spacing={2}>
      <Stack
        spacing={3}
        sx={{
          border: 1,
          borderColor: 'primary.main',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Typography variant="h5" textAlign="center">
          ثبت درخواست پشتیبانی
        </Typography>

        <Divider light sx={{borderWidth: 2, borderStyle: 'dashed'}} />

        <Typography textAlign="justify">
          ● با استفاده از این فرم می‌توانید درخواست خود را برای دریافت خدمات
          پشتیبانی ثبت نمایید.
        </Typography>
        <Typography textAlign="justify">
          ● پس از دریافت درخواست طی یک الی دو روز کاری جهت حضور در آدرس ثبت شده
          با شما تماس گرفته شده و هماهنگی‌های لازم انجام خواهد شد.
        </Typography>
        <Typography textAlign="justify">
          ● وارد کردن مقادیر برای ردیف ستاره‌دار الزامی است.
        </Typography>
      </Stack>

      <Stack
        component="form"
        sx={{
          gap: 1,
          '.fix-height': {
            minHeight: 80,
          },
          /* Chrome, Safari, Edge, Opera */
          'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button':
            {
              WebkitAppearance: 'none',
              margin: 0,
            },
          /* Firefox */
          'input[type=number]': {
            MozAppearance: 'textfield',
          },
        }}
        onSubmit={handleOnSubmitForm}
      >
        <CustomizedTextField
          id="name"
          className="fix-height"
          name="name"
          label="نام خانوادگی"
          placeholder="آقای/خانم رضایی"
          errorMessage="فقط حروف فارسی/انگلیسی مجاز است."
          fullWidth
          required
          autoFocus
          regex={/^[a-zA-Z\u0600-\u06FF\s]+$/}
          length="35"
          onReturnValue={value =>
            setFormInputs(prevState => ({...prevState, name: value}))
          }
        />
        <CustomizedTextField
          id="mobile-number"
          className="fix-height"
          name="mobileNumber"
          type="number"
          label="شماره موبایل"
          placeholder="نمونه: 09387069917"
          required
          regex={/^[۰0].*$/}
          length="11"
          errorMessage="شماره باید با صفر شروع شود"
          fullWidth
          onReturnValue={value =>
            setFormInputs(prevState => ({...prevState, mobileNumber: value}))
          }
        />

        <CustomizedTextField
          id="phone-number"
          className="fix-height"
          name="phoneNumber"
          type="number"
          label="شماره ثابت"
          placeholder="نمونه: 66743198"
          regex={/^[^۰0].*/}
          length="8"
          errorMessage="شماره باید بدون کد شهر وارد شود"
          fullWidth
          onReturnValue={value =>
            setFormInputs(prevState => ({...prevState, phoneNumber: value}))
          }
        />
        <CustomizedTextField
          id="address"
          name="address"
          label="آدرس"
          placeholder="نمونه: فلکه اول صادقیه، خیابان ستارخان، کوچه گلناز دهم، پلاک 16، واحد 2"
          helperText="آدرس دقیق پستی"
          multiline
          rows={2}
          fullWidth
          required
          onReturnValue={value =>
            setFormInputs(prevState => ({...prevState, address: value}))
          }
        />
        <FormControl fullWidth required className="fix-height">
          <InputLabel id="choose-services-label">خدمات</InputLabel>
          <Select
            labelId="choose-services-label"
            id="choose-services"
            name="services"
            multiple
            value={formInputs.services}
            onChange={handleOnChangeFormInputs}
            input={
              <OutlinedInput id="select-multiple-service" label="services" />
            }
            renderValue={selected => (
              <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                {selected.map(value => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {services.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, formInputs.services, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>بیش از یک گزینه می‌توانید انتخاب کنید</FormHelperText>
        </FormControl>
        <CustomizedTextField
          id="description"
          name="description"
          label="توضیحات"
          placeholder="در صورت نیاز جهت راهنمایی بیشتر بابت خدمات درخواستی، توضیحات لازم را ارائه نمایید..."
          multiline
          rows={6}
          fullWidth
          onReturnValue={value =>
            setFormInputs(prevState => ({...prevState, description: value}))
          }
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending || isSuccess}
          sx={{mt: 3}}
        >
          {isPending ? (
            <>
              {'در حال ارسال'} <CircularProgress size={15} sx={{mx: 1}} />
            </>
          ) : isSuccess ? (
            'با موفقیت ثبت شد'
          ) : (
            'ثبت درخواست'
          )}
        </Button>
      </Stack>
    </Stack>
  )
}
