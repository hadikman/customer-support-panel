import {createTheme, ThemeProvider} from '@mui/material/styles'
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
})

export default function MuiThemeProvider({children, ...props}) {
  return (
    <ThemeProvider theme={theme} {...props}>
      {children}
    </ThemeProvider>
  )
}
