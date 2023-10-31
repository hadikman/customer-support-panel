import {createTheme, ThemeProvider} from '@mui/material/styles'

let theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'inherit',
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: 'monospace',
          fontSize: '0.875em',
          backgroundColor: 'hsl(0 0% 13%)',
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
