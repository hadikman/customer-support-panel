import * as React from 'react'
import TextField from '@mui/material/TextField'

export default function CustomizedTextField({
  id,
  className,
  label,
  placeholder,
  helperText,
  fullWidth,
  required,
  autoFocus,
  regex,
  length,
  errorMessage,
  onReturnValue,
}) {
  const [inputValue, setInuptValue] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')

  const isInputError = inputErrorMessage !== ''

  function handleOnChange(e) {
    const value = e.target.value
    const lengthState = +length ? false : true
    const regexState = regex ? false : true

    if ((+length && value.toString().length <= +length) || lengthState) {
      if (isInputError) {
        setInputErrorMessage('')
      }

      if ((regex && (regex.test(value) || value === '')) || regexState) {
        setInuptValue(value)
      } else {
        setInputErrorMessage(errorMessage)
      }
    }
  }

  function handleOnBlur() {
    if (isInputError && inputValue === '') {
      setInputErrorMessage('')
    }
    onReturnValue(inputValue.trim())
  }

  return (
    <TextField
      id={id}
      className={className}
      label={label}
      placeholder={placeholder}
      value={inputValue}
      helperText={inputErrorMessage || helperText}
      error={isInputError}
      fullWidth={fullWidth}
      required={required}
      autoFocus={autoFocus}
      onChange={handleOnChange}
      inputProps={{onBlur: handleOnBlur}}
    />
  )
}
