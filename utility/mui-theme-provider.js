import {useRouter} from 'next/router'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import {teal} from '@mui/material/colors'
import {faIR} from '@mui/material/locale'
import VAZIRMATN_FONT from './share-font'

let theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: VAZIRMATN_FONT.style.fontFamily,
  },
  components: {
    MuiModal: {
      styleOverrides: {
        root: {
          fontFamily: VAZIRMATN_FONT.style.fontFamily,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: VAZIRMATN_FONT.style.fontFamily,
        },
      },
    },
  },
  faIR,
})

theme = createTheme(theme, {
  palette: {
    accent: theme.palette.augmentColor({
      color: {
        main: teal[500],
      },
      name: 'accent',
    }),
  },
})

export default function MuiThemeProvider({children, ...props}) {
  const {route} = useRouter()
  const isPrint = route.startsWith('/dash-cp/print')

  theme = createTheme(theme, {
    components: {
      MuiCssBaseline: {
        styleOverrides: theme => ({
          body: {
            backgroundColor: isPrint
              ? theme.palette.background.paper
              : theme.palette.grey[700],
          },
        }),
      },
    },
  })

  return (
    <ThemeProvider theme={theme} {...props}>
      {children}
    </ThemeProvider>
  )
}
