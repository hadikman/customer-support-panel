import * as React from 'react'
import Link from 'next/link'
import {useTheme} from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
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

export default function RegisterPage() {
  const [isRegisteredForm, setIsRegisteredForm] = React.useState(false)

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
            توجه فرمایید طی یک الی دو روز آینده شماره تلفن همراه شما در دسترس
            باشد تا در فرآیند رسیدگی به درخواست شما وقفه‌ای ایجاد نگردد.
          </Typography>

          <Button variant="contained">
            <Link href="/customer">بازگشت به صفحه اصلی</Link>
          </Button>
        </Stack>
      ) : (
        <SupportRequestForm onSubmittedFrom={setIsRegisteredForm} />
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

function SupportRequestForm({onSubmittedFrom}) {
  const theme = useTheme()
  const [name, setName] = React.useState('')
  const [mobileNumber, setMobileNumber] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [selectServices, setSelectServices] = React.useState([])
  const [description, setDescription] = React.useState('')

  function handleOnChangeName(e) {
    setName(e.target.value)
  }

  function handleOnChangeMobileNumber(e) {
    setMobileNumber(e.target.value)
  }

  function handleOnChangePhoneNumber(e) {
    setPhoneNumber(e.target.value)
  }

  function handleOnChangeAddress(e) {
    setAddress(e.target.value)
  }

  function handleOnChangeSelectServices(e) {
    const value = e.target.value

    setSelectServices(typeof value === 'string' ? value.split(',') : value)
  }

  function handleOnChangeDescription(e) {
    setDescription(e.target.value)
  }

  function handleOnSubmitForm() {
    const formData = {
      name: name.trim(),
      mobileNumber: mobileNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      selectServices,
      description: description.trim(),
    }
    // TODO send a POST req to the API
    console.log(formData)

    onSubmittedFrom(true)
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
          با استفاده از این فرم می‌توانید درخواست خود را برای دریافت خدمات
          پشتیبانی ثبت نمایید.
        </Typography>
        <Typography textAlign="justify">
          پس از دریافت درخواست طی یک الی دو روز کاری جهت حضور در آدرس ثبت شده با
          شما تماس گرفته شده و هماهنگی‌های لازم انجام خواهد شد.
        </Typography>
      </Stack>

      <Stack
        component="form"
        sx={{
          gap: 1,
          '.fix-height': {
            height: 80,
          },
        }}
        onSubmit={handleOnSubmitForm}
      >
        <TextField
          id="name"
          className="fix-height"
          label="نام خانوادگی"
          placeholder="آقای/خانم رضایی"
          value={name}
          helperText="رزرو"
          fullWidth
          required
          onChange={handleOnChangeName}
        />
        <TextField
          id="mobile-number"
          className="fix-height"
          label="شماره موبایل"
          placeholder="09387069917"
          value={mobileNumber}
          helperText="رزرو"
          fullWidth
          required
          onChange={handleOnChangeMobileNumber}
        />
        <TextField
          id="phone-number"
          className="fix-height"
          label="شماره ثابت"
          placeholder="22113847"
          value={phoneNumber}
          helperText="رزرو"
          fullWidth
          onChange={handleOnChangePhoneNumber}
        />
        <TextField
          id="address"
          label="آدرس"
          placeholder="فلکه اول صادقیه، خیابان ستارخان، کوچه گلناز دهم، پلاک 16، واحد 2"
          value={address}
          helperText="رزرو"
          multiline
          rows={2}
          fullWidth
          required
          onChange={handleOnChangeAddress}
        />
        <FormControl fullWidth required className="fix-height">
          <InputLabel id="choose-services-label">خدمات</InputLabel>
          <Select
            labelId="choose-services-label"
            id="choose-services"
            multiple
            value={selectServices}
            onChange={handleOnChangeSelectServices}
            input={
              <OutlinedInput id="select-multiple-service" label="service" />
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
            <MenuItem disabled>بیش از یک مورد می‌توانید انتخاب کنید</MenuItem>
            {services.map(name => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, selectServices, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>رزرو</FormHelperText>
        </FormControl>
        <TextField
          id="description"
          label="توضیحات"
          placeholder="در صورت نیاز جهت راهنمایی بیشتر بابت خدمات درخواستی، توضیحات لازم را ارائه نمایید..."
          value={description}
          multiline
          rows={6}
          fullWidth
          onChange={handleOnChangeDescription}
        />

        <Button type="submit" variant="contained" size="large" sx={{mt: 3}}>
          ثبت درخواست
        </Button>
      </Stack>
    </Stack>
  )
}
