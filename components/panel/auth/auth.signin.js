import * as React from 'react'
import {AuthContext} from './auth'
import useMutateData from 'hook/useMutateData'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Snackbar from '@mui/material/Snackbar'
import {keyframes} from '@mui/material'
import Icon from 'components/UI/icon'
import icons from 'library/icons-name'
import {AUTH_API_URL} from 'library/api-url'

const {shieldKeyhole} = icons

const bblFadInOut = keyframes({
  '0%, 80%, 100%': {boxShadow: '0 2.5em 0 -1.3em'},
  '40%': {boxShadow: '0 2.5em 0 0 '},
})

export default function SignIn() {
  const {mutate, data, isPending, isSuccess} = useMutateData({
    url: AUTH_API_URL,
    queryKey: [''],
  })
  const {onUpdateAuthState} = React.useContext(AuthContext)
  const [errorMessage, setErrorMessage] = React.useState('')

  const isError = errorMessage !== ''

  React.useEffect(() => {
    if (isSuccess) {
      if (data.success) {
        localStorage.setItem(
          'customer-support-panel-token',
          JSON.stringify(data.data),
        )
        onUpdateAuthState(true)
      } else {
        setErrorMessage('نام کاربری/رمز عبور اشتباه است')
      }
    }
  }, [isSuccess, data, onUpdateAuthState])

  function handleOnSubmitForm(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (isError) {
      setErrorMessage('')
    }

    const userData = {
      username: formData.get('username').trim(),
      password: formData.get('password').trim(),
    }

    mutate(userData)
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{m: 1, bgcolor: 'hsl(337, 100%, 50%)'}}>
          <Icon name={shieldKeyhole} size="large" color="hsl(0 0% 95%)" />
        </Avatar>
        <Typography component="h1" variant="h5">
          ورود به پنل
        </Typography>
        <Box
          component="form"
          onSubmit={handleOnSubmitForm}
          noValidate
          sx={{mt: 1}}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="نام کاربری"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="رمز عبور"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{mt: 3, mb: 2}}
          >
            ورود
          </Button>
        </Box>

        {isError && (
          <Snackbar open={isError}>
            <Typography
              variant="body2"
              sx={{
                bgcolor: 'error.light',
                color: 'error.contrastText',
                borderRadius: 1,
                p: 1,
              }}
            >
              {`${errorMessage}، .دوباره تلاش نمایید`}
            </Typography>
          </Snackbar>
        )}

        {isPending ? (
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(5px)',
              zIndex: 10000,
              '.loader-panel, .loader-panel:before, .loader-panel:after': {
                width: '2.5em',
                height: '2.5em',
                borderRadius: '50%',
                animationFillMode: 'both',
                animation: `${bblFadInOut} 1.8s infinite ease-in-out`,
              },
              '.loader-panel': {
                fontSize: '4px',
                textIndent: '-9999em',
                color: 'darkClr.main',
                transform: 'translateZ(0)',
                animationDelay: '-0.16s',
                position: 'relative',
              },
              '.loader-panel:before, .loader-panel:after': {
                content: '""',
                position: 'absolute',
                top: '0',
              },
              '.loader-panel:before': {
                left: '-3.5em',
                animationDelay: '-0.32s',
              },
              '.loader-panel:after': {
                left: '3.5em',
              },
            }}
          >
            <Box
              sx={{
                width: '60%',
                display: 'flex',
                justifyContent: 'center',
                gap: 3,
                mx: 'auto',
              }}
            >
              <Typography variant="h6" sx={{color: 'darkClr.main'}}>
                در حال ورود به حساب کاربری
              </Typography>
              <Box className="loader-panel"></Box>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Container>
  )
}
