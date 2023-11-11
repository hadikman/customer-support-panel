import * as React from 'react'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import SignIn from './auth.signin'
import CircularProgress from '@mui/material/CircularProgress'

export const AuthContext = React.createContext({
  isAuth: Boolean,
  onUpdateAuthState: () => {},
})

export default function Authentication({children, ...props}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const isToken = JSON.parse(localStorage.getItem('token')) !== null

    if (isToken) {
      setIsAuthenticated(true)
    }

    setIsLoading(false)
  }, [])

  const value = {isAuth: isAuthenticated, onUpdateAuthState: setIsAuthenticated}

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '100dvh',
            display: 'grid',
            placeContent: 'center',
          }}
        >
          <CircularProgress size={50} />
        </Box>
      ) : isAuthenticated ? (
        <>{children}</>
      ) : (
        <AuthenticationPage {...props} />
      )}
    </AuthContext.Provider>
  )
}

function AuthenticationPage({...props}) {
  const [value, setValue] = React.useState(0)

  function handleChangeTabs(event, newValue) {
    setValue(newValue)
  }

  return (
    <Box
      sx={{
        height: '100vh',
        backgroundImage: 'radial-gradient(#444cf7 0.5px, hsl(0 0% 85%) 0.5px)',
        backgroundSize: '10px 10px',
        pt: 6,
      }}
    >
      <Stack
        sx={{
          width: '35%',
          minWidth: '16rem',
          alignItems: 'center',
          bgcolor: 'hsl(0 0% 95%)',
          outline: '4px solid',
          outlineColor: 'hsl(337, 100%, 50%)',
          outlineOffset: '2px',
          borderRadius: 1,
          pt: 2,
          mx: 'auto',
        }}
        {...props}
      >
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={value} onChange={handleChangeTabs}>
            <Tab label="ورود کاربر" />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <SignIn />
        </CustomTabPanel>
      </Stack>
    </Box>
  )
}

function CustomTabPanel({children, value, index, ...other}) {
  return (
    <Box hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{p: 2}}>{children}</Box>}
    </Box>
  )
}
