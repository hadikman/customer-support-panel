import * as React from 'react'
import TextField from '@mui/material/TextField'

export default function CustomizedTextField({
  id,
  className,
  name,
  type,
  label,
  placeholder,
  helperText,
  fullWidth,
  required,
  autoFocus,
  regex,
  length,
  multiline,
  rows,
  isError,
  errorMessage,
  debounceDuration,
  onBlur,
  onFocus,
  onReturnValue,
  sx,
}) {
  const [inputValue, setInuptValue] = React.useState('')
  const [inputErrorMessage, setInputErrorMessage] = React.useState('')

  const isInputError = inputErrorMessage !== ''

  React.useEffect(() => {
    let timeout

    if (debounceDuration) {
      timeout = setTimeout(() => {
        onReturnValue(inputValue)
      }, debounceDuration)
    }

    return () => {
      if (debounceDuration) {
        clearTimeout(timeout)
      }
    }
  }, [debounceDuration, inputValue, onReturnValue])

  function handleOnChange(e) {
    const value = e.target.value
    const lengthState = +length ? false : true
    const regexState = regex ? false : true

    if ((+length && value.toString().length <= +length) || lengthState) {
      if (isInputError) {
        setInputErrorMessage('')
      }

      if ((regex && (regex.test(value) || value === '')) || regexState) {
        setInuptValue(convertFaToEnNumbers(value))
      } else {
        setInputErrorMessage(errorMessage)
      }
    }
  }

  function handleOnFocus(e) {
    if (onFocus) {
      onFocus(e)
    }
  }

  function handleOnBlur(e) {
    if (isInputError && inputValue === '') {
      setInputErrorMessage('')
    }

    if (onBlur) {
      onBlur(e)
    }

    onReturnValue(inputValue.trim())
  }

  return (
    <TextField
      id={id}
      className={className}
      name={name}
      type={type}
      label={label}
      placeholder={placeholder}
      value={inputValue}
      helperText={inputErrorMessage || helperText}
      error={isInputError || isError}
      fullWidth={fullWidth}
      required={required}
      autoFocus={autoFocus}
      multiline={multiline}
      rows={rows}
      onChange={handleOnChange}
      inputProps={{onFocus: handleOnFocus, onBlur: handleOnBlur}}
      sx={{
        ...(type === 'number' && {
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
        }),
        ...sx,
      }}
    />
  )
}

function convertFaToEnNumbers(persianNumber) {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹'
  const englishDigits = '0123456789'

  const digitMap = new Map(
    [...persianDigits].map((d, i) => [d, englishDigits[i]]),
  )

  return persianNumber.replace(/[۰-۹]/g, match => digitMap.get(match))
}
