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
    MuiCssBaseline: {
      styleOverrides: theme => ({
        body: {
          backgroundColor: theme.palette.grey[700],
        },
      }),
    },
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
  return (
    <ThemeProvider theme={theme} {...props}>
      {children}
    </ThemeProvider>
  )
}
