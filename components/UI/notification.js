import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import IconButton from '@mui/material/IconButton'
import Icon from 'components/UI/icon'
import icons from 'library/icons-name'

const {close} = icons

function Notification({
  open,
  onClose,
  isInfo,
  isError,
  isSuccess,
  message,
  autoHideDuration = 6000,
  anchorOrigin = {vertical: 'bottom', horizontal: 'right'},
}) {
  function handleOnCloseSnackbar(event, reason) {
    if (reason === 'clickaway') {
      return
    }

    if (onClose) {
      onClose('')
    }
  }

  return (
    <Snackbar
      open={open}
      anchorOrigin={anchorOrigin}
      onClose={handleOnCloseSnackbar}
      autoHideDuration={autoHideDuration}
      action={
        <IconButton
          size="small"
          color="inherit"
          onClick={handleOnCloseSnackbar}
        >
          <Icon name={close} />
        </IconButton>
      }
    >
      {isInfo || isError || isSuccess ? (
        <Alert
          onClose={handleOnCloseSnackbar}
          variant="filled"
          severity={
            (isInfo && 'info') ||
            (isError && 'error') ||
            (isSuccess && 'success')
          }
        >
          {message}
        </Alert>
      ) : null}
    </Snackbar>
  )
}

export default Notification
